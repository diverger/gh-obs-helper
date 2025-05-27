/*
 * \file types.ts
 * \date Wednesday, 2025/05/28 1:31:40
 *
 * \author diverger <diverger@live.cn>
 *
 * \brief Type definitions for the Huawei Cloud OBS GitHub Action
 *        Defines interfaces for action inputs, OBS configuration, file operations,
 *        and operation results with comprehensive type safety.
 *
 * Last Modified: Wednesday, 2025/05/28 7:42:29
 *
 * Copyright (c) 2025
 * Licensed under the MIT License
 * ---------------------------------------------------------
 * HISTORY:
 * 2025-05-28	diverger	Initial type definitions for OBS operations
 * 2025-05-28	diverger	Extended OBSConfig with complete SDK properties for timeout support
 */

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
