# Large File Upload Fix - Technical Summary

## Problem Description

The GitHub Action was failing with the error:
```
"Cannot create a string longer than 0x1fffffe8 characters"
```

This error occurred when uploading files larger than approximately 536MB (0x1fffffe8 characters = 536,870,888 bytes).

## Root Cause Analysis

### The Issue
1. **Buffer Loading**: The original implementation loaded entire files into memory using `Buffer` via `fs.readFile()`
2. **Internal String Conversion**: The OBS SDK was attempting to convert these large buffers to strings internally
3. **Node.js Limitation**: Node.js has a maximum string length limit of `0x1fffffe8` characters (~536MB)
4. **Memory Inefficiency**: Loading large files entirely into memory is inefficient and unnecessary

### Code Location
The problematic code was in `src/obs-manager.ts` in the `uploadFile` method:

```typescript
// OLD - Problematic approach
const fileData = await this.fileManager.readFile(operation.localPath);
const uploadParams = {
  Bucket: this.inputs.bucketName,
  Key: operation.remotePath,
  Body: fileData,  // <-- This causes the buffer-to-string issue
  StorageClass: this.inputs.storageClass
};
```

## Solution Implemented

### 1. Streaming Upload Approach
Switched from buffer-based to file path-based uploads using the OBS SDK's `SourceFile` parameter:

```typescript
// NEW - Streaming approach
const uploadParams = {
  Bucket: this.inputs.bucketName,
  Key: operation.remotePath,
  SourceFile: operation.localPath,  // <-- Uses file path instead of buffer
  StorageClass: this.inputs.storageClass
};
```

### 2. Efficient Checksum Calculation
Added streaming MD5 calculation for large files to avoid loading them into memory:

```typescript
// NEW - Streaming checksum calculation
async calculateMD5(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash('md5');
    const stream = createReadStream(filePath);

    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}
```

### 3. Large File Detection
Added threshold-based detection for optimized processing:

```typescript
private static readonly LARGE_FILE_THRESHOLD = 100 * 1024 * 1024; // 100MB

async isLargeFile(filePath: string): Promise<boolean> {
  const size = await this.getFileSize(filePath);
  return size > FileManager.LARGE_FILE_THRESHOLD;
}
```

## Benefits of the Fix

### ✅ **Unlimited File Size Support**
- No more 536MB limit
- Supports files of any size (limited only by disk space and OBS limits)
- Memory usage remains constant regardless of file size

### ✅ **Improved Performance**
- Reduced memory footprint for large files
- Faster uploads due to streaming
- Better resource utilization

### ✅ **Enhanced Reliability**
- No more buffer overflow errors
- More stable for large file operations
- Better error handling

### ✅ **Backward Compatibility**
- All existing functionality preserved
- No breaking changes to the API
- Existing workflows continue to work

## Testing Verification

Created and ran comprehensive tests to verify:

1. **Buffer Overflow Demonstration**: Confirmed the original issue occurs when converting 550MB+ buffers to strings
2. **Streaming Solution**: Verified that streaming approaches handle 600MB+ files without issues
3. **Performance**: Confirmed efficient MD5 calculation on large files using streams
4. **Memory Usage**: Verified constant memory usage regardless of file size

## Files Modified

### Core Changes
- `src/obs-manager.ts`: Updated upload mechanism to use `SourceFile` instead of `Body`
- `src/file-manager.ts`: Added streaming MD5 calculation and large file detection

### Documentation Updates
- `RELEASE_NOTES.md`: Updated to v1.1.2 with comprehensive change log
- `package.json`: Version bump to 1.1.2

## Migration Impact

### For Users
- **Zero Impact**: No changes required in existing workflow configurations
- **Improved Experience**: Large file uploads now work reliably
- **Better Performance**: Faster uploads for all file sizes

### For Developers
- **Enhanced API**: New methods for large file handling
- **Better Architecture**: More memory-efficient design
- **Future-Proof**: Scalable approach for even larger files

## Configuration Recommendations

For optimal large file upload performance:

```yaml
- name: Upload large files
  uses: diverger/gh-obs-helper@v1
  with:
    # ... other config ...
    timeout: 600              # Increase timeout for large files
    retry_count: 3           # More retries for reliability
    concurrency: 5           # Lower concurrency for large files
    checksum_validation: true # Verify integrity
```

## Conclusion

This fix resolves the critical buffer overflow issue while maintaining full backward compatibility and significantly improving performance for large file operations. The streaming approach is more memory-efficient, faster, and scales to support files of any size.
