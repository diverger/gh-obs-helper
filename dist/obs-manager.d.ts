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
    private resolveDownloadOperations;
    private listOBSObjects;
    private filterOBSObjects;
    private matchesPattern;
    private createDownloadOperation;
    private downloadFile;
    private performSync;
    private createBucket;
    private deleteBucket;
    private delay;
    private generateObjectUrl;
    private generateSignedUrl;
    close(): void;
}
