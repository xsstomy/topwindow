/**
 * Build Information Utilities
 * Provides access to build-time information like version, timestamp, and git commit
 */

export interface BuildInfo {
  version: string;
  timestamp: string;
  gitCommit: string;
  shortVersion?: string;
}

/**
 * Get build information from environment variables or defaults
 */
export function getBuildInfo(): BuildInfo {
  const version = process.env.NEXT_PUBLIC_BUILD_VERSION || 'v1.2.0';
  const timestamp =
    process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || new Date().toISOString();
  const gitCommit = process.env.NEXT_PUBLIC_GIT_COMMIT || 'unknown';

  // Extract short version for display (e.g., "v1.0.0-build.20250902" -> "build.20250902")
  let shortVersion = version;
  if (version.includes('-build.')) {
    shortVersion =
      'build.' + version.split('-build.')[1].split('.').slice(0, 2).join('.');
  }

  return {
    version,
    timestamp,
    gitCommit,
    shortVersion,
  };
}

/**
 * Log build information to console
 * Called once when the app loads
 */
export function logBuildInfo(): void {
  if (typeof window === 'undefined') return; // Only run in browser

  const info = getBuildInfo();

  console.group(
    '%c🚀 TopWindow Build Info',
    'color: #3b82f6; font-weight: bold; font-size: 14px'
  );
  console.log('%cVersion:', 'font-weight: bold', info.version);
  console.log('%cBuild Time:', 'font-weight: bold', info.timestamp);
  console.log('%cGit Commit:', 'font-weight: bold', info.gitCommit);
  console.log(
    '%cEnvironment:',
    'font-weight: bold',
    process.env.NODE_ENV || 'production'
  );
  console.groupEnd();
}

/**
 * Format build timestamp for display
 */
export function formatBuildTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return timestamp;
  }
}

/**
 * Get a short display version for the footer
 */
export function getDisplayVersion(): string {
  // In development, always generate a dynamic build version based on current time
  // This helps developers see that the page has refreshed
  if (process.env.NODE_ENV === 'development') {
    const now = new Date();
    const buildDate = now.toISOString().split('T')[0].replace(/-/g, '');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const buildTime = `${hours}${minutes}${seconds}`;
    return `build.${buildDate}.${buildTime}`;
  }

  // In production, get the actual build info from environment variables
  const info = getBuildInfo();

  // Extract build version if present (e.g., "v1.2.0-build.20250903.123949" -> "build.20250903.123949")
  if (info.version.includes('-build.')) {
    return 'build.' + info.version.split('-build.')[1];
  }

  // If we have a shortVersion from the build process, use it
  if (info.shortVersion && info.shortVersion !== info.version) {
    return info.shortVersion;
  }

  // Show version without 'v' prefix for cleaner look
  if (info.version.startsWith('v')) {
    return info.version.substring(1);
  }

  // Fall back to git commit if available
  if (info.gitCommit !== 'unknown') {
    return `${info.gitCommit.slice(0, 7)}`;
  }

  // Last resort: return the raw version
  return info.version;
}
