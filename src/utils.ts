import * as core from '@actions/core';
import { ActionInputs } from './types';

export function getInputs(): ActionInputs {
  const parseStringArray = (input: string): string[] => {
    if (!input.trim()) return [];
    return input.split(',').map(s => s.trim()).filter(s => s.length > 0);
  };

  const parseBool = (input: string, defaultValue: boolean = false): boolean => {
    const value = input.toLowerCase().trim();
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    return defaultValue;
  };

  const parseInt = (input: string, defaultValue: number): number => {
    const parsed = Number.parseInt(input, 10);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  };

  return {
    accessKey: core.getInput('access_key', { required: true }),
    secretKey: core.getInput('secret_key', { required: true }),
    region: core.getInput('region', { required: true }) || 'cn-north-4',
    bucketName: core.getInput('bucket', { required: true }),
    operation: core.getInput('operation') as any || 'upload',
    localPath: core.getInput('local_path') || undefined,
    obsPath: core.getInput('obs_path') || undefined,
    include: parseStringArray(core.getInput('include')),
    exclude: parseStringArray(core.getInput('exclude')),
    preserveStructure: parseBool(core.getInput('preserve_structure'), true),
    concurrency: parseInt(core.getInput('concurrency'), 10),
    retryCount: parseInt(core.getInput('retry_count'), 3),
    dryRun: parseBool(core.getInput('dry_run'), false),
    progress: parseBool(core.getInput('progress'), true),
    checksumValidation: parseBool(core.getInput('checksum_validation'), false),
    storageClass: (core.getInput('storage_class') as any) || 'STANDARD',
    publicRead: parseBool(core.getInput('public_read'), false)
  };
}

export function setOutputs(result: import('./types').OperationResult): void {
  core.setOutput('files_processed', result.filesProcessed.toString());
  core.setOutput('bytes_transferred', result.bytesTransferred.toString());
  core.setOutput('operation_time', result.operationTime.toString());
  core.setOutput('success_count', result.successCount.toString());
  core.setOutput('error_count', result.errorCount.toString());
  core.setOutput('file_list', JSON.stringify(result.fileList));
}

export function logProgress(message: string, progress: boolean = true): void {
  if (progress) {
    core.info(`🔄 ${message}`);
  }
}

export function logSuccess(message: string): void {
  core.info(`✅ ${message}`);
}

export function logError(message: string): void {
  core.error(`❌ ${message}`);
}

export function logWarning(message: string): void {
  core.warning(`⚠️ ${message}`);
}
