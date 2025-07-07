# Release Notes

## 🚀 GH OBS Helper Release v1.2.0

### 🔧 Changes

- **MAJOR**: Upgraded `esdk-obs-nodejs` from 3.24.3 to 3.25.6 (latest stable version)
- **No Breaking Changes**: All existing workflows remain fully compatible

### 🛠️ Usage Example

```yaml
- name: Upload to OBS
  id: upload
  uses: diverger/gh-obs-helper@v1.2.0
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket: 'my-bucket'
    operation: 'upload'
    local_path: 'dist/**/*'
    obs_path: 'gh-obs-helper/releases/v1.2.0/'
    public_read: true

- name: Use uploaded file URLs
  run: |
    echo "First file URL: ${{ steps.upload.outputs.first_upload_url }}"
    echo "All URLs: ${{ steps.upload.outputs.upload_urls }}"
```

---

**Full Changelog**: [v1.1.9...v1.2.0](https://github.com/diverger/gh-obs-helper/compare/v1.1.9...v1.2.0)