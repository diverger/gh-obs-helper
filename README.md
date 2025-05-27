# Enhanced OBS Action

A high-performance GitHub Action for Huawei Cloud Object Storage Service (OBS) with unlimited file support, wildcard patterns, and parallel uploads.

## ✨ Features

- **🚀 Unlimited File Support** - No more 10-file limitation
- **🔍 Advanced Pattern Matching** - Full wildcard support (*, **, ?, etc.)
- **⚡ Parallel Operations** - Configurable concurrency for faster uploads
- **🔄 Retry Logic** - Automatic retry on failures with exponential backoff
- **📊 Progress Tracking** - Detailed progress logs and operation metrics
- **🛡️ Checksum Validation** - Optional file integrity verification
- **🎯 Flexible Patterns** - Include/exclude patterns for fine-grained control
- **📁 Structure Preservation** - Option to preserve or flatten directory structure
- **🔍 Dry Run Mode** - Preview operations without executing

## 🚀 Quick Start

```yaml
- name: Upload to OBS
  uses: your-username/obs-enhanced-action@v1
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket_name: 'my-bucket'
    operation: 'upload'
    source: 'dist/**/*'
    destination: 'releases/v1.0.0'
```

## 📖 Usage Examples

### Basic Upload
```yaml
- name: Upload files
  uses: your-username/obs-enhanced-action@v1
  with:
    access_key: ${{ secrets.OBS_ACCESS_KEY }}
    secret_key: ${{ secrets.OBS_SECRET_KEY }}
    region: 'cn-north-4'
    bucket_name: 'my-bucket'
    operation: 'upload'
    source: 'build/**/*'
    destination: 'app/'
```

### Multiple Patterns with Exclusions
```yaml
- name: Upload with patterns
  uses: your-username/obs-enhanced-action@v1
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
  uses: your-username/obs-enhanced-action@v1
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

### Bucket Management
```yaml
- name: Create bucket
  uses: your-username/obs-enhanced-action@v1
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
| `bucket_name` | OBS bucket name | ✅ | |
| `operation` | Operation type: upload, download, sync, create-bucket, delete-bucket | ✅ | `upload` |
| `source` | Source path(s) - supports wildcards, comma-separated | | |
| `destination` | Destination path in OBS bucket | | |
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

## 📤 Outputs

| Output | Description |
|--------|-------------|
| `files_processed` | Number of files processed |
| `bytes_transferred` | Total bytes transferred |
| `operation_time` | Total operation time in seconds |
| `success_count` | Number of successful operations |
| `error_count` | Number of failed operations |
| `file_list` | List of processed files (JSON array) |

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

## 🌍 Supported Regions

- `cn-north-1` (Beijing)
- `cn-north-4` (Beijing)
- `cn-east-2` (Shanghai)
- `cn-east-3` (Shanghai)
- `cn-south-1` (Guangzhou)
- `ap-southeast-1` (Hong Kong)
- `ap-southeast-3` (Singapore)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🧪 Testing

### Dynamic Test File Generation

This action includes comprehensive test workflows that generate test files dynamically:

```bash
# Generate test files locally
chmod +x generate-test-files.sh
./generate-test-files.sh
```

The script creates:
- **Text files** with various content types
- **Binary files** (1MB test file)
- **Special characters** and Unicode filenames
- **Nested directory** structures
- **Configuration files** (JSON, conf, etc.)
- **Web assets** (CSS, JS)
- **Log files** with sample data

### Test Workflows

- **Quick Test** (`quick-test.yml`) - Single file upload test
- **Upload Tests** (`test-upload.yml`) - Comprehensive upload scenarios
- **All Operations** (`test-all.yml`) - Full feature testing

Test files are generated dynamically in workflows, keeping the repository clean.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Huawei Cloud OBS team for the excellent SDK
- GitHub Actions community for inspiration and best practices
