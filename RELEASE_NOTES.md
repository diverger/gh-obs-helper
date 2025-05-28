# Release Notes

Copy this template to `RELEASE_NOTES.md` before creating a release tag to provide custom release notes.

## 🚀 GH OBS Helper Release v1.1.5

### 🐛 Bug Fixes
- Update README.md


### 🛠️ Usage Example
```yaml
- name: Upload to OBS
  id: upload
  uses: diverger/gh-obs-helper@v1.1.5
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket: 'my-bucket'
    operation: 'upload'
    local_path: 'dist/**/*'
    obs_path: 'releases/v1.1.5/'
    public_read: true

- name: Use uploaded file URLs
  run: |
    echo "First file URL: ${{ steps.upload.outputs.first_upload_url }}"
    echo "All URLs: ${{ steps.upload.outputs.upload_urls }}"
```

---
**Full Changelog**: https://github.com/diverger/gh-obs-helper/compare/v1.1.4...v1.1.5
