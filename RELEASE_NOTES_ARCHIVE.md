# Release Notes Archive

This file contains archived release notes for older versions of GH OBS Helper.

---

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

---

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

---

## 🚀 GH OBS Helper Release v1.1.7

### 🎯 What's New
- **Enhanced CI/CD Testing**: Improved workflow testing with comprehensive URL output validation
- **Workflow Organization**: Renamed and restructured test workflows for better clarity
- **Security Improvements**: Enhanced secret management in CI/CD workflows

### 🔧 Changes
- **CI Workflow Updates**: Enabled checksum validation for large file uploads in testing workflows
- **Test Infrastructure**: Added dedicated URL output testing and improved upload test results validation
- **Security Configuration**: Updated workflow files to use secure OBS region configuration via secrets
- **Workflow Naming**: Renamed `test-url-outputs.yml` workflow to `test-url-usage.yml` for better clarity

### 🐛 Bug Fixes
- **Large File Upload Testing**: Fixed checksum validation issues during large file upload tests
- **Workflow Configuration**: Resolved configuration inconsistencies in CI/CD test workflows
- **Secret Management**: Improved handling of sensitive configuration in automated tests

### 📋 Known Issues
- No known issues in this release
- All existing functionality remains stable

### 🔗 Migration Guide
- No breaking changes from v1.1.6
- All existing workflows remain fully compatible
- No code changes required for users

---
**Full Changelog**: https://github.com/diverger/gh-obs-helper/compare/v1.1.6...v1.1.7

---

## 🚀 GH OBS Helper Release v1.1.6

### 🔧 Changes
- Update confidentials in workflows

### 🛠️ Usage Example
```yaml
- name: Upload to OBS
  id: upload
  uses: diverger/gh-obs-helper@v1.1.6
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket: 'my-bucket'
    operation: 'upload'
    local_path: 'dist/**/*'
    obs_path: 'releases/v1.1.6/'
    public_read: true

- name: Use uploaded file URLs
  run: |
    echo "First file URL: ${{ steps.upload.outputs.first_upload_url }}"
    echo "All URLs: ${{ steps.upload.outputs.upload_urls }}"
```

---
**Full Changelog**: https://github.com/diverger/gh-obs-helper/compare/v1.1.5...v1.1.6

---

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

---

Copy this template to `RELEASE_NOTES.md` before creating a release tag to provide custom release notes.

## 🚀 GH OBS Helper Release v1.1.4

### 🎯 What's New
- Minor bug fixes

### 🛠️ Usage Example
```yaml
- name: Upload to OBS
  id: upload
  uses: diverger/gh-obs-helper@v1.1.4
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket: 'my-bucket'
    operation: 'upload'
    local_path: 'dist/**/*'
    obs_path: 'releases/v1.1.4/'
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
**Full Changelog**: https://github.com/diverger/gh-obs-helper/compare/v1.1.3...v1.1.4

---

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

---

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

---

## 🚀 GH OBS Helper Release v1.1.0

### 🎯 What's New

#### 🔗 **URL Output Support**
- **NEW**: Automatic URL generation for uploaded files
- **Public files**: Direct URLs for immediate access
- **Private files**: Pre-signed URLs with 1-hour validity
- **Multiple outputs**: Both individual and array formats

#### 📤 **Enhanced Outputs**
- `upload_urls`: JSON array of all uploaded file URLs
- `first_upload_url`: Direct access to the first uploaded file URL
- Perfect for single file uploads and subsequent workflow steps

### 🛠️ Usage Examples

#### Basic Upload with URL Output
```yaml
- name: Upload and get URL
  id: upload
  uses: diverger/gh-obs-helper@v1.1.0
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket: 'my-bucket'
    operation: 'upload'
    local_path: 'dist/app.js'
    obs_path: 'releases/v1.1.0/'
    public_read: true

- name: Use the uploaded file URL
  run: |
    echo "File available at: ${{ steps.upload.outputs.first_upload_url }}"
    curl -I "${{ steps.upload.outputs.first_upload_url }}"
```

---

## 🚀 GH OBS Helper Release v1.0.0

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
  uses: diverger/gh-obs-helper@v1.0.0
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
  uses: diverger/gh-obs-helper@v1.0.0
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

## 🚀 GH OBS Helper Release v1.0.0 (Initial)

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
