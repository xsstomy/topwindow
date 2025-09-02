'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  CreditCard,
  Receipt,
  Calendar,
  Download,
  Eye,
  RefreshCw,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { supabase } from '@/lib/supabase/client';

interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: string;
  product_info: {
    name: string;
    features?: string[];
  };
  customer_info: {
    email: string;
    name?: string;
  };
  payment_provider: string;
  created_at: string;
  completed_at: string | null;
  license?: {
    license_key: string;
    status: string;
    expires_at: string | null;
  } | null;
}

export default function BillingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (user) {
      fetchPayments();
    }
  }, [user, loading, router]);

  const fetchPayments = async () => {
    try {
      setLoadingPayments(true);
      setError('');

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError('No valid session');
        return;
      }

      const response = await fetch('/api/payments/list', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      if (result.status === 'success') {
        setPayments(result.data.payments || []);
      } else {
        setError(result.message || 'Failed to fetch payment records');
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payment records');
    } finally {
      setLoadingPayments(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyLicenseKey = (licenseKey: string) => {
    navigator.clipboard.writeText(licenseKey);
    // You can add a toast notification here
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout
      title='Billing Management'
      description='View your purchase history and billing information'
    >
      {loadingPayments ? (
        <div className='flex items-center justify-center py-12'>
          <RefreshCw className='w-8 h-8 text-primary animate-spin' />
          <span className='ml-2 text-gray-600'>Loading payment records...</span>
        </div>
      ) : error ? (
        <div className='text-center py-12'>
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto'>
            <p className='text-red-600 mb-4'>{error}</p>
            <button onClick={fetchPayments} className='btn-primary'>
              Retry
            </button>
          </div>
        </div>
      ) : payments.length === 0 ? (
        <div className='text-center py-12'>
          <Receipt className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            No Billing Records
          </h3>
          <p className='text-gray-600 mb-6'>
            You don't have any purchase records yet. Bills from purchases will
            appear here.
          </p>
          <button onClick={() => router.push('/')} className='btn-primary'>
            View Products
          </button>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Payment History ({payments.length} records)
            </h3>
            <button
              onClick={fetchPayments}
              className='text-blue-600 hover:text-blue-700 flex items-center gap-2'
            >
              <RefreshCw className='w-4 h-4' />
              Refresh
            </button>
          </div>

          {payments.map(payment => (
            <div
              key={payment.id}
              className='bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'
            >
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h4 className='text-lg font-semibold text-gray-900'>
                    {payment.product_info.name}
                  </h4>
                  <p className='text-sm text-gray-600 mt-1'>
                    Order ID: {payment.id}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-lg font-bold text-gray-900'>
                    {formatAmount(payment.amount, payment.currency)}
                  </p>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                    {payment.status}
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-gray-500'>Payment Method:</span>
                  <span className='ml-2 text-gray-900 capitalize'>
                    {payment.payment_provider}
                  </span>
                </div>
                <div>
                  <span className='text-gray-500'>Date:</span>
                  <span className='ml-2 text-gray-900'>
                    {formatDate(payment.completed_at || payment.created_at)}
                  </span>
                </div>
              </div>

              {payment.license && (
                <div className='mt-4 p-4 bg-blue-50 rounded-lg'>
                  <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-blue-900 mb-1'>
                        License Key
                      </p>
                      <code className='text-xs font-mono text-blue-700 break-all'>
                        {payment.license.license_key}
                      </code>
                    </div>
                    <button
                      onClick={() =>
                        copyLicenseKey(payment.license!.license_key)
                      }
                      className='ml-2 text-blue-600 hover:text-blue-700'
                      title='Copy license key'
                    >
                      <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                        />
                      </svg>
                    </button>
                  </div>
                  <div className='mt-2 flex items-center gap-4 text-xs text-blue-700'>
                    <span>Status: {payment.license.status}</span>
                    {payment.license.expires_at && (
                      <span>
                        Expires: {formatDate(payment.license.expires_at)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className='mt-4 flex gap-2'>
                <button
                  onClick={() =>
                    router.push(`/payment/success?payment_id=${payment.id}`)
                  }
                  className='text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1'
                >
                  <Eye className='w-4 h-4' />
                  View Details
                </button>
                <a
                  href='https://downloads.topwindow.app/releases/latest/topwindow-setup.dmg'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-green-600 hover:text-green-700 flex items-center gap-1'
                >
                  <Download className='w-4 h-4' />
                  Download App
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
