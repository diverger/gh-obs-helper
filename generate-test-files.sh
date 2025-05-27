#!/bin/bash
# Script to generate test files for GitHub Action testing
# This script recreates the test-files directory structure and content

set -e

echo "Creating test files for GH OBS Helper testing..."

# Create directory structure
mkdir -p test-files/{documents,images,nested/deep/folder,assets/{css,js},config,logs}

# Create simple text files
echo "This is a simple test file" > test-files/simple.txt
echo "Document content for testing" > test-files/documents/doc1.txt
echo "Another document for batch testing" > test-files/documents/doc2.txt
echo "Image placeholder content" > test-files/images/image1.jpg
echo "Another image file" > test-files/images/image2.png
echo "Deep nested file content" > test-files/nested/deep/folder/deep-file.txt

# Create files with special characters
echo "Special chars test" > "test-files/file with spaces.txt"
echo "Unicode test 中文测试" > "test-files/unicode-测试.txt"

# Create configuration files
cat > test-files/config/app.conf << 'EOF'
server_host=localhost
server_port=8080
debug=true
log_level=info
EOF

# Create log files
cat > test-files/logs/app.log << 'EOF'
2024-05-27 10:00:00 INFO Application started
2024-05-27 10:01:00 DEBUG Processing request
2024-05-27 10:02:00 INFO Request completed successfully
2024-05-27 10:03:00 WARN Memory usage high
EOF

cat > test-files/logs/error.log << 'EOF'
2024-05-27 10:00:00 ERROR Failed to connect to database
2024-05-27 10:00:30 INFO Retrying connection...
2024-05-27 10:01:00 INFO Database connection established
2024-05-27 10:01:15 DEBUG User authentication successful
2024-05-27 10:02:00 WARN High memory usage detected (85%)
2024-05-27 10:03:00 INFO Cleanup process started
2024-05-27 10:04:00 INFO System performance optimized
EOF

# Create web assets
cat > test-files/assets/css/style.css << 'EOF'
body {
    margin: 0;
    padding: 20px;
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    color: #333;
    text-align: center;
}
EOF

cat > test-files/assets/js/app.js << 'EOF'
// Test JavaScript file
function initializeApp() {
    console.log('Application initialized');

    // Test data processing
    const testData = [1, 2, 3, 4, 5];
    const result = testData.map(x => x * 2);

    console.log('Processed data:', result);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();

    // Test API call simulation
    fetch('/api/test')
        .then(response => response.json())
        .then(data => console.log('API response:', data))
        .catch(error => console.error('Error:', error));
});
EOF

# Create JSON data file
cat > test-files/data.json << 'EOF'
{
  "name": "test",
  "version": "1.0.0",
  "data": [1, 2, 3, 4, 5]
}
EOF

# Create README
cat > test-files/README.md << 'EOF'
# Test README

This is a test markdown file for testing uploads.

## Features
- Multiple file formats
- Nested directories
- Special characters
- Unicode support

## Test Data
- Simple text files
- Binary files
- Images (placeholder)
- Documents
EOF

# Create shell script
cat > test-files/test-script.sh << 'EOF'
#!/bin/bash
# Test script file
echo "This is a test script"
echo "Testing shell script upload"
EOF

# Create large test file (1MB) - only if it doesn't exist
if [ ! -f test-files/large-file.bin ]; then
    echo "Creating large test file (1MB)..."
    dd if=/dev/zero of=test-files/large-file.bin bs=1024 count=1024 2>/dev/null
fi

# List created files
echo "Test files created successfully!"
echo "Directory structure:"
find test-files -type f -exec ls -lh {} \;

echo ""
echo "Total files created: $(find test-files -type f | wc -l)"
echo "Total size: $(du -sh test-files | cut -f1)"
