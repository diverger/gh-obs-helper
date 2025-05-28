# Release Notes Template

Copy this template to `RELEASE_NOTES.md` before creating a release tag to provide custom release notes.

## 🚀 GH OBS Helper Release [VERSION]

### 🎯 What's New
- List new features
- Describe improvements
- Mention bug fixes

### 🔧 Changes
- Breaking changes (if any)
- API modifications
- Parameter updates

### 🐛 Bug Fixes
- Fixed issue descriptions
- Performance improvements

### 📋 Known Issues
- Any known limitations
- Workarounds if available

### 🔗 Migration Guide
- Steps to upgrade from previous version
- Code changes required (if any)

### 🛠️ Usage Example
```yaml
- name: Upload to OBS
  id: upload
  uses: diverger/gh-obs-helper@[VERSION]
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket: 'my-bucket'
    operation: 'upload'
    local_path: 'dist/**/*'
    obs_path: 'releases/[VERSION]/'
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
**Full Changelog**: https://github.com/diverger/gh-obs-helper/compare/[PREVIOUS]...[VERSION]
