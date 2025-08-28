export interface TrialAnalytics {
  id: string;
  trial_id: string;
  user_id: string | null;
  device_fingerprint_hash: string;
  trial_start_at: string;
  trial_end_at: string | null;
  trial_duration_seconds: number | null;
  app_version: string;
  system_version: string;
  install_channel: string | null;
  device_type: string | null;
  trial_status: 'active' | 'completed' | 'abandoned';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DeviceFingerprint {
  platform: string;              // Operating system
  architecture: string;          // CPU architecture
  locale: string;                // System locale
  timezone: string;              // System timezone
  screenResolution: string;      // Primary display resolution
  appVersion: string;            // Application version
  // Note: Excludes sensitive data like MAC addresses, serial numbers
}

export interface TrialStartRequest {
  deviceFingerprint: string;
  appVersion: string;
  systemVersion: string;
  installChannel?: string;
  deviceType?: string;
}

export interface TrialEndRequest {
  trialId: string;
  deviceFingerprint: string;
}

export interface TrialStartResponse {
  trialId: string;
  success: boolean;
  message?: string;
}

export interface TrialEndResponse {
  trialDuration: number;
  success: boolean;
  message?: string;
}

export interface TrialStatsResponse {
  summary: {
    totalTrials: number;
    activeTrials: number;
    completedTrials: number;
    abandonedTrials: number;
    averageDuration: number;       // In seconds
  };
  channelBreakdown: Array<{
    channel: string;
    count: number;
    percentage: number;
  }>;
  dailyStats: Array<{
    date: string;                  // YYYY-MM-DD format
    starts: number;
    completions: number;
    averageDuration: number;
  }>;
  deviceTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}

export interface TrialExportFilters {
  format?: 'csv' | 'json';
  startDate?: string;
  endDate?: string;
  channel?: string;
}

export interface TrialStatsFilters {
  startDate?: string;
  endDate?: string;
  channel?: string;
}