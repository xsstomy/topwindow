import { NextRequest, NextResponse } from 'next/server';
import { TrialAnalyticsService } from '@/lib/analytics/service';
import { 
  verifyAdminAccess, 
  isAnalyticsEnabled, 
  isValidDate, 
  isValidDateRange,
  AnalyticsErrors,
  RateLimiter
} from '@/lib/analytics/auth-helpers';
import type { TrialExportFilters } from '@/types/analytics';

// Edge Runtime configuration for Cloudflare compatibility
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    // Check if analytics is enabled
    if (!isAnalyticsEnabled()) {
      return NextResponse.json(AnalyticsErrors.ANALYTICS_DISABLED, { status: 403 });
    }

    // Verify admin access
    const adminEmail = await verifyAdminAccess(request);
    if (!adminEmail) {
      return NextResponse.json(AnalyticsErrors.UNAUTHORIZED, { status: 401 });
    }

    // Rate limiting check (stricter for export)
    const rateLimitKey = `export:${adminEmail}`;
    if (!RateLimiter.isAllowed(rateLimitKey, 10, 15 * 60 * 1000)) { // 10 exports per 15 minutes
      return NextResponse.json(
        {
          ...AnalyticsErrors.RATE_LIMITED,
          resetTime: RateLimiter.getResetTime(rateLimitKey)
        }, 
        { status: 429 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const filters: TrialExportFilters = {};

    // Validate format parameter
    const format = searchParams.get('format') as 'csv' | 'json' | null;
    if (format && !['csv', 'json'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be "csv" or "json".' },
        { status: 400 }
      );
    }
    filters.format = format || 'csv';

    // Validate and set date filters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const channel = searchParams.get('channel');

    if (startDate) {
      if (!isValidDate(startDate)) {
        return NextResponse.json(AnalyticsErrors.INVALID_DATE_FORMAT, { status: 400 });
      }
      filters.startDate = startDate;
    }

    if (endDate) {
      if (!isValidDate(endDate)) {
        return NextResponse.json(AnalyticsErrors.INVALID_DATE_FORMAT, { status: 400 });
      }
      filters.endDate = endDate;
    }

    if (channel) {
      if (typeof channel !== 'string' || channel.length > 100) {
        return NextResponse.json(
          { error: 'Invalid channel parameter', code: 'INVALID_CHANNEL' },
          { status: 400 }
        );
      }
      filters.channel = channel;
    }

    // Validate date range
    if (startDate && endDate && !isValidDateRange(startDate, endDate)) {
      return NextResponse.json(AnalyticsErrors.INVALID_DATE_RANGE, { status: 400 });
    }

    // Export trial data
    const exportResult = await TrialAnalyticsService.exportTrialData(filters);

    // Generate filename with timestamp and filters
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const filterSuffix = startDate && endDate 
      ? `_${startDate.split('T')[0]}_to_${endDate.split('T')[0]}` 
      : '';
    const channelSuffix = channel ? `_${channel}` : '';
    const filename = `trial_analytics_${timestamp}${filterSuffix}${channelSuffix}.${filters.format}`;

    // Set appropriate headers for file download
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('X-Exported-By', adminEmail);
    headers.set('X-Export-Timestamp', new Date().toISOString());

    if (filters.format === 'csv') {
      headers.set('Content-Type', 'text/csv');
      return new NextResponse(exportResult.data, {
        status: 200,
        headers
      });
    } else {
      headers.set('Content-Type', 'application/json');
      
      // Add metadata to JSON export
      const jsonData = {
        metadata: {
          exportedBy: adminEmail,
          exportedAt: new Date().toISOString(),
          format: 'json',
          filters: filters,
          totalRecords: exportResult.data.length,
          dataPrivacy: 'Device fingerprints are hashed for privacy protection'
        },
        data: exportResult.data
      };

      return new NextResponse(JSON.stringify(jsonData, null, 2), {
        status: 200,
        headers
      });
    }

  } catch (error) {
    console.error('Trial export API error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === 'No trial data found') {
        return NextResponse.json(
          { error: 'No trial data found for the specified filters' },
          { status: 404 }
        );
      }
    }
    
    // Return generic error to avoid leaking sensitive information
    return NextResponse.json(AnalyticsErrors.INTERNAL_ERROR, { status: 500 });
  }
}

// Handle other HTTP methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to export trial data.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to export trial data.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to export trial data.' },
    { status: 405 }
  );
}
