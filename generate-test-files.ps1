#!/usr/bin/env pwsh
# Script to generate test files for GitHub Action testing
# This script recreates the test-files directory structure and content

# Try to enable UTF-8 support for modern terminals
try {
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    $OutputEncoding = [System.Text.Encoding]::UTF8
    # For Windows, try to set console to UTF-8 code page
    if ($IsWindows -or $env:OS -match "Windows") {
        chcp 65001 | Out-Null
    }
} catch {
    # Silently continue if encoding setup fails
}

$ErrorActionPreference = "Stop"

# Detect if terminal supports Unicode (Windows Terminal, VS Code, etc.)
$supportsUnicode = $env:WT_SESSION -or $env:TERM_PROGRAM -eq "vscode" -or $PSVersionTable.PSVersion.Major -ge 7

Write-Host "Creating test files for GH OBS Helper testing..." -ForegroundColor Cyan

# Create directory structure
$directories = @(
    "test-files\documents",
    "test-files\images",
    "test-files\nested\deep\folder",
    "test-files\assets\css",
    "test-files\assets\js",
    "test-files\config",
    "test-files\logs"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

# Create simple text files
"This is a simple test file" | Set-Content "test-files\simple.txt" -Encoding UTF8
"Document content for testing" | Set-Content "test-files\documents\doc1.txt" -Encoding UTF8
"Another document for batch testing" | Set-Content "test-files\documents\doc2.txt" -Encoding UTF8
"Image placeholder content" | Set-Content "test-files\images\image1.jpg" -Encoding UTF8
"Another image file" | Set-Content "test-files\images\image2.png" -Encoding UTF8
"Deep nested file content" | Set-Content "test-files\nested\deep\folder\deep-file.txt" -Encoding UTF8

# Create files with special characters
"Special chars test" | Set-Content "test-files\file with spaces.txt" -Encoding UTF8

# Unicode test file - handle differently for compatibility
$unicodeContent = "Unicode test " + [char]0x4e2d + [char]0x6587 + [char]0x6d4b + [char]0x8bd5
$unicodeFileName = "test-files\unicode-" + [char]0x6d4b + [char]0x8bd5 + ".txt"
try {
    $unicodeContent | Set-Content $unicodeFileName -Encoding UTF8
} catch {
    # Fallback if Unicode filename not supported
    "Unicode test" | Set-Content "test-files\unicode-test.txt" -Encoding UTF8
}

# Create configuration files
@"
server_host=localhost
server_port=8080
debug=true
log_level=info
"@ | Set-Content "test-files\config\app.conf" -Encoding UTF8

# Create log files
@"
2024-05-27 10:00:00 INFO Application started
2024-05-27 10:01:00 DEBUG Processing request
2024-05-27 10:02:00 INFO Request completed successfully
2024-05-27 10:03:00 WARN Memory usage high
"@ | Set-Content "test-files\logs\app.log" -Encoding UTF8

@"
2024-05-27 10:00:00 ERROR Failed to connect to database
2024-05-27 10:00:30 INFO Retrying connection...
2024-05-27 10:01:00 INFO Database connection established
2024-05-27 10:01:15 DEBUG User authentication successful
2024-05-27 10:02:00 WARN High memory usage detected (85%)
2024-05-27 10:03:00 INFO Cleanup process started
2024-05-27 10:04:00 INFO System performance optimized
"@ | Set-Content "test-files\logs\error.log" -Encoding UTF8

# Create web assets (CSS)
@"
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
"@ | Set-Content "test-files\assets\css\style.css" -Encoding UTF8

# Create web assets (JavaScript)
@"
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
"@ | Set-Content "test-files\assets\js\app.js" -Encoding UTF8

# Create JSON data file
@"
{
  "name": "test",
  "version": "1.0.0",
  "data": [1, 2, 3, 4, 5]
}
"@ | Set-Content "test-files\data.json" -Encoding UTF8

# Create README
@"
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
"@ | Set-Content "test-files\README.md" -Encoding UTF8

# Create shell script
@"
#!/bin/bash
# Test script file
echo "This is a test script"
echo "Testing shell script upload"
"@ | Set-Content "test-files\test-script.sh" -Encoding UTF8

# Create large test file (1MB) - only if it doesn't exist
if (-not (Test-Path "test-files\large-file.bin")) {
    $msg = if ($supportsUnicode) { "📦 Creating large test file (1MB)..." } else { "Creating large test file (1MB)..." }
    Write-Host $msg -ForegroundColor Yellow
    $bytes = New-Object byte[] (1MB)
    $random = New-Object System.Random
    $random.NextBytes($bytes)
    [System.IO.File]::WriteAllBytes("test-files\large-file.bin", $bytes)
}

# List created files
$successMsg = if ($supportsUnicode) { "`n✅ Test files created successfully!" } else { "`n[OK] Test files created successfully!" }
Write-Host $successMsg -ForegroundColor Green
Write-Host "`nDirectory structure:" -ForegroundColor Cyan
Get-ChildItem -Path "test-files" -Recurse -File | Select-Object FullName, @{Name="Size";Expression={"{0:N2} KB" -f ($_.Length / 1KB)}}

$fileCount = (Get-ChildItem -Path "test-files" -Recurse -File).Count
$totalSize = (Get-ChildItem -Path "test-files" -Recurse -File | Measure-Object -Property Length -Sum).Sum
$totalSizeFormatted = if ($totalSize -lt 1MB) {
    "{0:N2} KB" -f ($totalSize / 1KB)
} elseif ($totalSize -lt 1GB) {
    "{0:N2} MB" -f ($totalSize / 1MB)
} else {
    "{0:N2} GB" -f ($totalSize / 1GB)
}

Write-Host "`nTotal files created: $fileCount" -ForegroundColor Green
Write-Host "Total size: $totalSizeFormatted" -ForegroundColor Green
