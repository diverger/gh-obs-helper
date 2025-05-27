import { ActionInputs } from './types';
export declare function getInputs(): ActionInputs;
export declare function setOutputs(result: import('./types').OperationResult): void;
export declare function logProgress(message: string, progress?: boolean): void;
export declare function logSuccess(message: string): void;
export declare function logError(message: string): void;
export declare function logWarning(message: string): void;
