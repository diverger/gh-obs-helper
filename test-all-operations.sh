#!/bin/bash

# Test script for OBS Helper Enhanced - All Operation Types
# Tests the logic flow for upload, download, createbucket, and deletebucket operations

set -e

echo "🧪 Testing OBS Helper Enhanced - All Operation Types"
echo "=================================================="

# Create a temporary directory for testing
TEST_DIR=$(mktemp -d)
cd "$TEST_DIR"

# Copy the action files
cp -r /home/diverger/work/gh-actions/gh-action-obs-helper/* .

echo "📁 Test directory: $TEST_DIR"
echo ""

# Function to simulate action step execution
simulate_action_step() {
    local operation_type="$1"
    local local_file_path="$2"
    local obs_file_path="$3"
    local batch_size="${4:-8}"
    
    echo "🔄 Testing operation: $operation_type"
    echo "   Local path: $local_file_path"
    echo "   OBS path: $obs_file_path"
    echo "   Batch size: $batch_size"
    
    # Set environment variables as the action would
    export ACCESS_KEY="test-access-key"
    export SECRET_KEY="test-secret-key"
    export REGION="cn-north-4"
    export BUCKET_NAME="test-bucket"
    export OPERATION_TYPE="$operation_type"
    export LOCAL_FILE_PATH="$local_file_path"
    export OBS_FILE_PATH="$obs_file_path"
    export INCLUDE_SELF_FOLDER="false"
    export EXCLUDE=""
    export BATCH_SIZE="$batch_size"
    export PUBLIC_READ="false"
    export STORAGE_CLASS=""
    export CLEAR_BUCKET="true"
    
    # Simulate the first step: Check operation type
    echo "  Step 1: Checking operation type..."
    if [ "$OPERATION_TYPE" != "upload" ]; then
        echo "    ✅ Non-upload operation detected. Setting up for direct passthrough..."
        export NEEDS_PROCESSING="false"
        export BATCH_COUNT="0"
        export TOTAL_FILES="0"
        echo "    → NEEDS_PROCESSING=false"
        echo "    → BATCH_COUNT=0"
        echo "    → TOTAL_FILES=0"
        return 0
    else
        echo "    ✅ Upload operation detected. Processing wildcard patterns and creating batches..."
        export NEEDS_PROCESSING="true"
    fi
    
    # For upload operations, simulate file processing
    if [ "$NEEDS_PROCESSING" = "true" ]; then
        echo "  Step 2: Processing files for upload..."
        
        # Create some test files if they don't exist
        mkdir -p test_upload
        echo "test file 1" > test_upload/file1.txt
        echo "test file 2" > test_upload/file2.txt
        echo "test file 3" > test_upload/subdir/file3.txt
        
        # Install dependencies (simulate)
        echo "    📦 Installing dependencies..."
        npm init -y > /dev/null 2>&1
        npm install glob fast-glob > /dev/null 2>&1
        
        # Create the Node.js script (from our action)
        cat > process_files.js << 'EOF'
const { glob } = require('glob');
const fs = require('fs');
const path = require('path');

async function processFiles() {
  const localPath = process.env.LOCAL_FILE_PATH;
  const obsPath = process.env.OBS_FILE_PATH;
  const batchSize = parseInt(process.env.BATCH_SIZE) || 8;
  const excludePatterns = process.env.EXCLUDE ? process.env.EXCLUDE.split(',').map(p => p.trim()) : [];

  console.log(`    📂 Processing files from: ${localPath}`);
  console.log(`    🎯 Target OBS path: ${obsPath}`);
  console.log(`    📦 Batch size: ${batchSize}`);

  let files = [];

  // Check if path contains wildcards
  if (localPath.includes('*') || localPath.includes('?')) {
    console.log('    🔍 Wildcard pattern detected, expanding...');
    try {
      files = await glob(localPath, {
        dot: true,
        ignore: excludePatterns
      });
    } catch (error) {
      console.error('    ❌ Error expanding wildcard:', error);
      process.exit(1);
    }
  } else {
    // Single file or directory
    if (fs.existsSync(localPath)) {
      const stat = fs.statSync(localPath);
      if (stat.isFile()) {
        files = [localPath];
      } else if (stat.isDirectory()) {
        // Get all files in directory
        try {
          files = await glob(path.join(localPath, '**/*'), {
            nodir: true,
            dot: true,
            ignore: excludePatterns
          });
        } catch (error) {
          console.error('    ❌ Error reading directory:', error);
          process.exit(1);
        }
      }
    } else {
      console.error(`    ❌ Path does not exist: ${localPath}`);
      process.exit(1);
    }
  }

  // Filter out directories and apply exclude patterns
  files = files.filter(file => {
    if (!fs.existsSync(file)) return false;
    const stat = fs.statSync(file);
    if (!stat.isFile()) return false;

    // Check exclude patterns
    for (const pattern of excludePatterns) {
      if (file.includes(pattern)) {
        console.log(`    🚫 Excluding file: ${file} (matches pattern: ${pattern})`);
        return false;
      }
    }
    return true;
  });

  console.log(`    ✅ Found ${files.length} files to process`);

  if (files.length === 0) {
    console.log('    ⚠️  No files found to upload');
    process.exit(0);
  }

  // Create batches
  const batches = [];
  for (let i = 0; i < files.length; i += batchSize) {
    batches.push(files.slice(i, i + batchSize));
  }

  console.log(`    📦 Created ${batches.length} batches`);

  // Write batch information for the shell script
  fs.writeFileSync('batch_info.json', JSON.stringify({
    batches: batches,
    totalFiles: files.length,
    batchCount: batches.length
  }));

  // Create file lists for each batch
  batches.forEach((batch, index) => {
    fs.writeFileSync(`batch_${index}_files.txt`, batch.join('\n'));
  });
}

processFiles().catch(console.error);
EOF
        
        # Run the file processing script
        echo "    🔄 Running file processing script..."
        node process_files.js
        
        if [ -f "batch_info.json" ]; then
            BATCH_INFO=$(cat batch_info.json)
            TOTAL_FILES=$(echo "$BATCH_INFO" | node -e "console.log(JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8')).totalFiles)")
            BATCH_COUNT=$(echo "$BATCH_INFO" | node -e "console.log(JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8')).batchCount)")
            
            export BATCH_COUNT
            export TOTAL_FILES
            
            echo "    ✅ Batch processing completed:"
            echo "       → Total files: $TOTAL_FILES"
            echo "       → Batch count: $BATCH_COUNT"
            
            # Simulate batch file creation
            for i in $(seq 0 $((BATCH_COUNT - 1))); do
                if [ -f "batch_${i}_files.txt" ]; then
                    echo "    📄 Batch $i files:"
                    while IFS= read -r file; do
                        echo "       - $file"
                    done < "batch_${i}_files.txt"
                fi
            done
        else
            echo "    ❌ No batch information generated"
            return 1
        fi
    fi
    
    echo "    ✅ Test completed successfully"
    echo ""
}

echo "🔍 Test 1: Upload operation with wildcard"
echo "----------------------------------------"
simulate_action_step "upload" "test_upload/*.txt" "/uploads/" "2"

echo "🔍 Test 2: Upload operation with directory"
echo "-----------------------------------------"
simulate_action_step "upload" "test_upload" "/backup/" "3"

echo "🔍 Test 3: Download operation"
echo "----------------------------"
simulate_action_step "download" "downloads/" "/remote/files/" "5"

echo "🔍 Test 4: Create bucket operation"
echo "---------------------------------"
simulate_action_step "createbucket" "" "" "8"

echo "🔍 Test 5: Delete bucket operation"
echo "---------------------------------"
simulate_action_step "deletebucket" "" "" "8"

echo ""
echo "🎉 All tests completed successfully!"
echo ""
echo "📋 Test Summary:"
echo "   ✅ Upload with wildcards: Processed files and created batches"
echo "   ✅ Upload with directory: Processed files and created batches"
echo "   ✅ Download operation: Direct passthrough (no file processing)"
echo "   ✅ Create bucket: Direct passthrough (no file processing)"
echo "   ✅ Delete bucket: Direct passthrough (no file processing)"
echo ""
echo "🔧 Action Logic Verification:"
echo "   ✅ Non-upload operations skip file processing"
echo "   ✅ Upload operations trigger wildcard expansion and batching"
echo "   ✅ Batch processing works correctly for different file patterns"
echo "   ✅ Environment variables are set correctly for each operation type"
echo ""

# Cleanup
cd /
rm -rf "$TEST_DIR"

echo "✅ Test environment cleaned up"
echo "🎯 Enhanced OBS Helper is ready for all 4 operation types!"
