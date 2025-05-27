export interface ActionInputs {
    accessKey: string;
    secretKey: string;
    region: string;
    bucketName: string;
    operation: 'upload' | 'download' | 'sync' | 'create-bucket' | 'delete-bucket';
    localPath?: string;
    obsPath?: string;
    include?: string[];
    exclude?: string[];
    preserveStructure: boolean;
    concurrency: number;
    retryCount: number;
    dryRun: boolean;
    progress: boolean;
    checksumValidation: boolean;
    storageClass: 'STANDARD' | 'WARM' | 'COLD';
    publicRead: boolean;
    timeout: number;
}
export interface OperationResult {
    filesProcessed: number;
    bytesTransferred: number;
    operationTime: number;
    successCount: number;
    errorCount: number;
    fileList: ProcessedFile[];
    errors: string[];
    uploadUrls?: string[];
}
export interface ProcessedFile {
    localPath: string;
    remotePath: string;
    size: number;
    status: 'success' | 'error' | 'skipped';
    error?: string;
    checksum?: string;
    url?: string;
}
export interface FileOperation {
    localPath: string;
    remotePath: string;
    size?: number;
    operation: 'upload' | 'download' | 'delete';
}
export interface OBSConfig {
    access_key_id: string;
    secret_access_key: string;
    server: string;
    region?: string;
    signature?: string;
    path_style?: boolean;
    ssl_verify?: boolean;
    max_retry_count?: number;
    timeout?: number;
}
