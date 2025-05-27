/*
 * \file esdk-obs-nodejs.d.ts
 * \date Tuesday, 2025/05/27 18:47:31
 *
 * \author diverger <diverger@live.cn>
 *
 * \brief
 *
 * TODO: long description
 *
 * Last Modified: Wednesday, 2025/05/28 7:42:56
 *
 * Copyright (c) 2025
 * ---------------------------------------------------------
 * HISTORY:
 */

declare module 'esdk-obs-nodejs' {
  interface OBSConfig {
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

  interface CommonResponse {
    CommonMsg: {
      Status: number;
      Code: string;
      Message: string;
      HostId: string;
      RequestId: string;
    };
  }

  interface PutObjectResponse extends CommonResponse {
    InterfaceResult: {
      ETag: string;
      VersionId?: string;
    };
  }

  interface GetObjectResponse extends CommonResponse {
    InterfaceResult: {
      Content: Buffer | string;
      ContentLength: number;
      ETag: string;
      LastModified: string;
      ContentType: string;
    };
  }

  interface ListObjectsResponse extends CommonResponse {
    InterfaceResult: {
      Contents: Array<{
        Key: string;
        LastModified: string;
        ETag: string;
        Size: number;
        StorageClass: string;
      }>;
      IsTruncated: boolean;
      NextMarker?: string;
    };
  }

  interface CreateBucketResponse extends CommonResponse {}
  interface DeleteBucketResponse extends CommonResponse {}
  interface DeleteObjectResponse extends CommonResponse {}

  class ObsClient {
    constructor(config: OBSConfig);

    putObject(params: {
      Bucket: string;
      Key: string;
      Body?: Buffer | string;
      SourceFile?: string;
      ContentType?: string;
      Metadata?: Record<string, string>;
      ProgressCallback?: (transferredAmount: number, totalAmount: number) => void;
    }): Promise<PutObjectResponse>;

    getObject(params: {
      Bucket: string;
      Key: string;
      SaveAsFile?: string;
      ProgressCallback?: (transferredAmount: number, totalAmount: number) => void;
    }): Promise<GetObjectResponse>;

    listObjects(params: {
      Bucket: string;
      Prefix?: string;
      Marker?: string;
      MaxKeys?: number;
      Delimiter?: string;
    }): Promise<ListObjectsResponse>;

    createBucket(params: {
      Bucket: string;
      StorageClass?: string;
    }): Promise<CreateBucketResponse>;

    deleteBucket(params: {
      Bucket: string;
    }): Promise<DeleteBucketResponse>;

    deleteObject(params: {
      Bucket: string;
      Key: string;
    }): Promise<DeleteObjectResponse>;

    close(): void;
  }

  export = ObsClient;
}
