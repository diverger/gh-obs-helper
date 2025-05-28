# Release Notes

## 🚀 GH OBS Helper Release v1.1.3

### 🎯 What's New
- **Large File Upload Support**: Enhanced multipart upload handling for files larger than 1GB
- **Comprehensive Testing**: Added large file upload testing to CI/CD workflow  
- **Bug Fixes**: Fixed release script version placeholder handling

### 🔧 Improvements
- **Multipart Upload Optimization**: Improved error handling and retry logic for large file uploads
- **Testing Infrastructure**: Added automated large file (1.2GB) upload testing to prevent regressions
- **Release Process**: Fixed double 'v' prefix bug in release notes generation

### 🐛 Bug Fixes
- Fixed HTTP 403 errors when uploading files larger than 1GB
- Resolved release script bug causing double 'v' prefixes in version placeholders
- Improved error handling for multipart upload operations

### 🛠️ Usage Example
```yaml
- name: Upload large files to OBS
  id: upload
  uses: diverger/gh-obs-helper@v1.1.3
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket: 'my-bucket'
    operation: 'upload'
    local_path: 'dist/**/*'
    obs_path: 'releases/v1.1.3/'
    public_read: true
    checksum_validation: false  # Recommended for large files
    timeout: 1800000  # 30 minutes for large uploads

- name: Use uploaded file URLs
  run: |
    echo "First file URL: ${{ steps.upload.outputs.first_upload_url }}"
    echo "All URLs: ${{ steps.upload.outputs.upload_urls }}"
```

### 📋 Technical Details
- **Multipart Upload**: Automatically enabled for files >100MB
- **Large File Support**: Tested with files up to 1.2GB
- **Enhanced Error Handling**: Better retry logic for network issues
- **CI/CD Testing**: Comprehensive large file upload validation

---
**Full Changelog**: https://github.com/diverger/gh-obs-helper/compare/v1.1.2...v1.1.3
