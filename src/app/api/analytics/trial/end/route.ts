import { NextRequest, NextResponse } from 'next/server';
import { TrialAnalyticsService } from '@/lib/analytics/service';
import type { TrialEndRequest, TrialEndResponse } from '@/types/analytics';

// Using Node.js Runtime for better TypeScript compatibility

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
    const body: TrialEndRequest = await request.json();

    // Validate required fields
    if (!body.trialId || !body.deviceFingerprint) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: trialId, deviceFingerprint' 
        },
        { status: 400 }
      );
    }

    // Validate trialId format (should be UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (typeof body.trialId !== 'string' || !uuidRegex.test(body.trialId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid trialId format' },
        { status: 400 }
      );
    }

    // Validate device fingerprint
    if (typeof body.deviceFingerprint !== 'string' || body.deviceFingerprint.length > 1000) {
      return NextResponse.json(
        { success: false, message: 'Invalid deviceFingerprint format' },
        { status: 400 }
      );
    }

    // End trial analytics
    const trialDuration = await TrialAnalyticsService.endTrial(body);

    const response: TrialEndResponse = {
      trialDuration,
      success: true,
      message: 'Trial analytics ended successfully'
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Trial end API error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === 'Trial session not found') {
        return NextResponse.json(
          { success: false, message: 'Trial session not found' },
          { status: 404 }
        );
      }
      
      if (error.message === 'Device fingerprint mismatch') {
        return NextResponse.json(
          { success: false, message: 'Device verification failed' },
          { status: 403 }
        );
      }
    }
    
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
    { message: 'Method not allowed. Use POST to end a trial.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed. Use POST to end a trial.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Method not allowed. Use POST to end a trial.' },
    { status: 405 }
  );
}
