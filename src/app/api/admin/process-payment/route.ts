import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payment/service';
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
    const { payment_id, action } = body;

    if (!payment_id) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment ID is required',
          error: { code: 'INVALID_REQUEST' },
        } satisfies ApiResponse,
        { status: 400 }
      );
    }

    if (action !== 'complete') {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid action. Only "complete" is supported',
          error: { code: 'INVALID_ACTION' },
        } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Get payment details
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', payment_id)
      .single();

    if (fetchError || !payment) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment not found',
          error: { code: 'PAYMENT_NOT_FOUND' },
        } satisfies ApiResponse,
        { status: 404 }
      );
    }

    // Check if payment is already completed
    if (payment.status === 'completed') {
      // Check if license exists
      const { data: existingLicense } = await supabase
        .from('licenses')
        .select('license_key')
        .eq('payment_id', payment_id)
        .single();

      return NextResponse.json({
        status: 'success',
        message: 'Payment already completed',
        data: {
          payment_id,
          status: 'completed',
          licenseKey: existingLicense?.license_key,
        },
      } satisfies ApiResponse);
    }

    // Process payment completion
    console.log(`Manually processing payment ${payment_id}`);

    // Simulate webhook data for manual processing
    const webhookData = {
      session_id: payment.provider_session_id,
      payment_id: payment.provider_payment_id || payment_id,
      amount: payment.amount,
      currency: payment.currency,
      status: 'completed',
      metadata: {
        manual_process: true,
        processed_at: new Date().toISOString(),
        processed_by: 'admin',
      },
    };

    // Use PaymentService to handle completion (generates license)
    const result = await PaymentService.handlePaymentCompleted(
      payment_id,
      webhookData
    );

    if (!result.success) {
      throw new Error(result.message);
    }

    // Send license email if enabled
    if (process.env.ENABLE_EMAIL_SENDING === 'true' && result.licenseKey) {
      try {
        await EmailService.sendLicenseEmail({
          userEmail: payment.customer_info.email,
          userName: payment.customer_info.name || payment.customer_info.email,
          licenseKey: result.licenseKey,
          productName: payment.product_info.name,
          activationLimit: 1,
          downloadUrl:
            'https://downloads.topwindow.app/releases/latest/topwindow-setup.dmg',
        });

        console.log(`License email sent to ${payment.customer_info.email}`);
      } catch (emailError) {
        console.error('Failed to send license email:', emailError);
        // Don't fail the whole process if email fails
      }
    }

    return NextResponse.json({
      status: 'success',
      message: 'Payment processed successfully',
      data: {
        payment_id,
        status: 'completed',
        licenseKey: result.licenseKey,
        emailSent: process.env.ENABLE_EMAIL_SENDING === 'true',
      },
    } satisfies ApiResponse);
  } catch (error) {
    console.error('Process payment error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to process payment',
        error: {
          code: 'PROCESSING_ERROR',
          details: {
            message: error instanceof Error ? error.message : 'Unknown error',
          },
        },
      } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
