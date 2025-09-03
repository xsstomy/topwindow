#!/usr/bin/env node

/**
 * Generate build information for deployment
 * This script creates build metadata including version, timestamp, and git info
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get current timestamp
const now = new Date();
const timestamp = now.toISOString();
const buildDate = now.toISOString().split('T')[0].replace(/-/g, '');
const buildTime = now.toTimeString().split(' ')[0].replace(/:/g, '');

// Get package version
const packageJson = require('../package.json');
const baseVersion = packageJson.version || '1.0.0';

// Generate build version
const buildVersion = `v${baseVersion}-build.${buildDate}.${buildTime}`;

// Try to get git info
let gitCommit = 'unknown';
let gitBranch = 'unknown';
try {
  gitCommit = execSync('git rev-parse --short HEAD', {
    encoding: 'utf8',
  }).trim();
  gitBranch = execSync('git rev-parse --abbrev-ref HEAD', {
    encoding: 'utf8',
  }).trim();
} catch (error) {
  console.log('Git info not available, using defaults');
}

// Build info object
const buildInfo = {
  version: buildVersion,
  timestamp: timestamp,
  baseVersion: baseVersion,
  gitCommit: gitCommit,
  gitBranch: gitBranch,
  buildDate: buildDate,
  buildTime: buildTime,
  environment: process.env.NODE_ENV || 'production',
};

// Output build info
console.log('📦 Build Information Generated:');
console.log('================================');
console.log(`Version: ${buildInfo.version}`);
console.log(`Timestamp: ${buildInfo.timestamp}`);
console.log(`Git Commit: ${buildInfo.gitCommit}`);
console.log(`Git Branch: ${buildInfo.gitBranch}`);
console.log(`Environment: ${buildInfo.environment}`);
console.log('================================');

// Write build info to a temporary file for the build process
const buildInfoPath = path.join(__dirname, '..', '.build-info.json');
fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
console.log(`✅ Build info saved to ${buildInfoPath}`);

// Also create a public version file that can be served
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const publicBuildInfo = {
  version: buildInfo.version,
  timestamp: buildInfo.timestamp,
  gitCommit: buildInfo.gitCommit,
};

const publicBuildInfoPath = path.join(publicDir, 'build-info.json');
fs.writeFileSync(publicBuildInfoPath, JSON.stringify(publicBuildInfo, null, 2));
console.log(`✅ Public build info saved to ${publicBuildInfoPath}`);

// Export for use in wrangler config
console.log('\n🔧 Environment variables to set:');
console.log(`NEXT_PUBLIC_BUILD_VERSION="${buildInfo.version}"`);
console.log(`NEXT_PUBLIC_BUILD_TIMESTAMP="${buildInfo.timestamp}"`);
console.log(`NEXT_PUBLIC_GIT_COMMIT="${buildInfo.gitCommit}"`);

// Exit successfully
process.exit(0);
