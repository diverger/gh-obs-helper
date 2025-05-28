# Release Notes

## 🚀 GH OBS Helper Release v1.1.2

### 🐛 Critical Bug Fixes

#### 🚨 **Large File Upload Support**
- **FIXED**: "Cannot create a string longer than 0x1fffffe8 characters" error when uploading files larger than ~536MB
- **Enhanced**: Switched from buffer-based to streaming-based uploads for better memory efficiency
- **Improved**: Now supports uploading files of any size without memory constraints

#### ⚡ **Performance Improvements**
- **Optimized**: Memory usage for large file uploads by using `SourceFile` parameter instead of loading files into memory
- **Enhanced**: Streaming checksum calculation for large files to avoid memory issues
- **Added**: Large file detection (100MB threshold) for optimized processing

#### ⏱️ **Timeout Configuration Fix**
- **FIXED**: TypeScript compilation error with timeout configuration
- **Enhanced**: Complete OBSConfig interface with all SDK-supported properties
- **Improved**: Better type safety for timeout and retry settings

#### 🔧 **Technical Improvements**
- Updated upload mechanism to use streaming for all file sizes
- Added efficient MD5 calculation using file streams instead of loading entire files
- Updated `OBSConfig` interface to include all optional properties:
  - `timeout?: number` - Request timeout in seconds
  - `max_retry_count?: number` - Maximum retry attempts
  - `region?: string` - OBS region specification
  - `ssl_verify?: boolean` - SSL verification settings
  - `path_style?: boolean` - Path-style access configuration

### 🛠️ Usage Example with Large Files
```yaml
- name: Upload large files
  uses: diverger/gh-obs-helper@v1
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket_name: 'my-bucket'
    operation: 'upload'
    source: 'large-files/**/*'
    timeout: 600  # 10 minutes for large files
    retry_count: 3
    checksum_validation: true
```

### 🛠️ Usage Example with Timeout

```yaml
- name: Upload with custom timeout
  uses: diverger/gh-obs-helper@v1.1.1
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket: 'my-bucket'
    operation: 'upload'
    local_path: 'large-files/**/*'
    timeout: 600  # 10 minutes for large files
    retry_count: 5
```

### 🔄 Migration Notes

- No breaking changes from v1.1.0
- Timeout functionality now works correctly without TypeScript errors
- All existing workflows remain compatible

### 📋 Previous Releases

For release notes of previous versions, see [RELEASE_NOTES_ARCHIVE.md](./RELEASE_NOTES_ARCHIVE.md).

---

**Full Changelog**: https://github.com/diverger/gh-obs-helper/releases
