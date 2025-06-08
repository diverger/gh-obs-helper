# GH OBS Helper

[![GitHub](https://img.shields.io/github/license/diverger/gh-obs-helper)](https://github.com/diverger/gh-obs-helper/blob/main/LICENSE)
[![GitHub release](https://img.shields.io/github/release/divergr/gh-obs-helper)](https://github.com/diverger/gh-obs-helper/releases)
[![Build and Package](https://github.com/diverger/gh-obs-helper/actions/workflows/build-and-package.yml/badge.svg)](https://github.com/diverger/gh-obs-helper/actions)

A high-performance GitHub Action for Huawei Cloud Object Storage Service (OBS) with unlimited file support, wildcard patterns, and parallel uploads.

## ✨ Features

- **🚀 Unlimited File Support** - No more 10-file limitation
- **🔍 Advanced Pattern Matching** - Full wildcard support (*, **, ?, etc.)
- **⚡ Parallel Operations** - Configurable concurrency for faster uploads and downloads
- **🔄 Retry Logic** - Automatic retry on failures with exponential backoff
- **📊 Progress Tracking** - Detailed progress logs and operation metrics
- **🛡️ Checksum Validation** - Optional file integrity verification
- **🎯 Flexible Patterns** - Include/exclude patterns for fine-grained control
- **📁 Structure Preservation** - Option to preserve or flatten directory structure
- **🔍 Dry Run Mode** - Preview operations without executing
- **📥 Download Support** - Download files from OBS with pattern matching

## 🚀 Quick Start

### Upload to OBS
```yaml
- name: Upload to OBS
  uses: diverger/gh-obs-helper@v1
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket_name: 'my-bucket'
    operation: 'upload'
    source: 'dist/**/*'
    destination: 'gh-obs-helper/releases/v1.0.0'
```

### Download from OBS
```yaml
- name: Download from OBS
  uses: diverger/gh-obs-helper@v1
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket_name: 'my-bucket'
    operation: 'download'
    obs_path: 'gh-obs-helper/releases/v1.0.0/'
    local_path: 'downloaded/'
```

## 📖 Usage Examples

### Basic Upload
```yaml
- name: Upload files
  uses: diverger/gh-obs-helper@v1
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket_name: 'my-bucket'
    operation: 'upload'
    source: 'build/**/*'
    destination: 'app/'
```

### Upload with URL Output
```yaml
- name: Upload files and get URLs
  id: upload
  uses: diverger/gh-obs-helper@v1
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket_name: 'my-bucket'
    operation: 'upload'
    source: 'dist/index.html'
    destination: 'gh-obs-helper/releases/v1.0.0/'
    public_read: true

- name: Use uploaded file URL
  run: |
    echo "File uploaded to: ${{ steps.upload.outputs.first_upload_url }}"
    echo "All URLs: ${{ steps.upload.outputs.upload_urls }}"
```

### Multiple Patterns with Exclusions
```yaml
- name: Upload with patterns
  uses: diverger/gh-obs-helper@v1
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket_name: 'my-bucket'
    operation: 'upload'
    source: 'src/**/*.js, assets/**/*.png, docs/**/*.md'
    exclude: '**/*.test.js, **/node_modules/**'
    destination: 'website/'
    concurrency: 20
```

### High-Performance Upload
```yaml
- name: Fast parallel upload
  uses: diverger/gh-obs-helper@v1
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket_name: 'my-bucket'
    operation: 'upload'
    source: 'large-dataset/**/*'
    concurrency: 50
    retry_count: 5
    progress: true
```

### Download from OBS
```yaml
- name: Download files
  uses: diverger/gh-obs-helper@v1
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket_name: 'my-bucket'
    operation: 'download'
    obs_path: 'gh-obs-helper/releases/v1.0.0/'
    local_path: 'downloaded/'
```

### Download with Patterns
```yaml
- name: Download specific file types
  uses: diverger/gh-obs-helper@v1
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
    preserve_structure: true
```

### High-Performance Download
```yaml
- name: Fast parallel download
  uses: diverger/gh-obs-helper@v1
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket_name: 'my-bucket'
    operation: 'download'
    obs_path: 'large-dataset/'
    local_path: 'data/'
    concurrency: 30
    checksum_validation: true
```

### Bucket Management
```yaml
- name: Create bucket
  uses: diverger/gh-obs-helper@v1
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket_name: 'new-bucket'
    operation: 'create-bucket'
    storage_class: 'STANDARD'
```

## 📋 Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `access_key` | Huawei Cloud Access Key ID | ✅ | |
| `secret_key` | Huawei Cloud Secret Access Key | ✅ | |
| `region` | OBS region (e.g., cn-north-4) | ✅ | `cn-north-4` |
| `bucket` | OBS bucket name | ✅ | |
| `operation` | Operation type: upload, download, sync, create-bucket, delete-bucket | ✅ | `upload` |
| `source` | Source path(s) - supports wildcards, comma-separated | | |
| `destination` | Destination path in OBS bucket | | |
| `obs_path` | OBS path for download operations | | |
| `local_path` | Local path for download operations | | |
| `include` | Include patterns (comma-separated) | | |
| `exclude` | Exclude patterns (comma-separated) | | |
| `preserve_structure` | Preserve directory structure | | `true` |
| `concurrency` | Maximum parallel operations | | `10` |
| `retry_count` | Number of retries for failed operations | | `3` |
| `dry_run` | Preview operations without executing | | `false` |
| `progress` | Show detailed progress logs | | `true` |
| `checksum_validation` | Validate file checksums after upload | | `false` |
| `storage_class` | OBS storage class (STANDARD, WARM, COLD) | | `STANDARD` |
| `public_read` | Make uploaded objects public readable | | `false` |
| `timeout` | Request timeout in seconds | | `300` |

## 📤 Outputs

| Output | Description |
|--------|-------------|
| `files_processed` | Number of files processed |
| `bytes_transferred` | Total bytes transferred |
| `operation_time` | Total operation time in seconds |
| `success_count` | Number of successful operations |
| `error_count` | Number of failed operations |
| `file_list` | List of processed files (JSON array) |
| `upload_urls` | List of URLs for uploaded files (JSON array) |
| `first_upload_url` | URL of the first uploaded file (for single file uploads) |

## 🔧 Advanced Configuration

### Pattern Matching
The action supports powerful glob patterns:

- `**/*` - All files recursively
- `*.js` - All JavaScript files in current directory
- `src/**/*.{js,ts}` - All JS/TS files in src directory
- `!**/*.test.js` - Exclude test files (when used in exclude)

### Concurrency Tuning
Adjust concurrency based on your needs:
- **Small files**: Higher concurrency (20-50)
- **Large files**: Lower concurrency (5-10)
- **Network limited**: Conservative (3-5)

### Storage Classes
- **STANDARD**: Frequently accessed data
- **WARM**: Infrequently accessed data
- **COLD**: Long-term archival

### URL Generation
The action automatically generates URLs for uploaded files:

- **Public files** (`public_read: true`): Direct URLs that can be accessed immediately
- **Private files**: Pre-signed URLs valid for 1 hour that provide temporary access

URLs are available in two outputs:
- `upload_urls`: JSON array of all uploaded file URLs
- `first_upload_url`: Direct access to the first uploaded file URL (useful for single file uploads)

Example of using URLs in subsequent steps:
```yaml
- name: Upload and deploy
  id: upload
  uses: diverger/gh-obs-helper@v1
  with:
    # ... upload configuration
    public_read: true

- name: Update deployment
  run: |
    curl -X POST "${{ env.DEPLOY_WEBHOOK }}" \
      -d "url=${{ steps.upload.outputs.first_upload_url }}"
```

## 🌍 Supported Regions

- `cn-north-1` (Beijing)
- `cn-north-4` (Beijing)
- `cn-east-2` (Shanghai)
- `cn-east-3` (Shanghai)
- `cn-south-1` (Guangzhou)
- `ap-southeast-1` (Hong Kong)
- `ap-southeast-3` (Singapore)

## 🧪 Testing

### Dynamic Test File Generation

This action includes comprehensive test workflows that generate test files dynamically:

```bash
# Generate test files locally
chmod +x generate-test-files.sh
./generate-test-files.sh
```

The script creates the files and structures used in the tests.

### Test Workflows

- **Quick Test** (`quick-test.yml`) - Single file upload test
- **Upload Tests** (`test-upload.yml`) - Comprehensive upload scenarios
- **Download Tests** (`test-download.yml`) - Comprehensive download scenarios
- **All Operations** (`test-all.yml`) - Full feature testing

Test files are generated dynamically in workflows, keeping the repository clean.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Huawei Cloud OBS team for the excellent SDK
- GitHub Actions community for inspiration and best practices
