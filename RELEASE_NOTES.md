# Release Notes

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
