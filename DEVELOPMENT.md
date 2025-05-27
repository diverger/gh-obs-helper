# Development Guide

This guide explains how to develop, build, and release the GH OBS Helper.

## 🏗️ Build Process

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the action:**
   ```bash
   npm run build
   # or use the build script:
   ./build.sh
   ```

3. **Test TypeScript compilation:**
   ```bash
   npx tsc --noEmit
   ```

### GitHub Actions Build

The project includes automated build workflows:

#### 1. **Build and Package** (`build-and-package.yml`)
- **Triggers:** Push to main/master/develop branches, PRs, manual dispatch
- **Actions:**
  - Builds TypeScript to JavaScript
  - Validates compilation
  - Auto-commits `dist/` changes on push
  - Creates build artifacts for PRs

#### 2. **Release** (`release.yml`)
- **Triggers:** Git tags starting with `v*`, manual dispatch
- **Actions:**
  - Builds the action
  - Creates GitHub releases
  - Uploads release packages
  - Updates major version tags (e.g., `v1` → `v1.2.3`)

## 📁 Project Structure

```
├── src/                   # TypeScript source code
│   ├── index.ts          # Main entry point
│   ├── obs-manager.ts    # OBS operations
│   ├── file-manager.ts   # File handling
│   ├── utils.ts          # Utilities
│   └── types.ts          # Type definitions
├── dist/                 # Built JavaScript (tracked in git)
├── .github/workflows/    # GitHub Actions workflows
├── action.yml           # Action definition
├── package.json         # Dependencies and scripts
└── README.md           # User documentation
```

## 🔄 Development Workflow

### 1. Making Changes

1. Edit TypeScript files in `src/`
2. Test locally:
   ```bash
   ./build.sh
   ```
3. Test the action:
   ```bash
   ./test-all-operations.sh
   ```

### 2. Committing Changes

When you push to main/master/develop:
- GitHub Actions automatically builds and updates `dist/`
- No manual build step required

### 3. Creating Releases

#### 🚀 **Recommended: Automated Release Management**

Use the `prepare-release.sh` script for streamlined releases:

```bash
# Run the release preparation script
./prepare-release.sh

# Follow the prompts:
# 1. Enter new version (e.g., 1.2.0)
# 2. Confirm the preparation
# 3. Edit RELEASE_NOTES.md with your release details
# 4. Build and commit changes
# 5. Create and push the tag
```

**What the script does:**
- Archives current release notes to `RELEASE_NOTES_ARCHIVE.md`
- Updates `package.json` version
- Creates new `RELEASE_NOTES.md` from template
- Provides clear next steps

#### 📋 **Manual Release Process**

If you prefer manual control:

```bash
# 1. Archive current release notes (if not first release)
# Move current RELEASE_NOTES.md content to top of RELEASE_NOTES_ARCHIVE.md

# 2. Create new release notes
cp RELEASE_NOTES_TEMPLATE.md RELEASE_NOTES.md
# Edit RELEASE_NOTES.md with your release details

# 3. Update package.json version
# Edit package.json "version" field

# 4. Build and commit
npm run build
git add .
git commit -m "Prepare release v1.2.0"

# 5. Create and push tag
git tag v1.2.0
git push origin v1.2.0
```

#### ⚡ **Quick Release (Auto-generated Notes)**
```bash
git tag v1.0.0
git push origin v1.0.0
```

## 📝 Release Notes Management

### 📂 **File Structure**
- **`RELEASE_NOTES.md`** - Current release only (keeps GitHub releases concise)
- **`RELEASE_NOTES_ARCHIVE.md`** - All previous releases (complete history)
- **`RELEASE_NOTES_TEMPLATE.md`** - Template for new releases

### ✨ **Benefits of This System**
- ✅ **Short GitHub release pages** - Only current version shown
- ✅ **Complete history preserved** - All versions archived
- ✅ **Automated workflow** - Script handles tedious parts
- ✅ **Consistent formatting** - Template ensures uniformity

## 📝 Creating Manual Release Notes

### 🎯 **Best Practice: Use the Automation Script**

The recommended approach is to use `prepare-release.sh`:

```bash
./prepare-release.sh
```

### 📋 **Manual Release Notes Creation**

If you need manual control:

1. **Copy the template:**
   ```bash
   cp RELEASE_NOTES_TEMPLATE.md RELEASE_NOTES.md
   ```

2. **Edit RELEASE_NOTES.md** with:
   - New features and improvements
   - Bug fixes and changes
   - Breaking changes (if any)
   - Migration instructions
   - Usage examples

3. **Replace version placeholders:**
   ```bash
   # Replace [VERSION] with your version (e.g., v1.2.0)
   sed -i 's/\[VERSION\]/v1.2.0/g' RELEASE_NOTES.md
   ```

### 📚 **Release Notes Guidelines**

#### ✅ **Do:**
- Keep current release notes concise and focused
- Include practical examples for new features
- Mention breaking changes prominently
- Archive old releases to keep GitHub pages clean

#### ❌ **Don't:**
- Let RELEASE_NOTES.md grow indefinitely
- Skip release notes for bug fixes
- Forget to update package.json version
- Include internal/technical details users don't need

### 📁 **Archive Management**

The system maintains two files:
- **Current:** `RELEASE_NOTES.md` (shown on GitHub releases)
- **Archive:** `RELEASE_NOTES_ARCHIVE.md` (historical record)

This keeps GitHub release pages short while preserving complete history.

## 🧪 Testing

### Local Testing
```bash
# Test all operations (dry run)
./test-all-operations.sh

# Generate test files
./generate-test-files.sh
```

### GitHub Actions Testing
- **Quick Test:** Manual workflow for single file upload
- **Comprehensive Tests:** Upload, download, sync scenarios
- **Build Tests:** Automated testing of built action

## 📦 Distribution

### For Users
Users reference the action like:
```yaml
uses: your-username/gh-obs-helper@v1
```

### For Contributors
- `dist/` folder must be committed (required for GitHub Actions)
- Build artifacts are automatically updated
- Releases include packaged action files

## 🔧 Key Files

| File | Purpose |
|------|---------|
| `action.yml` | Defines action inputs/outputs |
| `src/index.ts` | Main action logic |
| `dist/index.js` | Compiled JavaScript (auto-generated) |
| `package.json` | Dependencies and build scripts |
| `build.sh` | Local build helper script |
| **`prepare-release.sh`** | **Automated release management** |
| **`RELEASE_NOTES.md`** | **Current release notes only** |
| **`RELEASE_NOTES_ARCHIVE.md`** | **Historical release notes** |
| **`RELEASE_NOTES_TEMPLATE.md`** | **Template for new releases** |

## 🚀 Release Process

### 🎯 **Streamlined Workflow (Recommended)**

1. **Development:** Make changes in `src/`
2. **Testing:** Use test workflows and `./build.sh`
3. **Release Preparation:** Run `./prepare-release.sh`
4. **Documentation:** Edit `RELEASE_NOTES.md` with release details
5. **Build & Tag:** Follow script instructions to build and create tag
6. **Distribution:** GitHub automatically creates release

### 📋 **Detailed Steps**

```bash
# 1. Development and testing
git checkout -b feature/my-feature
# Make your changes...
./build.sh
# Test your changes...

# 2. Merge to main
git checkout main
git merge feature/my-feature

# 3. Prepare release
./prepare-release.sh
# Enter version: 1.2.0
# Confirm: y

# 4. Document changes
# Edit RELEASE_NOTES.md with your release information

# 5. Build and commit
npm run build
git add .
git commit -m "Prepare release v1.2.0"

# 6. Create and push tag
git tag v1.2.0
git push origin v1.2.0

# 7. Create GitHub release using RELEASE_NOTES.md content
```

### 🔄 **What Happens During Release**

1. **Archive Management:** Current release moves to archive
2. **Version Update:** package.json updated automatically
3. **Template Creation:** New RELEASE_NOTES.md from template
4. **GitHub Release:** Created with content from RELEASE_NOTES.md
5. **Major Tag Update:** `v1` points to latest `v1.x.x`

## 📋 Best Practices

### 🔨 **Development**
- Always test changes with `./build.sh`
- Use semantic versioning for tags (`v1.0.0`)
- Keep `dist/` folder in sync with source
- Test with actual OBS credentials before release

### 📝 **Release Management**
- **Use `prepare-release.sh`** for consistent releases
- **Keep release notes concise** - archive old versions
- **Include examples** for new features in release notes
- **Test major releases** with pre-release tags first

### 📚 **Documentation**
- Update README.md for user-facing changes
- Document breaking changes prominently
- Include migration guides for major versions
- Keep DEVELOPMENT.md updated with process changes

### 🧪 **Testing**
- Test with `dry_run: true` first
- Use test workflows for comprehensive validation
- Verify timeout settings work with large files
- Test URL generation for both public/private files

## 🐛 Troubleshooting

### Build Issues
```bash
# Clean build
rm -rf dist/ node_modules/
npm install
npm run build
```

### TypeScript Errors
```bash
# Check compilation
npx tsc --noEmit
```

### Action Not Working
1. Check `dist/index.js` exists and is recent
2. Verify `action.yml` parameter names match code
3. Test with dry_run: true first
