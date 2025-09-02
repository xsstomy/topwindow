#!/bin/bash
set -euo pipefail

##
# TopWindow DMG Sync to R2 Script
# Automatically uploads the latest DMG file to Cloudflare R2 storage
##

# Configuration
DMG_SOURCE_DIR="/Users/xiashishi/github/ios/macosapp/projects/PinTop/dmg"
BUCKET_NAME="topwindow-releases"
R2_BASE_PATH="releases"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to find the latest DMG file
find_latest_dmg() {
    local latest_dmg
    latest_dmg=$(find "$DMG_SOURCE_DIR" -name "*.dmg" -type f -exec stat -f "%m %N" {} \; | sort -rn | head -1 | cut -d' ' -f2-)
    
    if [[ -z "$latest_dmg" ]]; then
        log_error "No DMG files found in $DMG_SOURCE_DIR"
        exit 1
    fi
    
    echo "$latest_dmg"
}

# Function to extract version from DMG filename
extract_version() {
    local dmg_file="$1"
    local filename
    filename=$(basename "$dmg_file" .dmg)
    
    # Extract version from filename (e.g., TopWindow-1.1.2.dmg -> 1.1.2)
    if [[ $filename =~ TopWindow-([0-9]+\.[0-9]+\.[0-9]+) ]]; then
        echo "${BASH_REMATCH[1]}"
    else
        log_warning "Could not extract version from filename, using 1.0.0 as fallback"
        echo "1.0.0"
    fi
}

# Function to calculate file size in human readable format
calculate_file_size() {
    local file="$1"
    local size_bytes
    size_bytes=$(stat -f%z "$file")
    
    # Convert to MB with 1 decimal place
    local size_mb
    size_mb=$(echo "scale=1; $size_bytes / 1024 / 1024" | bc)
    echo "${size_mb}MB"
}

# Function to calculate SHA256 checksum
calculate_checksum() {
    local file="$1"
    shasum -a 256 "$file" | cut -d' ' -f1
}

# Function to get current timestamp in ISO format
get_timestamp() {
    date -u +"%Y-%m-%dT%H:%M:%SZ"
}

# Function to upload file to R2
upload_to_r2() {
    local local_file="$1"
    local remote_path="$2"
    
    log_info "Uploading $(basename "$local_file") to R2..."
    
    if wrangler r2 object put "$BUCKET_NAME/$remote_path" --file "$local_file" --remote; then
        log_success "Successfully uploaded to $remote_path"
        return 0
    else
        log_error "Failed to upload $remote_path"
        return 1
    fi
}

# Function to create and upload version.json
create_version_json() {
    local version="$1"
    local dmg_file="$2"
    local checksum="$3"
    local file_size="$4"
    local filename
    filename="topwindow-setup.dmg"
    
    local version_json_content
    version_json_content=$(cat <<EOF
{
  "version": "$version",
  "releaseDate": "$(get_timestamp)",
  "builds": {
    "macos": {
      "filename": "$filename",
      "size": "$file_size",
      "checksum": "sha256:$checksum",
      "url": "https://downloads.topwindow.app/releases/latest/$filename"
    }
  },
  "changelog": [
    "Version $version release",
    "Performance improvements and bug fixes"
  ]
}
EOF
    )
    
    # Create temporary version.json file
    local temp_version_file="/tmp/version.json"
    echo "$version_json_content" > "$temp_version_file"
    
    # Upload version.json
    if upload_to_r2 "$temp_version_file" "$R2_BASE_PATH/latest/version.json"; then
        log_success "Version metadata uploaded successfully"
        rm -f "$temp_version_file"
        return 0
    else
        log_error "Failed to upload version metadata"
        rm -f "$temp_version_file"
        return 1
    fi
}

# Function to show upload summary
show_summary() {
    local version="$1"
    local dmg_file="$2"
    local file_size="$3"
    
    echo ""
    echo "======================================="
    echo "🚀 TopWindow DMG Upload Complete!"
    echo "======================================="
    echo "Version: $version"
    echo "File: $(basename "$dmg_file")"
    echo "Size: $file_size"
    echo "Download URL: https://downloads.topwindow.app/releases/latest/topwindow-setup.dmg"
    echo "Version Info: https://downloads.topwindow.app/releases/latest/version.json"
    echo "======================================="
}

# Main execution
main() {
    log_info "Starting TopWindow DMG sync to R2..."
    
    # Check if wrangler is available
    if ! command -v wrangler &> /dev/null; then
        log_error "wrangler CLI not found. Please install it first: npm install -g wrangler"
        exit 1
    fi
    
    # Check if bc is available for calculations
    if ! command -v bc &> /dev/null; then
        log_error "bc command not found. Please install it: brew install bc"
        exit 1
    fi
    
    # Find the latest DMG file
    log_info "Searching for DMG files in $DMG_SOURCE_DIR..."
    local dmg_file
    dmg_file=$(find_latest_dmg)
    log_info "Found DMG file: $(basename "$dmg_file")"
    
    # Extract version
    local version
    version=$(extract_version "$dmg_file")
    log_info "Detected version: $version"
    
    # Calculate file properties
    log_info "Calculating file properties..."
    local file_size
    file_size=$(calculate_file_size "$dmg_file")
    local checksum
    checksum=$(calculate_checksum "$dmg_file")
    
    log_info "File size: $file_size"
    log_info "Checksum: $checksum"
    
    # Upload DMG file to latest path
    if upload_to_r2 "$dmg_file" "$R2_BASE_PATH/latest/topwindow-setup.dmg"; then
        log_success "DMG uploaded to latest release"
    else
        log_error "Failed to upload DMG file"
        exit 1
    fi
    
    # Also upload to versioned path for archival
    if upload_to_r2 "$dmg_file" "$R2_BASE_PATH/v$version/topwindow-setup.dmg"; then
        log_success "DMG uploaded to versioned release (v$version)"
    else
        log_warning "Failed to upload to versioned path, but continuing..."
    fi
    
    # Create and upload version.json
    if create_version_json "$version" "$dmg_file" "$checksum" "$file_size"; then
        log_success "Version metadata created and uploaded"
    else
        log_error "Failed to create version metadata"
        exit 1
    fi
    
    # Show summary
    show_summary "$version" "$dmg_file" "$file_size"
    
    log_success "DMG sync completed successfully!"
}

# Run main function
main "$@"