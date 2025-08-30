// TopWindow Download Service
// Handles version management, download links, and analytics

export interface VersionInfo {
  version: string
  releaseDate: string
  builds: {
    windows?: {
      filename: string
      size: string
      checksum: string
      url: string
    }
    macos?: {
      filename: string
      size: string
      checksum: string
      url: string
    }
  }
  changelog: string[]
}

export interface SystemInfo {
  os: 'macos' | 'unknown'
  arch: 'x64' | 'arm64' | 'unknown'
  userAgent: string
}

class DownloadService {
  private baseUrl = 'https://downloads.topwindow.app'
  private versionCache: VersionInfo | null = null
  private cacheExpiry = 5 * 60 * 1000 // 5 minutes

  /**
   * Detect user's operating system and architecture
   */
  detectSystem(): SystemInfo {
    if (typeof window === 'undefined') {
      return { os: 'unknown', arch: 'unknown', userAgent: '' }
    }

    const userAgent = navigator.userAgent
    let os: SystemInfo['os'] = 'unknown'
    let arch: SystemInfo['arch'] = 'unknown'

    // Detect OS (macOS only)
    if (userAgent.includes('Mac')) {
      os = 'macos'
    }

    // Detect architecture
    if (userAgent.includes('x86_64') || userAgent.includes('Win64')) {
      arch = 'x64'
    } else if (userAgent.includes('ARM64') || userAgent.includes('arm64')) {
      arch = 'arm64'
    }

    return { os, arch, userAgent }
  }

  /**
   * Get the latest version information
   */
  async getLatestVersion(): Promise<VersionInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/releases/latest/version.json`, {
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch version info: ${response.status}`)
      }

      const versionInfo = await response.json()
      this.versionCache = versionInfo
      return versionInfo
    } catch (error) {
      console.error('Error fetching version info:', error)
      
      // Fallback to cached version if available
      if (this.versionCache) {
        return this.versionCache
      }

      // Ultimate fallback
      return {
        version: '1.0.0-beta',
        releaseDate: '2025-08-30',
        builds: {
          macos: {
            filename: 'topwindow-setup.dmg',
            size: '12.1MB', 
            checksum: 'sha256:placeholder',
            url: `${this.baseUrl}/releases/latest/topwindow-setup.dmg`
          }
        },
        changelog: ['Initial beta release']
      }
    }
  }

  /**
   * Get recommended download for user's system
   */
  async getRecommendedDownload() {
    const systemInfo = this.detectSystem()
    const versionInfo = await this.getLatestVersion()

    const build = versionInfo.builds.macos

    return {
      build,
      systemInfo,
      versionInfo
    }
  }

  /**
   * Generate download URL for specific platform and version
   */
  generateDownloadUrl(platform: 'macos', version: string = 'latest'): string {
    const filename = 'topwindow-setup.dmg'
    return `${this.baseUrl}/releases/${version}/${filename}`
  }

  /**
   * Track download event (for analytics)
   */
  async trackDownload(platform: 'macos', version: string, userAgent?: string) {
    try {
      // Send analytics to our API
      await fetch('/api/download/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          version,
          userAgent: userAgent || navigator.userAgent,
          timestamp: new Date().toISOString(),
          referrer: typeof document !== 'undefined' ? document.referrer : ''
        })
      })
    } catch (error) {
      // Analytics failure shouldn't break downloads
      console.warn('Failed to track download:', error)
    }
  }

  /**
   * Start download and track analytics
   */
  async startDownload(platform: 'macos', version: string = 'latest') {
    const url = this.generateDownloadUrl(platform, version)
    
    // Track download before starting
    await this.trackDownload(platform, version)

    // Start download
    if (typeof window !== 'undefined') {
      window.open(url, '_blank')
    }

    return url
  }

  /**
   * Check if there's a newer version available
   */
  async checkForUpdates(currentVersion: string): Promise<{
    hasUpdate: boolean
    latestVersion: string
    updateAvailable: boolean
  }> {
    try {
      const versionInfo = await this.getLatestVersion()
      const hasUpdate = this.compareVersions(versionInfo.version, currentVersion) > 0
      
      return {
        hasUpdate,
        latestVersion: versionInfo.version,
        updateAvailable: hasUpdate
      }
    } catch (error) {
      console.error('Error checking for updates:', error)
      return {
        hasUpdate: false,
        latestVersion: currentVersion,
        updateAvailable: false
      }
    }
  }

  /**
   * Compare two semantic versions
   * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
   */
  private compareVersions(v1: string, v2: string): number {
    const clean1 = v1.replace(/[^0-9.]/g, '')
    const clean2 = v2.replace(/[^0-9.]/g, '')
    
    const parts1 = clean1.split('.').map(Number)
    const parts2 = clean2.split('.').map(Number)
    
    const maxLength = Math.max(parts1.length, parts2.length)
    
    for (let i = 0; i < maxLength; i++) {
      const part1 = parts1[i] || 0
      const part2 = parts2[i] || 0
      
      if (part1 < part2) return -1
      if (part1 > part2) return 1
    }
    
    return 0
  }
}

// Export singleton instance
export const downloadService = new DownloadService()
export default downloadService