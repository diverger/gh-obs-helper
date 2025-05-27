/*
 * \file index.ts
 * \date Tuesday, 2025/05/27 17:50:05
 *
 * \author diverger <diverger@live.cn>
 *
 * \brief Main entry point for the Huawei Cloud OBS GitHub Action
 *        Handles input parsing, operation execution, and result reporting
 *        for file uploads, downloads, and bucket management.
 *
 * Last Modified: Wednesday, 2025/05/28 7:41:56
 *
 * Copyright (c) 2025
 * Licensed under the MIT License
 * ---------------------------------------------------------
 * HISTORY:
 * 2025-05-27	diverger	Initial GitHub Action implementation
 * 2025-05-28	diverger	Added comprehensive error handling and result reporting
 */

import * as core from '@actions/core';
import { getInputs, setOutputs, logError, logSuccess } from './utils';
import { OBSManager } from './obs-manager';

async function main(): Promise<void> {
  let obsManager: OBSManager | null = null;

  try {
    // Get and validate inputs
    const inputs = getInputs();

    // Validate required inputs based on operation
    if (['upload', 'download', 'sync'].includes(inputs.operation) && !inputs.localPath) {
      throw new Error(`Local path is required for ${inputs.operation} operation`);
    }

    if (['download', 'sync'].includes(inputs.operation) && !inputs.obsPath) {
      throw new Error(`OBS path is required for ${inputs.operation} operation`);
    }

    // Create OBS manager and execute operation
    obsManager = new OBSManager(inputs);
    const result = await obsManager.execute();

    // Set outputs
    setOutputs(result);

    // Log summary
    if (result.errorCount === 0) {
      logSuccess(`Operation completed successfully! Processed ${result.filesProcessed} files (${formatBytes(result.bytesTransferred)})`);
    } else {
      logError(`Operation completed with ${result.errorCount} errors out of ${result.filesProcessed} files`);

      // Log first few errors for debugging
      result.errors.slice(0, 5).forEach(error => {
        core.error(error);
      });

      if (result.errors.length > 5) {
        core.error(`... and ${result.errors.length - 5} more errors`);
      }

      // Set action as failed if there were any errors
      if (result.successCount === 0) {
        core.setFailed('All operations failed');
      }
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logError(`Action failed: ${errorMessage}`);
    core.setFailed(errorMessage);
  } finally {
    // Clean up resources
    if (obsManager) {
      obsManager.close();
    }
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Run the action
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { main };
