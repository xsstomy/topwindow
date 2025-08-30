// Download Version Management API
import { NextRequest, NextResponse } from 'next/server'

export interface VersionInfo {
  version: string
  releaseDate: string
  builds: {
    macos?: {
      filename: string
      size: string
      checksum: string
      url: string
    }
  }
  changelog: string[]
}

/**
 * GET /api/download/versions
 * Returns version information for TopWindow releases
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const version = searchParams.get('version') || 'latest'
    
    // Base URL for downloads
    const baseUrl = 'https://downloads.topwindow.app'
    
    if (version === 'latest') {
      // Fetch latest version info from R2
      try {
        const response = await fetch(`${baseUrl}/releases/latest/version.json`, {
          cache: 'no-cache',
          headers: {
            'User-Agent': 'TopWindow-Website/1.0'
          }
        })
        
        if (response.ok) {
          const versionInfo = await response.json()
          return NextResponse.json({
            success: true,
            version: versionInfo
          })
        }
      } catch (fetchError) {
        console.warn('Failed to fetch from R2, using fallback:', fetchError)
      }
      
      // Fallback version info
      const fallbackVersion: VersionInfo = {
        version: '1.0.0-beta',
        releaseDate: '2025-08-30',
        builds: {
          macos: {
            filename: 'topwindow-setup.dmg',
            size: '12.1MB',
            checksum: 'sha256:pending_checksum',
            url: `${baseUrl}/releases/latest/topwindow-setup.dmg`
          }
        },
        changelog: [
          'Initial beta release',
          'Core window management features',
          'Native macOS support with universal binary',
          'Accessibility permissions integration',
          'Basic hotkey system'
        ]
      }
      
      return NextResponse.json({
        success: true,
        version: fallbackVersion
      })
    }
    
    // Handle specific version requests
    if (version.match(/^v?\d+\.\d+\.\d+/)) {
      // For now, redirect all version requests to latest
      // In future, implement version-specific logic
      const versionInfo: VersionInfo = {
        version: version.startsWith('v') ? version : `v${version}`,
        releaseDate: '2025-08-30',
        builds: {
          macos: {
            filename: 'topwindow-setup.dmg',
            size: '12.1MB',
            checksum: 'sha256:version_specific_checksum',
            url: `${baseUrl}/releases/${version}/topwindow-setup.dmg`
          }
        },
        changelog: [
          `Release notes for ${version}`,
          'Features and improvements'
        ]
      }
      
      return NextResponse.json({
        success: true,
        version: versionInfo
      })
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid version format'
      },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Version API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/download/versions/list
 * Returns list of all available versions
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'list') {
      // Return available versions
      const versions = [
        {
          version: '1.0.0-beta',
          releaseDate: '2025-08-30',
          isLatest: true,
          isStable: false,
          downloads: {
            macos: 'https://downloads.topwindow.app/releases/latest/topwindow-setup.dmg'
          }
        }
      ]
      
      return NextResponse.json({
        success: true,
        versions,
        count: versions.length
      })
    }
    
    if (action === 'check-update') {
      const body = await request.json()
      const currentVersion = body.currentVersion
      
      // Simple version comparison (in real app, use proper semver)
      const latestVersion = '1.0.0-beta'
      const hasUpdate = currentVersion !== latestVersion
      
      return NextResponse.json({
        success: true,
        hasUpdate,
        latestVersion,
        currentVersion
      })
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action'
      },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Version list API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}