import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { ApiResponse } from '@/types/payment';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get('payment_id');

    if (!paymentId) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Payment ID is required',
          error: { code: 'INVALID_REQUEST' },
        } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Get license for the payment
    const { data: license, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('payment_id', paymentId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = not found
      throw error;
    }

    return NextResponse.json({
      status: 'success',
      data: license,
      message: license ? 'License found' : 'No license found',
    } satisfies ApiResponse);
  } catch (error) {
    console.error('Fetch license error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch license',
        error: {
          code: 'FETCH_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
