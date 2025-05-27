/*
 * \file obs-manager.ts
 * \date Wednesday, 2025/05/28 1:31:40
 *
 * \author diverger <diverger@live.cn>
 *
 * \brief OBS Manager class for handling Huawei Cloud Object Storage operations
 *        Supports upload, download, sync, and bucket management with streaming
 *        uploads for large files to avoid memory constraints.
 *
 * Last Modified: Wednesday, 2025/05/28 7:40:55
 *
 * Copyright (c) 2025
 * Licensed under the MIT License
 * ---------------------------------------------------------
 * HISTORY:
 * 2025-05-28	diverger	Implemented streaming uploads to fix large file buffer overflow
 */

import ObsClient from 'esdk-obs-nodejs';
import pLimit from 'p-limit';
import path from 'path';
import { ActionInputs, OBSConfig, FileOperation, ProcessedFile, OperationResult } from './types';
import { FileManager } from './file-manager';
import { logProgress, logSuccess, logError, logWarning } from './utils';
import { createHash } from 'crypto';

export class OBSManager {
  private client: any;
  private fileManager: FileManager;
  private limit: any;

  constructor(private inputs: ActionInputs) {
    this.fileManager = new FileManager(inputs);
    this.limit = pLimit(inputs.concurrency);
    this.initializeClient();
  }

  private initializeClient(): void {
    const config: OBSConfig = {
      access_key_id: this.inputs.accessKey,
      secret_access_key: this.inputs.secretKey,
      server: this.getServerEndpoint(),
      timeout: this.inputs.timeout,
      max_retry_count: this.inputs.retryCount
    };

    this.client = new ObsClient(config);
  }

  private getServerEndpoint(): string {
    // Map regions to OBS endpoints
    const regionEndpoints: Record<string, string> = {
      'cn-north-1': 'https://obs.cn-north-1.myhuaweicloud.com',
      'cn-north-4': 'https://obs.cn-north-4.myhuaweicloud.com',
      'cn-east-2': 'https://obs.cn-east-2.myhuaweicloud.com',
      'cn-east-3': 'https://obs.cn-east-3.myhuaweicloud.com',
      'cn-south-1': 'https://obs.cn-south-1.myhuaweicloud.com',
      'ap-southeast-1': 'https://obs.ap-southeast-1.myhuaweicloud.com',
      'ap-southeast-3': 'https://obs.ap-southeast-3.myhuaweicloud.com'
    };

    return regionEndpoints[this.inputs.region] || `https://obs.${this.inputs.region}.myhuaweicloud.com`;
  }

  async execute(): Promise<OperationResult> {
    const startTime = Date.now();

    logProgress(`Starting ${this.inputs.operation} operation...`, this.inputs.progress);

    try {
      switch (this.inputs.operation) {
        case 'upload':
          return await this.performUpload();
        case 'download':
          return await this.performDownload();
        case 'sync':
          return await this.performSync();
        case 'create-bucket':
          return await this.createBucket();
        case 'delete-bucket':
          return await this.deleteBucket();
        default:
          throw new Error(`Unsupported operation: ${this.inputs.operation}`);
      }
    } catch (error) {
      logError(`Operation failed: ${error}`);
      throw error;
    } finally {
      const operationTime = (Date.now() - startTime) / 1000;
      logProgress(`Operation completed in ${operationTime.toFixed(2)} seconds`, this.inputs.progress);
    }
  }

  private async performUpload(): Promise<OperationResult> {
    const operations = await this.fileManager.resolveFiles();

    if (this.inputs.dryRun) {
      logProgress('DRY RUN - No files will be uploaded', this.inputs.progress);
      operations.forEach(op => {
        logProgress(`Would upload: ${op.localPath} -> ${op.remotePath}`, this.inputs.progress);
      });

      return {
        filesProcessed: operations.length,
        bytesTransferred: 0,
        operationTime: 0,
        successCount: 0,
        errorCount: 0,
        fileList: [],
        errors: []
      };
    }

    const results: ProcessedFile[] = [];
    const errors: string[] = [];

    logProgress(`Uploading ${operations.length} files with ${this.inputs.concurrency} concurrent connections...`, this.inputs.progress);

    const uploadPromises = operations.map(operation =>
      this.limit(() => this.uploadFile(operation))
    );

    const uploadResults = await Promise.allSettled(uploadPromises);

    uploadResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
        if (result.value.status === 'success') {
          logSuccess(`Uploaded: ${result.value.localPath} -> ${result.value.remotePath}`);
        } else {
          logError(`Failed: ${result.value.localPath} - ${result.value.error}`);
          errors.push(result.value.error || 'Unknown error');
        }
      } else {
        const operation = operations[index];
        const errorMsg = `Upload failed: ${operation.localPath} - ${result.reason}`;
        logError(errorMsg);
        errors.push(errorMsg);
        results.push({
          localPath: operation.localPath,
          remotePath: operation.remotePath,
          size: operation.size || 0,
          status: 'error',
          error: result.reason?.toString()
        });
      }
    });

    const successCount = results.filter(r => r.status === 'success').length;
    const bytesTransferred = results
      .filter(r => r.status === 'success')
      .reduce((total, file) => total + file.size, 0);

    // Collect URLs from successful uploads
    const uploadUrls = results
      .filter(r => r.status === 'success' && r.url)
      .map(r => r.url!);

    return {
      filesProcessed: results.length,
      bytesTransferred,
      operationTime: 0, // Will be set by caller
      successCount,
      errorCount: results.length - successCount,
      fileList: results,
      errors,
      uploadUrls
    };
  }

  private async uploadFile(operation: FileOperation): Promise<ProcessedFile> {
    const maxRetries = this.inputs.retryCount;
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          logProgress(`Retry ${attempt}/${maxRetries}: ${operation.localPath}`, this.inputs.progress);
          await this.delay(1000 * attempt); // Exponential backoff
        }

        // Use streaming upload for better memory efficiency with large files
        const uploadParams: any = {
          Bucket: this.inputs.bucketName,
          Key: operation.remotePath,
          SourceFile: operation.localPath, // Use file path instead of loading into memory
          StorageClass: this.inputs.storageClass
        };

        if (this.inputs.publicRead) {
          uploadParams.ACL = 'public-read';
        }

        const result = await this.client.putObject(uploadParams);

        if (result.CommonMsg.Status === 200) {
          const processedFile: ProcessedFile = {
            localPath: operation.localPath,
            remotePath: operation.remotePath,
            size: operation.size || await this.fileManager.getFileSize(operation.localPath),
            status: 'success'
          };

          // Generate URL for the uploaded file
          if (this.inputs.publicRead) {
            // For public files, use direct URL
            processedFile.url = this.generateObjectUrl(operation.remotePath);
          } else {
            // For private files, generate signed URL (valid for 1 hour)
            processedFile.url = this.generateSignedUrl(operation.remotePath, 3600);
          }

          // Add checksum if validation is enabled
          if (this.inputs.checksumValidation) {
            // For streaming uploads, calculate checksum efficiently using streaming
            processedFile.checksum = await this.fileManager.calculateMD5(operation.localPath);
          }

          return processedFile;
        } else {
          throw new Error(`Upload failed with status: ${result.CommonMsg.Status}`);
        }
      } catch (error) {
        lastError = error;
        if (attempt === maxRetries) {
          logError(`Failed after ${maxRetries + 1} attempts: ${operation.localPath}`);
        }
      }
    }

    return {
      localPath: operation.localPath,
      remotePath: operation.remotePath,
      size: operation.size || 0,
      status: 'error',
      error: lastError?.toString() || 'Unknown error'
    };
  }

  private async performDownload(): Promise<OperationResult> {
    const operations = await this.resolveDownloadOperations();

    if (this.inputs.dryRun) {
      logProgress('DRY RUN - No files will be downloaded', this.inputs.progress);
      operations.forEach(op => {
        logProgress(`Would download: ${op.remotePath} -> ${op.localPath}`, this.inputs.progress);
      });

      return {
        filesProcessed: operations.length,
        bytesTransferred: 0,
        operationTime: 0,
        successCount: 0,
        errorCount: 0,
        fileList: [],
        errors: []
      };
    }

    const results: ProcessedFile[] = [];
    const errors: string[] = [];

    logProgress(`Downloading ${operations.length} files with ${this.inputs.concurrency} concurrent connections...`, this.inputs.progress);

    const downloadPromises = operations.map(operation =>
      this.limit(() => this.downloadFile(operation))
    );

    const downloadResults = await Promise.allSettled(downloadPromises);

    downloadResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
        if (result.value.status === 'success') {
          logSuccess(`Downloaded: ${result.value.remotePath} -> ${result.value.localPath}`);
        } else {
          logError(`Failed: ${result.value.remotePath} - ${result.value.error}`);
          errors.push(result.value.error || 'Unknown error');
        }
      } else {
        const operation = operations[index];
        const errorMsg = `Download failed: ${operation.remotePath} - ${result.reason}`;
        logError(errorMsg);
        errors.push(errorMsg);
        results.push({
          localPath: operation.localPath,
          remotePath: operation.remotePath,
          size: operation.size || 0,
          status: 'error',
          error: result.reason?.toString()
        });
      }
    });

    const successCount = results.filter(r => r.status === 'success').length;
    const bytesTransferred = results
      .filter(r => r.status === 'success')
      .reduce((total, file) => total + file.size, 0);

    return {
      filesProcessed: results.length,
      bytesTransferred,
      operationTime: 0, // Will be set by caller
      successCount,
      errorCount: results.length - successCount,
      fileList: results,
      errors
    };
  }

  private async resolveDownloadOperations(): Promise<FileOperation[]> {
    if (!this.inputs.obsPath) {
      throw new Error('OBS path is required for download operation');
    }

    logProgress('Resolving OBS objects to download...', this.inputs.progress);

    // List objects from OBS
    const obsObjects = await this.listOBSObjects(this.inputs.obsPath);

    // Filter objects based on include/exclude patterns
    const filteredObjects = this.filterOBSObjects(obsObjects);

    // Convert to download operations
    const operations = filteredObjects.map(obj => this.createDownloadOperation(obj));

    logProgress(`Found ${operations.length} objects to download`, this.inputs.progress);
    return operations;
  }

  private async listOBSObjects(prefix: string): Promise<any[]> {
    const objects: any[] = [];
    let isTruncated = true;
    let nextMarker = '';

    while (isTruncated) {
      try {
        const listParams: any = {
          Bucket: this.inputs.bucketName,
          Prefix: prefix,
          MaxKeys: 1000
        };

        if (nextMarker) {
          listParams.Marker = nextMarker;
        }

        const result = await this.client.listObjects(listParams);

        if (result.CommonMsg.Status === 200) {
          if (result.InterfaceResult.Contents) {
            objects.push(...result.InterfaceResult.Contents);
          }

          isTruncated = result.InterfaceResult.IsTruncated === 'true';
          nextMarker = result.InterfaceResult.NextMarker || '';
        } else {
          throw new Error(`Failed to list objects: ${result.CommonMsg.Status}`);
        }
      } catch (error) {
        logError(`Error listing OBS objects: ${error}`);
        throw error;
      }
    }

    return objects;
  }

  private filterOBSObjects(objects: any[]): any[] {
    return objects.filter(obj => {
      const key = obj.Key;

      // Skip directories (objects ending with /)
      if (key.endsWith('/')) {
        return false;
      }

      // Apply include patterns
      if (this.inputs.include && this.inputs.include.length > 0) {
        const included = this.inputs.include.some(pattern =>
          this.matchesPattern(key, pattern)
        );
        if (!included) return false;
      }

      // Apply exclude patterns
      if (this.inputs.exclude && this.inputs.exclude.length > 0) {
        const excluded = this.inputs.exclude.some(pattern =>
          this.matchesPattern(key, pattern)
        );
        if (excluded) {
          logProgress(`Excluding: ${key}`, this.inputs.progress);
          return false;
        }
      }

      return true;
    });
  }

  private matchesPattern(path: string, pattern: string): boolean {
    // Simple pattern matching implementation
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.')
      .replace(/\*\*/g, '.*');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  }

  private createDownloadOperation(obsObject: any): FileOperation {
    const remotePath = obsObject.Key;
    let localPath: string;

    if (this.inputs.localPath) {
      if (this.inputs.preserveStructure) {
        // Preserve the full OBS path structure
        localPath = path.join(this.inputs.localPath, remotePath);
      } else {
        // Just use the filename
        const filename = path.basename(remotePath);
        localPath = path.join(this.inputs.localPath, filename);
      }
    } else {
      // Default to current directory with preserved structure
      localPath = this.inputs.preserveStructure ? remotePath : path.basename(remotePath);
    }

    return {
      localPath: path.normalize(localPath),
      remotePath,
      size: parseInt(obsObject.Size) || 0,
      operation: 'download'
    };
  }

  private async downloadFile(operation: FileOperation): Promise<ProcessedFile> {
    const maxRetries = this.inputs.retryCount;
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          logProgress(`Retry ${attempt}/${maxRetries}: ${operation.remotePath}`, this.inputs.progress);
          await this.delay(1000 * attempt); // Exponential backoff
        }

        const downloadParams = {
          Bucket: this.inputs.bucketName,
          Key: operation.remotePath
        };

        const result = await this.client.getObject(downloadParams);

        if (result.CommonMsg.Status === 200) {
          // Write file to local path
          await this.fileManager.writeFile(operation.localPath, result.InterfaceResult.Content);

          const processedFile: ProcessedFile = {
            localPath: operation.localPath,
            remotePath: operation.remotePath,
            size: operation.size || Buffer.byteLength(result.InterfaceResult.Content),
            status: 'success'
          };

          // Add checksum if validation is enabled
          if (this.inputs.checksumValidation) {
            processedFile.checksum = createHash('md5').update(result.InterfaceResult.Content).digest('hex');
          }

          return processedFile;
        } else {
          throw new Error(`Download failed with status: ${result.CommonMsg.Status}`);
        }
      } catch (error) {
        lastError = error;
        if (attempt === maxRetries) {
          logError(`Failed after ${maxRetries + 1} attempts: ${operation.remotePath}`);
        }
      }
    }

    return {
      localPath: operation.localPath,
      remotePath: operation.remotePath,
      size: operation.size || 0,
      status: 'error',
      error: lastError?.toString() || 'Unknown error'
    };
  }

  private async performSync(): Promise<OperationResult> {
    // Implementation for sync operation
    logProgress('Sync operation not yet implemented', this.inputs.progress);
    return {
      filesProcessed: 0,
      bytesTransferred: 0,
      operationTime: 0,
      successCount: 0,
      errorCount: 0,
      fileList: [],
      errors: ['Sync operation not implemented']
    };
  }

  private async createBucket(): Promise<OperationResult> {
    try {
      const result = await this.client.createBucket({
        Bucket: this.inputs.bucketName,
        StorageClass: this.inputs.storageClass
      });

      if (result.CommonMsg.Status === 200) {
        logSuccess(`Bucket created: ${this.inputs.bucketName}`);
        return {
          filesProcessed: 1,
          bytesTransferred: 0,
          operationTime: 0,
          successCount: 1,
          errorCount: 0,
          fileList: [],
          errors: []
        };
      } else {
        throw new Error(`Bucket creation failed with status: ${result.CommonMsg.Status}`);
      }
    } catch (error) {
      const errorMsg = `Failed to create bucket: ${error}`;
      logError(errorMsg);
      return {
        filesProcessed: 0,
        bytesTransferred: 0,
        operationTime: 0,
        successCount: 0,
        errorCount: 1,
        fileList: [],
        errors: [errorMsg]
      };
    }
  }

  private async deleteBucket(): Promise<OperationResult> {
    try {
      const result = await this.client.deleteBucket({
        Bucket: this.inputs.bucketName
      });

      if (result.CommonMsg.Status === 204) {
        logSuccess(`Bucket deleted: ${this.inputs.bucketName}`);
        return {
          filesProcessed: 1,
          bytesTransferred: 0,
          operationTime: 0,
          successCount: 1,
          errorCount: 0,
          fileList: [],
          errors: []
        };
      } else {
        throw new Error(`Bucket deletion failed with status: ${result.CommonMsg.Status}`);
      }
    } catch (error) {
      const errorMsg = `Failed to delete bucket: ${error}`;
      logError(errorMsg);
      return {
        filesProcessed: 0,
        bytesTransferred: 0,
        operationTime: 0,
        successCount: 0,
        errorCount: 1,
        fileList: [],
        errors: [errorMsg]
      };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateObjectUrl(objectKey: string): string {
    // Generate direct URL for the uploaded object
    const endpoint = this.getServerEndpoint().replace('https://', '');
    return `https://${this.inputs.bucketName}.${endpoint}/${objectKey}`;
  }

  private generateSignedUrl(objectKey: string, expiresInSeconds: number = 3600): string {
    try {
      // Generate a pre-signed URL for accessing the object
      const signedUrl = this.client.createSignedUrlSync('GetObject', {
        Bucket: this.inputs.bucketName,
        Key: objectKey,
        Expires: expiresInSeconds
      });
      return signedUrl;
    } catch (error) {
      logWarning(`Failed to generate signed URL for ${objectKey}: ${error}`);
      // Fall back to direct URL
      return this.generateObjectUrl(objectKey);
    }
  }

  close(): void {
    if (this.client) {
      this.client.close();
    }
  }
}
