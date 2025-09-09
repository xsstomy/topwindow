// List user payments API endpoint
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { ApiResponse } from '@/types/payment';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Try Authorization header first; fallback to cookie-based auth
    const authorization = request.headers.get('authorization');
    let user: { id: string } | null = null;

    const authWithHeader = async () => {
      if (!authorization || !authorization.startsWith('Bearer ')) return null;
      const token = authorization.replace('Bearer ', '');
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) return null;
      return data.user;
    };

    const authWithCookies = async () => {
      const authClient = createRouteHandlerClient({ cookies });
      const { data, error } = await authClient.auth.getUser();
      if (error || !data.user) return null;
      return data.user;
    };

    const withTimeout = async <T>(p: Promise<T>, ms = 5000): Promise<T> =>
      (Promise.race([
        p,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AUTH_TIMEOUT')), ms)),
      ]) as unknown) as Promise<T>;

    try {
      user = await withTimeout(authWithHeader().then(u => u ?? authWithCookies()));
    } catch (e) {
      if (e instanceof Error && e.message === 'AUTH_TIMEOUT') {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Authentication timeout. Please try again.',
            error: { code: 'AUTH_TIMEOUT' },
          } satisfies ApiResponse,
          { status: 504 }
        );
      }
      throw e;
    }

    if (!user) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Unauthorized',
          error: { code: 'UNAUTHORIZED' },
        } satisfies ApiResponse,
        { status: 401 }
      );
    }

    // Fetch user's payments with licenses
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select(
        `
        *,
        licenses (
          license_key,
          status,
          expires_at
        )
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError);
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to fetch payment records',
          error: {
            code: 'DATABASE_ERROR',
            details:
              process.env.NODE_ENV === 'development'
                ? { message: paymentsError.message }
                : undefined,
          },
      } satisfies ApiResponse,
      { status: 500 }
    );
    }

    // Transform the data to match the expected format
    const transformedPayments =
      payments?.map(payment => ({
        id: payment.id,
        amount:
          typeof payment.amount === 'string'
            ? parseFloat(payment.amount)
            : payment.amount,
        currency: payment.currency,
        status: payment.status,
        product_info: payment.product_info,
        customer_info: payment.customer_info,
        payment_provider: payment.payment_provider,
        created_at: payment.created_at,
        completed_at: payment.completed_at,
        license: payment.licenses?.[0]
          ? {
              license_key: payment.licenses[0].license_key,
              status: payment.licenses[0].status,
              expires_at: payment.licenses[0].expires_at,
            }
          : null,
      })) || [];

    return NextResponse.json(
      {
        status: 'success',
        message: 'Payment records fetched successfully',
        data: {
          payments: transformedPayments,
          total: transformedPayments.length,
        },
      } satisfies ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('List payments error:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to list payments',
        error: {
          code: 'INTERNAL_ERROR',
          details:
            process.env.NODE_ENV === 'development'
              ? {
                  originalError:
                    error instanceof Error ? error.message : 'Unknown error',
                }
              : undefined,
      },
      } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
