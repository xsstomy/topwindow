import { v4 as uuidv4 } from 'uuid';

// Simple hash function for Edge Runtime compatibility
function createSimpleHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}
import { createClient } from '@supabase/supabase-js';
import { createRouteClient } from '@/lib/supabase/server';
import type { 
  TrialAnalytics, 
  TrialStartRequest, 
  TrialEndRequest,
  TrialStatsResponse,
  TrialStatsFilters,
  TrialExportFilters
} from '@/types/analytics';
import type { Database } from '@/types/supabase';
import type {
  TrialAnalyticsInsertData,
  TrialAnalyticsUpdateData,
  TrialStatusUpdateData,
  TrialAnalyticsQueryResult
} from '@/types/database-insert-update';

export class TrialAnalyticsService {
  /**
   * Create Supabase client with service role for analytics operations
   * This bypasses RLS to allow anonymous trial analytics
   */
  private static createServiceClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration for analytics service');
    }
    
    return createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  /**
   * Hash device fingerprint with salt for privacy
   */
  private static hashDeviceFingerprint(fingerprint: string): string {
    const salt = process.env.DEVICE_FINGERPRINT_SALT || 'default-salt-change-in-production';
    return createSimpleHash(fingerprint + salt);
  }

  /**
   * Start a new trial session
   */
  static async startTrial(data: TrialStartRequest): Promise<string> {
    const supabase = this.createServiceClient();
    const trialId = uuidv4();
    const deviceFingerprintHash = this.hashDeviceFingerprint(data.deviceFingerprint);

    try {
      const insertData: TrialAnalyticsInsertData = {
        trial_id: trialId,
        device_fingerprint_hash: deviceFingerprintHash,
        trial_start_at: new Date().toISOString(),
        app_version: data.appVersion,
        system_version: data.systemVersion,
        install_channel: data.installChannel || null,
        device_type: data.deviceType || null,
        trial_status: 'active',
        metadata: {}
      };

      const { error } = await (supabase
        .from('trial_analytics') as any)
        .insert(insertData)

      if (error) {
        console.error('Failed to start trial:', error);
        throw new Error('Failed to start trial analytics');
      }

      return trialId;
    } catch (error) {
      console.error('Error starting trial:', error);
      throw error;
    }
  }

  /**
   * End a trial session
   */
  static async endTrial(data: TrialEndRequest): Promise<number> {
    const supabase = this.createServiceClient();
    const deviceFingerprintHash = this.hashDeviceFingerprint(data.deviceFingerprint);
    const endTime = new Date().toISOString();

    try {
      // First, get the trial record to verify and calculate duration
      const { data: trialData, error: fetchError } = await supabase
        .from('trial_analytics')
        .select('trial_start_at, device_fingerprint_hash')
        .eq('trial_id', data.trialId)
        .single() as {
          data: TrialAnalyticsQueryResult | null;
          error: any;
        };

      if (fetchError || !trialData) {
        throw new Error('Trial session not found');
      }

      // Verify device fingerprint matches
      if (trialData.device_fingerprint_hash !== deviceFingerprintHash) {
        throw new Error('Device fingerprint mismatch');
      }

      // Calculate duration in seconds
      const startTime = new Date(trialData.trial_start_at);
      const duration = Math.round((new Date(endTime).getTime() - startTime.getTime()) / 1000);

      // Update the trial record
      const updateData: TrialAnalyticsUpdateData = {
        trial_end_at: endTime,
        trial_duration_seconds: duration,
        trial_status: 'completed',
        updated_at: endTime
      };
      
      const { error: updateError } = await supabase
        .from('trial_analytics')
        .update(updateData)
        .eq('trial_id', data.trialId);

      if (updateError) {
        console.error('Failed to end trial:', updateError);
        throw new Error('Failed to end trial analytics');
      }

      return duration;
    } catch (error) {
      console.error('Error ending trial:', error);
      throw error;
    }
  }

  /**
   * Get trial statistics (admin only)
   */
  static async getTrialStats(filters?: TrialStatsFilters): Promise<TrialStatsResponse> {
    const supabase = this.createServiceClient();

    try {
      let query = supabase.from('trial_analytics').select('*');

      // Apply filters
      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      if (filters?.channel) {
        query = query.eq('install_channel', filters.channel);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch trial stats:', error);
        throw new Error('Failed to fetch trial statistics');
      }

      if (!data) {
        throw new Error('No trial data found');
      }

      // Calculate summary statistics
      const totalTrials = data.length;
      const activeTrials = data.filter(t => t.trial_status === 'active').length;
      const completedTrials = data.filter(t => t.trial_status === 'completed').length;
      const abandonedTrials = data.filter(t => t.trial_status === 'abandoned').length;

      const completedDurations = data
        .filter(t => t.trial_duration_seconds !== null)
        .map(t => t.trial_duration_seconds as number);

      const averageDuration = completedDurations.length > 0
        ? Math.round(completedDurations.reduce((a, b) => a + b, 0) / completedDurations.length)
        : 0;

      // Calculate channel breakdown
      const channelCounts = new Map<string, number>();
      data.forEach(trial => {
        const channel = trial.install_channel || 'unknown';
        channelCounts.set(channel, (channelCounts.get(channel) || 0) + 1);
      });

      const channelBreakdown = Array.from(channelCounts.entries()).map(([channel, count]) => ({
        channel,
        count,
        percentage: Math.round((count / totalTrials) * 100)
      }));

      // Calculate device type breakdown
      const deviceCounts = new Map<string, number>();
      data.forEach(trial => {
        const type = trial.device_type || 'unknown';
        deviceCounts.set(type, (deviceCounts.get(type) || 0) + 1);
      });

      const deviceTypes = Array.from(deviceCounts.entries()).map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / totalTrials) * 100)
      }));

      // Calculate daily stats (simplified - group by date)
      const dailyStatsMap = new Map<string, {starts: number, completions: number, durations: number[]}>();
      
      data.forEach(trial => {
        const date = trial.created_at.split('T')[0]; // Get YYYY-MM-DD part
        if (!dailyStatsMap.has(date)) {
          dailyStatsMap.set(date, { starts: 0, completions: 0, durations: [] });
        }
        const dayStats = dailyStatsMap.get(date)!;
        dayStats.starts++;
        
        if (trial.trial_status === 'completed' && trial.trial_duration_seconds) {
          dayStats.completions++;
          dayStats.durations.push(trial.trial_duration_seconds);
        }
      });

      const dailyStats = Array.from(dailyStatsMap.entries()).map(([date, stats]) => ({
        date,
        starts: stats.starts,
        completions: stats.completions,
        averageDuration: stats.durations.length > 0 
          ? Math.round(stats.durations.reduce((a, b) => a + b, 0) / stats.durations.length)
          : 0
      }));

      return {
        summary: {
          totalTrials,
          activeTrials,
          completedTrials,
          abandonedTrials,
          averageDuration
        },
        channelBreakdown,
        dailyStats,
        deviceTypes
      };

    } catch (error) {
      console.error('Error getting trial stats:', error);
      throw error;
    }
  }

  /**
   * Export trial data (admin only)
   */
  static async exportTrialData(filters?: TrialExportFilters): Promise<any> {
    const supabase = this.createServiceClient();
    const format = filters?.format || 'csv';

    try {
      let query = supabase.from('trial_analytics').select('*');

      // Apply filters
      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      if (filters?.channel) {
        query = query.eq('install_channel', filters.channel);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to export trial data:', error);
        throw new Error('Failed to export trial data');
      }

      if (!data) {
        throw new Error('No trial data found');
      }

      if (format === 'json') {
        return {
          format: 'json',
          data: data.map(trial => ({
            // Remove sensitive hash for export
            ...trial,
            device_fingerprint_hash: '[HASHED]'
          }))
        };
      } else {
        // CSV format
        const headers = [
          'trial_id',
          'user_id',
          'trial_start_at',
          'trial_end_at',
          'trial_duration_seconds',
          'app_version',
          'system_version',
          'install_channel',
          'device_type',
          'trial_status',
          'created_at'
        ];

        const csvRows = [
          headers.join(','),
          ...data.map(trial => [
            trial.trial_id,
            trial.user_id || '',
            trial.trial_start_at,
            trial.trial_end_at || '',
            trial.trial_duration_seconds || '',
            trial.app_version,
            trial.system_version,
            trial.install_channel || '',
            trial.device_type || '',
            trial.trial_status,
            trial.created_at
          ].join(','))
        ];

        return {
          format: 'csv',
          data: csvRows.join('\n')
        };
      }

    } catch (error) {
      console.error('Error exporting trial data:', error);
      throw error;
    }
  }

  /**
   * Check if user is admin (helper method)
   */
  static async isAdmin(email: string): Promise<boolean> {
    const adminEmails = (process.env.ANALYTICS_ADMIN_EMAILS || '').split(',');
    return adminEmails.includes(email);
  }

  /**
   * Mark abandoned trials (cleanup utility)
   */
  static async markAbandonedTrials(hoursThreshold: number = 24): Promise<number> {
    const supabase = createRouteClient();
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hoursThreshold);

    try {
      const { data, error } = await supabase
        .from('trial_analytics')
        .update({ trial_status: 'abandoned' } satisfies TrialStatusUpdateData)
        .eq('trial_status', 'active')
        .lt('trial_start_at', cutoffTime.toISOString())
        .select();

      if (error) {
        console.error('Failed to mark abandoned trials:', error);
        throw new Error('Failed to mark abandoned trials');
      }

      return data?.length || 0;
    } catch (error) {
      console.error('Error marking abandoned trials:', error);
      throw error;
    }
  }
}