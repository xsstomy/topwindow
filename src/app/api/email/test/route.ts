import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email/service';
import type { ApiResponse } from '@/types/payment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Email address is required',
          error: { code: 'INVALID_REQUEST' },
        } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid email format',
          error: { code: 'INVALID_EMAIL' },
        } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Check email service configuration
    const configCheck = EmailService.validateConfig();
    if (!configCheck.isValid) {
      return NextResponse.json(
        {
          status: 'error',
          message: `Email service not configured properly. Missing: ${configCheck.missingKeys.join(', ')}`,
          error: { code: 'CONFIG_ERROR' },
        } satisfies ApiResponse,
        { status: 500 }
      );
    }

    // Send test email
    const result = await EmailService.sendTestEmail(email);

    if (!result.success) {
      return NextResponse.json(
        {
          status: 'error',
          message: `Failed to send test email: ${result.error}`,
          error: { code: 'EMAIL_SEND_ERROR' },
        } satisfies ApiResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: `Test email sent successfully to ${email}`,
      data: {
        email,
        messageId: result.messageId,
        mode: process.env.RESEND_API_KEY === 'mock_key' ? 'mock' : 'production',
      },
    } satisfies ApiResponse);
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to send test email',
        error: {
          code: 'SEND_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Health check for email service
    const healthStatus = await EmailService.checkHealth();
    const configCheck = EmailService.validateConfig();

    return NextResponse.json({
      status: healthStatus.isHealthy ? 'success' : 'error',
      message: healthStatus.message,
      data: {
        isHealthy: healthStatus.isHealthy,
        responseTime: healthStatus.responseTime,
        configValid: configCheck.isValid,
        missingConfig: configCheck.missingKeys,
        emailEnabled: process.env.ENABLE_EMAIL_SENDING === 'true',
        mode: process.env.RESEND_API_KEY === 'mock_key' ? 'mock' : 'production',
      },
    } satisfies ApiResponse);
  } catch (error) {
    console.error('Email health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Email service health check failed',
        error: {
          code: 'HEALTH_CHECK_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
