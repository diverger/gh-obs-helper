import { glob } from 'glob';
import { promises as fs } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';
import { ActionInputs, FileOperation } from './types';
import { logProgress, logError } from './utils';

export class FileManager {
  constructor(private inputs: ActionInputs) {}

  async resolveFiles(): Promise<FileOperation[]> {
    if (!this.inputs.localPath) {
      throw new Error('Local path is required for file operations');
    }

    logProgress('Resolving file patterns...', this.inputs.progress);

    const sourcePatterns = this.inputs.localPath.split(',').map(s => s.trim());
    const allFiles: string[] = [];

    for (const pattern of sourcePatterns) {
      const files = await this.expandPattern(pattern);
      allFiles.push(...files);
    }

    // Remove duplicates
    const uniqueFiles = [...new Set(allFiles)];

    // Filter files
    const filteredFiles = await this.filterFiles(uniqueFiles);

    // Convert to operations
    const operations = await Promise.all(
      filteredFiles.map(file => this.createFileOperation(file))
    );

    logProgress(`Found ${operations.length} files to process`, this.inputs.progress);
    return operations;
  }

  private async expandPattern(pattern: string): Promise<string[]> {
    try {
      // Check if pattern contains wildcards
      if (pattern.includes('*') || pattern.includes('?')) {
        const files = await glob(pattern, {
          dot: true,
          nodir: true,
          ignore: this.inputs.exclude
        });
        return files;
      } else {
        // Single file or directory
        const stats = await stat(pattern);
        if (stats.isFile()) {
          return [pattern];
        } else if (stats.isDirectory()) {
          // Get all files in directory
          const files = await glob(path.join(pattern, '**/*'), {
            dot: true,
            nodir: true,
            ignore: this.inputs.exclude
          });
          return files;
        }
      }
    } catch (error) {
      logError(`Error expanding pattern '${pattern}': ${error}`);
    }

    return [];
  }

  private async filterFiles(files: string[]): Promise<string[]> {
    const filtered: string[] = [];

    for (const file of files) {
      // Check if file exists and is readable
      try {
        const stats = await stat(file);
        if (!stats.isFile()) continue;

        // Apply include patterns
        if (this.inputs.include && this.inputs.include.length > 0) {
          const included = this.inputs.include.some(pattern =>
            this.matchesPattern(file, pattern)
          );
          if (!included) continue;
        }

        // Apply exclude patterns
        if (this.inputs.exclude && this.inputs.exclude.length > 0) {
          const excluded = this.inputs.exclude.some(pattern =>
            this.matchesPattern(file, pattern)
          );
          if (excluded) {
            logProgress(`Excluding: ${file}`, this.inputs.progress);
            continue;
          }
        }

        filtered.push(file);
      } catch (error) {
        logError(`Cannot access file '${file}': ${error}`);
      }
    }

    return filtered;
  }

  private matchesPattern(filePath: string, pattern: string): boolean {
    // Simple pattern matching - can be enhanced with more sophisticated matching
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(filePath);
    }
    return filePath.includes(pattern);
  }

  private async createFileOperation(localPath: string): Promise<FileOperation> {
    const remotePath = this.getRemotePath(localPath);

    try {
      const stats = await stat(localPath);
      return {
        localPath,
        remotePath,
        size: stats.size,
        operation: this.inputs.operation as 'upload' | 'download'
      };
    } catch (error) {
      return {
        localPath,
        remotePath,
        operation: this.inputs.operation as 'upload' | 'download'
      };
    }
  }

  private getRemotePath(localPath: string): string {
    const destination = this.inputs.obsPath || '';

    if (!this.inputs.preserveStructure) {
      // Just use filename
      const filename = path.basename(localPath);
      return destination ? path.posix.join(destination, filename) : filename;
    }

    // Preserve structure
    if (this.inputs.localPath && !this.inputs.localPath.includes('*')) {
      // Single file or directory source
      try {
        const sourceStat = require('fs').statSync(this.inputs.localPath);
        if (sourceStat.isDirectory()) {
          // Remove source directory from path and preserve relative structure
          const relativePath = path.relative(this.inputs.localPath, localPath);
          return destination ? path.posix.join(destination, relativePath) : relativePath;
        } else {
          // Single file
          const filename = path.basename(localPath);
          return destination ? path.posix.join(destination, filename) : filename;
        }
      } catch (error) {
        // Fallback to filename only
        const filename = path.basename(localPath);
        return destination ? path.posix.join(destination, filename) : filename;
      }
    }

    // Wildcard pattern - preserve relative structure from current directory
    const filename = path.basename(localPath);
    return destination ? path.posix.join(destination, filename) : filename;
  }

  async getFileSize(filePath: string): Promise<number> {
    try {
      const stats = await stat(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  async readFile(filePath: string): Promise<Buffer> {
    return await fs.readFile(filePath);
  }

  async writeFile(filePath: string, data: Buffer): Promise<void> {
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, data);
  }
}
