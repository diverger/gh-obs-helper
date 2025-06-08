# Release Notes

## 🚀 GH OBS Helper Release v1.1.8

### 🎯 What's New
- **Enhanced Documentation**: Added professional badges for license, release, and build status to README.md
- **CI/CD Improvements**: Streamlined GitHub release workflow with modern action
- **Repository Cleanup**: Added automated workflow run cleanup for better repository maintenance

### 🔧 Changes
- **Documentation Updates**: Updated README.md with status badges for better project visibility
- **Package Metadata**: Updated author information in package.json
- **CI/CD Modernization**: Switched from deprecated actions/create-release to softprops/action-gh-release
- **Workflow Cleanup**: Added automated cleanup of old workflow runs to maintain repository hygiene

### 🐛 Bug Fixes
- **Release Process**: Improved GitHub release creation workflow reliability
- **Repository Maintenance**: Implemented automatic cleanup to prevent workflow run accumulation

### 📋 Known Issues
- No known issues in this release
- All existing functionality remains stable

### 🔗 Migration Guide
- No breaking changes from v1.1.7
- All existing workflows remain fully compatible
- No code changes required for users

### 🛠️ Usage Example
```yaml
- name: Upload to OBS
  id: upload
  uses: diverger/gh-obs-helper@v1.1.8
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket: 'my-bucket'
    operation: 'upload'
    local_path: 'dist/**/*'
    obs_path: 'gh-obs-helper/releases/v1.1.8/'
    public_read: true

- name: Use uploaded file URLs
  run: |
    echo "First file URL: ${{ steps.upload.outputs.first_upload_url }}"
    echo "All URLs: ${{ steps.upload.outputs.upload_urls }}"
```

---
**Full Changelog**: https://github.com/diverger/gh-obs-helper/compare/v1.1.7...v1.1.8
