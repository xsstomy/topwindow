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
import type { TrialStatsResponse, TrialStatsFilters } from '@/types/analytics';

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

    // Rate limiting check
    const rateLimitKey = `stats:${adminEmail}`;
    if (!RateLimiter.isAllowed(rateLimitKey, 60, 15 * 60 * 1000)) { // 60 requests per 15 minutes
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
    const filters: TrialStatsFilters = {};

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

    // Get trial statistics
    const stats = await TrialAnalyticsService.getTrialStats(filters);

    // Add metadata to response
    const response = {
      ...stats,
      metadata: {
        requestedBy: adminEmail,
        requestedAt: new Date().toISOString(),
        filters: filters,
        dataPrivacy: 'Device fingerprints are hashed for privacy protection'
      }
    };

    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=300' // Cache for 5 minutes
      }
    });

  } catch (error) {
    console.error('Trial stats API error:', error);
    
    // Return generic error to avoid leaking sensitive information
    return NextResponse.json(AnalyticsErrors.INTERNAL_ERROR, { status: 500 });
  }
}

// Handle other HTTP methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to retrieve trial statistics.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to retrieve trial statistics.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to retrieve trial statistics.' },
    { status: 405 }
  );
}
