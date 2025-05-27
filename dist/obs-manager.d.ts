import { ActionInputs, OperationResult } from './types';
export declare class OBSManager {
    private inputs;
    private client;
    private fileManager;
    private limit;
    constructor(inputs: ActionInputs);
    private initializeClient;
    private getServerEndpoint;
    execute(): Promise<OperationResult>;
    private performUpload;
    private uploadFile;
    private performDownload;
    private performSync;
    private createBucket;
    private deleteBucket;
    private delay;
    close(): void;
}
