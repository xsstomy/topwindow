import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { ApiResponse } from '@/types/payment';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get all payments with pending or failed status
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .in('status', ['pending', 'failed'])
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      status: 'success',
      data: payments || [],
      message: `Found ${payments?.length || 0} pending/failed payments`,
    } satisfies ApiResponse);
  } catch (error) {
    console.error('Fetch pending payments error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch pending payments',
        error: {
          code: 'FETCH_ERROR',
          details: {
            message: error instanceof Error ? error.message : 'Unknown error',
          },
        },
      } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
