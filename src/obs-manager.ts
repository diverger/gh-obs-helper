import ObsClient from 'esdk-obs-nodejs';
import pLimit from 'p-limit';
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
      server: this.getServerEndpoint()
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

  private async uploadFile(operation: FileOperation): Promise<ProcessedFile> {
    const maxRetries = this.inputs.retryCount;
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          logProgress(`Retry ${attempt}/${maxRetries}: ${operation.localPath}`, this.inputs.progress);
          await this.delay(1000 * attempt); // Exponential backoff
        }

        const fileData = await this.fileManager.readFile(operation.localPath);

        const uploadParams: any = {
          Bucket: this.inputs.bucketName,
          Key: operation.remotePath,
          Body: fileData,
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
            size: operation.size || fileData.length,
            status: 'success'
          };

          // Add checksum if validation is enabled
          if (this.inputs.checksumValidation) {
            processedFile.checksum = createHash('md5').update(fileData).digest('hex');
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
    // Implementation for download operation
    logProgress('Download operation not yet implemented', this.inputs.progress);
    return {
      filesProcessed: 0,
      bytesTransferred: 0,
      operationTime: 0,
      successCount: 0,
      errorCount: 0,
      fileList: [],
      errors: ['Download operation not implemented']
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

  close(): void {
    if (this.client) {
      this.client.close();
    }
  }
}
