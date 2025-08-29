import { NextRequest, NextResponse } from 'next/server';
import { TrialAnalyticsService } from '@/lib/analytics/service';
import type { TrialStartRequest, TrialStartResponse } from '@/types/analytics';

// Edge Runtime configuration for Cloudflare compatibility
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    // Check if analytics is enabled
    const analyticsEnabled = process.env.ANALYTICS_ENABLED === 'true';
    if (!analyticsEnabled) {
      return NextResponse.json(
        { success: false, message: 'Analytics is disabled' },
        { status: 403 }
      );
    }

    // Parse request body
    const body: TrialStartRequest = await request.json();

    // Validate required fields
    if (!body.deviceFingerprint || !body.appVersion || !body.systemVersion) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: deviceFingerprint, appVersion, systemVersion' 
        },
        { status: 400 }
      );
    }

    // Validate data types and lengths
    if (typeof body.deviceFingerprint !== 'string' || body.deviceFingerprint.length > 1000) {
      return NextResponse.json(
        { success: false, message: 'Invalid deviceFingerprint format' },
        { status: 400 }
      );
    }

    if (typeof body.appVersion !== 'string' || body.appVersion.length > 50) {
      return NextResponse.json(
        { success: false, message: 'Invalid appVersion format' },
        { status: 400 }
      );
    }

    if (typeof body.systemVersion !== 'string' || body.systemVersion.length > 100) {
      return NextResponse.json(
        { success: false, message: 'Invalid systemVersion format' },
        { status: 400 }
      );
    }

    // Optional fields validation
    if (body.installChannel && (typeof body.installChannel !== 'string' || body.installChannel.length > 100)) {
      return NextResponse.json(
        { success: false, message: 'Invalid installChannel format' },
        { status: 400 }
      );
    }

    if (body.deviceType && (typeof body.deviceType !== 'string' || body.deviceType.length > 100)) {
      return NextResponse.json(
        { success: false, message: 'Invalid deviceType format' },
        { status: 400 }
      );
    }

    // Start trial analytics
    const trialId = await TrialAnalyticsService.startTrial(body);

    const response: TrialStartResponse = {
      trialId,
      success: true,
      message: 'Trial analytics started successfully'
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Trial start API error:', error);
    
    // Return generic error to avoid leaking sensitive information
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed. Use POST to start a trial.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed. Use POST to start a trial.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Method not allowed. Use POST to start a trial.' },
    { status: 405 }
  );
}
