import { ActionInputs, FileOperation } from './types';
export declare class FileManager {
    private inputs;
    private static readonly LARGE_FILE_THRESHOLD;
    constructor(inputs: ActionInputs);
    resolveFiles(): Promise<FileOperation[]>;
    private expandPattern;
    private filterFiles;
    private matchesPattern;
    private createFileOperation;
    private getRemotePath;
    getFileSize(filePath: string): Promise<number>;
    readFile(filePath: string): Promise<Buffer>;
    writeFile(filePath: string, data: Buffer): Promise<void>;
    calculateMD5(filePath: string): Promise<string>;
    isLargeFile(filePath: string): Promise<boolean>;
}
