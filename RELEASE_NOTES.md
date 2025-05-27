# Release Notes

## 🚀 GH OBS Helper Release v1.1.1

### 🐛 Bug Fixes

#### ⏱️ **Timeout Configuration Fix**
- **FIXED**: TypeScript compilation error with timeout configuration
- **Enhanced**: Complete OBSConfig interface with all SDK-supported properties
- **Improved**: Better type safety for timeout and retry settings

#### 🔧 **Technical Improvements**
- Updated `OBSConfig` interface to include all optional properties:
  - `timeout?: number` - Request timeout in seconds
  - `max_retry_count?: number` - Maximum retry attempts
  - `region?: string` - OBS region specification
  - `ssl_verify?: boolean` - SSL verification settings
  - `path_style?: boolean` - Path-style access configuration

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
