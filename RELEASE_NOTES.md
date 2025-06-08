# Release Notes

## 🚀 GH OBS Helper Release v1.1.9

### 🎯 What's New
- **Workflow Fixes**: Repaired corrupted GitHub workflow configuration
- **Path Consistency**: Ensured all OBS paths use consistent repository folder structure
- **CI/CD Stability**: Improved workflow reliability and maintainability

### 🔧 Changes
- **Workflow Configuration**: Fixed corrupted `test-upload.yml` workflow inputs section
- **OBS Path Standardization**: Confirmed all workflow files use "gh-obs-helper/" path prefix consistently

### 🐛 Bug Fixes
- **Critical Fix**: Resolved corrupted YAML structure in `test-upload.yml` workflow file
- **Input Validation**: Fixed malformed workflow inputs that were preventing proper execution
- **Path Consistency**: Ensured single file upload test uses correct OBS path with repository prefix

### 📋 Known Issues
- No known issues in this release
- All workflows have been validated and are functioning correctly

### 🔗 Migration Guide
- No breaking changes from v1.1.8
- All existing workflows remain fully compatible
- Workflow fixes are internal improvements that don't affect user-facing functionality

### 🛠️ Usage Example
```yaml
- name: Upload to OBS
  id: upload
  uses: diverger/gh-obs-helper@v1.1.9
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket: 'my-bucket'
    operation: 'upload'
    local_path: 'dist/**/*'
    obs_path: 'gh-obs-helper/releases/v1.1.9/'
    public_read: true

- name: Use uploaded file URLs
  run: |
    echo "First file URL: ${{ steps.upload.outputs.first_upload_url }}"
    echo "All URLs: ${{ steps.upload.outputs.upload_urls }}"
```

### 🙏 Contributors
- Thank contributors
- Mention community feedback

---
**Full Changelog**: https://github.com/diverger/gh-obs-helper/compare/v1.1.8...v1.1.9
