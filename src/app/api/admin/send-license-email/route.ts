import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email/service';
import { createClient } from '@supabase/supabase-js';
import type { ApiResponse } from '@/types/payment';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payment_id, email } = body;

    if (!payment_id || !email) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment ID and email are required',
          error: { code: 'INVALID_REQUEST' },
        } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Get payment and license information
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', payment_id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment not found',
          error: { code: 'PAYMENT_NOT_FOUND' },
        } satisfies ApiResponse,
        { status: 404 }
      );
    }

    // Get license
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('license_key')
      .eq('payment_id', payment_id)
      .single();

    if (licenseError || !license) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'License not found. Please process the payment first.',
          error: { code: 'LICENSE_NOT_FOUND' },
        } satisfies ApiResponse,
        { status: 404 }
      );
    }

    // Send license email
    const emailResult = await EmailService.sendLicenseEmail({
      userEmail: email,
      userName: payment.customer_info.name || email,
      licenseKey: license.license_key,
      productName: payment.product_info.name,
      activationLimit: 1,
      downloadUrl:
        'https://downloads.topwindow.app/releases/latest/topwindow-setup.dmg',
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          status: 'error',
          message: `Failed to send email: ${emailResult.error}`,
          error: { code: 'EMAIL_SEND_ERROR' },
        } satisfies ApiResponse,
        { status: 500 }
      );
    }

    // Update payment metadata to record email sent
    await supabase
      .from('payments')
      .update({
        metadata: {
          ...payment.metadata,
          last_email_sent_at: new Date().toISOString(),
          last_email_sent_to: email,
          email_message_id: emailResult.messageId,
        },
      })
      .eq('id', payment_id);

    return NextResponse.json({
      status: 'success',
      message: `License email sent successfully to ${email}`,
      data: {
        email,
        messageId: emailResult.messageId,
        licenseKey: license.license_key,
      },
    } satisfies ApiResponse);
  } catch (error) {
    console.error('Send license email error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to send license email',
        error: {
          code: 'SEND_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
