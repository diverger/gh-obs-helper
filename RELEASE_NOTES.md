# Release Notes

## 🚀 GH OBS Helper Release v1.1.0

### 🎯 What's New

- **📥 Download Functionality**: Full download support with pattern matching and parallel processing
- **🔍 Advanced Object Listing**: Efficient pagination for large buckets
- **🎯 Pattern Filtering**: Include/exclude patterns for downloads
- **📁 Structure Preservation**: Option to maintain directory structure during downloads
- **🛡️ Checksum Validation**: File integrity verification for downloads

### 🔧 Features

- **Download Operations**: Download files from OBS buckets with wildcard support
- **Parallel Downloads**: Configurable concurrency for faster file retrieval
- **Pattern Matching**: Filter downloads using include/exclude patterns
- **Retry Logic**: Automatic retry for failed downloads with exponential backoff
- **Dry Run Support**: Preview download operations without executing

### 📋 Download Examples

**Basic Download:**
```yaml
- name: Download files
  uses: diverger/gh-obs-helper@v1.1.0
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket_name: 'my-bucket'
    operation: 'download'
    obs_path: 'releases/v1.0.0/'
    local_path: 'downloaded/'
```

**Download with Patterns:**
```yaml
- name: Download specific files
  uses: diverger/gh-obs-helper@v1.1.0
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket_name: 'my-bucket'
    operation: 'download'
    obs_path: 'backups/'
    local_path: 'restored/'
    include: '**/*.sql, **/*.json'
    exclude: '**/*.tmp'
    concurrency: 20
```

---

## 🚀 GH OBS Helper Release v1.0.0

### 🎯 What's New

- **Standardized Parameter Names**: Renamed `source`/`destination` to `local_path`/`obs_path` for clarity
- **Enhanced Build System**: Automated build and release workflows
- **Professional Development Setup**: Complete CI/CD pipeline with TypeScript validation

### 🔧 Changes

- **BREAKING**: Parameter names changed from `source`/`destination` to `local_path`/`obs_path`
- Updated all workflow examples to use new parameter names
- Fixed action icon to use valid `upload-cloud` icon

### 🐛 Bug Fixes

- Fixed TypeScript compilation errors
- Corrected action.yml parameter validation
- Improved error handling in upload operations

### 📋 Migration Guide

If upgrading from earlier versions, update your workflow files:

**Old:**
```yaml
with:
  source: 'dist/**'
  destination: 'releases/'
```

**New:**
```yaml
with:
  local_path: 'dist/**'
  obs_path: 'releases/'
```

### 🛠️ Usage Example

```yaml
- name: Upload to OBS
  uses: diverger/gh-obs-helper@v1.0.0
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket: 'my-bucket'
    operation: 'upload'
    local_path: 'dist/**/*'
    obs_path: 'releases/v1.0.0/'
```

### 🎉 Features

- High-performance uploads with unlimited file support
- Wildcard pattern matching (`*`, `**`, `?`)
- Parallel operations with configurable concurrency
- Support for upload, download, sync, and bucket operations
- Comprehensive error handling and retry logic

---

**Full Changelog**: https://github.com/diverger/gh-obs-helper/compare/v0.9.0...v1.0.0
