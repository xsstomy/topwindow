import { useState, useEffect } from 'react';

interface BuildInfo {
  version: string;
  timestamp: string;
  gitCommit: string;
}

export function useBuildInfo() {
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always fetch the build-info.json file (both dev and production)
    fetch('/build-info.json')
      .then(response => response.json())
      .then(data => {
        setBuildInfo(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load build info:', error);
        // If fetch fails, set a fallback
        setBuildInfo(null);
        setLoading(false);
      });
  }, []);

  // Extract display version from the build info
  const getDisplayVersion = (): string => {
    // Always use the fetched build info if available (both dev and production)
    if (buildInfo?.version) {
      // Extract build version (e.g., "v1.2.0-build.20250903.134046" -> "build.20250903.134046")
      if (buildInfo.version.includes('-build.')) {
        return 'build.' + buildInfo.version.split('-build.')[1];
      }

      // Remove 'v' prefix if present
      if (buildInfo.version.startsWith('v')) {
        return buildInfo.version.substring(1);
      }

      return buildInfo.version;
    }

    // Fallback to git commit if available
    if (buildInfo?.gitCommit && buildInfo.gitCommit !== 'unknown') {
      return buildInfo.gitCommit.slice(0, 7);
    }

    // If loading or no data, return empty string to avoid hydration issues
    return '';
  };

  return {
    buildInfo,
    loading,
    displayVersion: getDisplayVersion(),
  };
}
