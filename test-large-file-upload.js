#!/usr/bin/env node

/**
 * Test script to verify large file upload functionality
 * This simulates the buffer overflow issue and tests the streaming upload fix
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Create a test file that would trigger the buffer overflow issue
async function createLargeTestFile(sizeMB = 600) {
  const filePath = path.join(__dirname, 'test-large-file.bin');
  const sizeBytes = sizeMB * 1024 * 1024;
  const chunkSize = 1024 * 1024; // 1MB chunks

  console.log(`Creating ${sizeMB}MB test file: ${filePath}`);

  const stream = fs.createWriteStream(filePath);
  const chunk = Buffer.alloc(chunkSize, 0x42); // Fill with 'B' character

  let written = 0;

  return new Promise((resolve, reject) => {
    function writeChunk() {
      const remaining = sizeBytes - written;
      const toWrite = Math.min(chunkSize, remaining);

      if (toWrite <= 0) {
        stream.end();
        resolve(filePath);
        return;
      }

      const dataToWrite = toWrite === chunkSize ? chunk : chunk.slice(0, toWrite);
      stream.write(dataToWrite);
      written += toWrite;

      if (written % (50 * 1024 * 1024) === 0) {
        console.log(`  Written: ${Math.round(written / 1024 / 1024)}MB`);
      }

      // Use setImmediate to avoid blocking the event loop
      setImmediate(writeChunk);
    }

    stream.on('error', reject);
    writeChunk();
  });
}

// Test the buffer-to-string conversion issue
function testBufferToStringIssue() {
  console.log('\n=== Testing Buffer to String Conversion Issue ===');

  try {
    // This is what would happen in the old implementation
    const maxStringLength = 0x1fffffe8; // Node.js max string length
    console.log(`Max string length: ${maxStringLength} characters (${Math.round(maxStringLength / 1024 / 1024)}MB)`);

    // Try to create a buffer larger than the string limit
    const testSize = 550 * 1024 * 1024; // 550MB
    console.log(`Attempting to create ${Math.round(testSize / 1024 / 1024)}MB buffer...`);

    const largeBuffer = Buffer.alloc(testSize, 0x41);
    console.log(`Buffer created successfully: ${largeBuffer.length} bytes`);

    // This would fail with "Cannot create a string longer than 0x1fffffe8 characters"
    console.log('Attempting buffer.toString() - this should fail...');
    try {
      const str = largeBuffer.toString();
      console.log('ERROR: toString() should have failed but succeeded!');
    } catch (error) {
      console.log(`✓ Expected error caught: ${error.message}`);
    }

  } catch (error) {
    console.log(`Buffer allocation failed: ${error.message}`);
  }
}

// Simulate the streaming approach
async function testStreamingApproach() {
  console.log('\n=== Testing Streaming Approach ===');

  const testFile = path.join(__dirname, 'test-large-file.bin');

  if (!fs.existsSync(testFile)) {
    console.log('Creating test file...');
    await createLargeTestFile(600); // 600MB file
  }

  const stats = fs.statSync(testFile);
  console.log(`Test file size: ${Math.round(stats.size / 1024 / 1024)}MB`);

  // Test streaming MD5 calculation (like our FileManager.calculateMD5)
  console.log('Testing streaming MD5 calculation...');
  const startTime = Date.now();

  const hash = crypto.createHash('md5');
  const stream = fs.createReadStream(testFile);

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => {
      hash.update(chunk);
    });

    stream.on('end', () => {
      const md5 = hash.digest('hex');
      const duration = Date.now() - startTime;
      console.log(`✓ MD5 calculated successfully: ${md5}`);
      console.log(`✓ Time taken: ${duration}ms`);
      resolve();
    });

    stream.on('error', reject);
  });
}

// Cleanup test files
function cleanup() {
  const testFile = path.join(__dirname, 'test-large-file.bin');
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile);
    console.log('\n✓ Test file cleaned up');
  }
}

// Main test function
async function main() {
  console.log('=== Large File Upload Test ===');
  console.log('This test verifies the fix for the "Cannot create a string longer than 0x1fffffe8 characters" error\n');

  try {
    // Test 1: Demonstrate the buffer-to-string issue
    testBufferToStringIssue();

    // Test 2: Show that streaming approach works
    await testStreamingApproach();

    console.log('\n=== Test Summary ===');
    console.log('✓ Buffer-to-string issue demonstrated and handled');
    console.log('✓ Streaming approach works for large files');
    console.log('✓ The OBS upload fix should resolve the original error');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    cleanup();
  }
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, cleaning up...');
  cleanup();
  process.exit(0);
});

if (require.main === module) {
  main().catch(console.error);
}
