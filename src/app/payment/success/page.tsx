'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CheckCircle,
  Download,
  Mail,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

interface PaymentStatusData {
  payment: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    product_info: {
      name: string;
      features: string[];
    };
    customer_info: {
      email: string;
      name?: string;
    };
    completed_at: string;
  };
  license?: {
    license_key: string;
    status: string;
    expires_at: string | null;
  };
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [paymentData, setPaymentData] = useState<PaymentStatusData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(10);

  const paymentId = searchParams.get('payment_id');
  const provider = searchParams.get('provider');

  useEffect(() => {
    if (!paymentId) {
      setError('Missing payment information');
      setLoading(false);
      return;
    }

    fetchPaymentStatus();
  }, [paymentId]);

  // Countdown and auto redirect
  useEffect(() => {
    if (paymentData && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0 && user) {
      router.push('/dashboard');
    }
  }, [countdown, paymentData, user, router]);

  const fetchPaymentStatus = async () => {
    try {
      const response = await fetch(
        `/api/payments/status?payment_id=${paymentId}`
      );
      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setPaymentData(data.data);
      } else {
        setError(data.message || 'Failed to fetch payment status');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyLicenseKey = () => {
    if (paymentData?.license?.license_key) {
      navigator.clipboard.writeText(paymentData.license.license_key);
      // Could add a success toast here
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center'>
        <div className='bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4'>
          <div className='flex flex-col items-center'>
            <RefreshCw className='w-12 h-12 text-green-500 animate-spin mb-4' />
            <h2 className='text-xl font-semibold text-gray-900 mb-2'>
              Processing Payment Information
            </h2>
            <p className='text-gray-600 text-center'>
              Verifying your payment status, please wait...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center'>
        <div className='bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4'>
          <div className='flex flex-col items-center'>
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6'>
              <span className='text-red-600 text-2xl'>❌</span>
            </div>
            <h2 className='text-xl font-semibold text-gray-900 mb-2'>
              Processing Failed
            </h2>
            <p className='text-gray-600 text-center mb-6'>{error}</p>
            <button
              onClick={fetchPaymentStatus}
              className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors'
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
        <div className='bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4'>
          <div className='flex flex-col items-center'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6'>
              <span className='text-gray-600 text-2xl'>❓</span>
            </div>
            <h2 className='text-xl font-semibold text-gray-900 mb-2'>
              Payment Information Not Found
            </h2>
            <p className='text-gray-600 text-center'>
              No related payment records found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'>
      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-2xl mx-auto'>
          {/* Success message */}
          <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
            {/* Header */}
            <div className='bg-gradient-to-r from-green-500 to-blue-600 px-8 py-12 text-center'>
              <CheckCircle className='w-20 h-20 text-white mx-auto mb-6' />
              <h1 className='text-3xl font-bold text-white mb-2'>
                🎉 Payment Successful!
              </h1>
              <p className='text-green-100 text-lg'>
                Thank you for purchasing {paymentData.payment.product_info.name}
              </p>
            </div>

            {/* Content area */}
            <div className='p-8'>
              {/* Payment details */}
              <div className='mb-8'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  📋 Payment Details
                </h3>
                <div className='bg-gray-50 rounded-lg p-6 space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Product</span>
                    <span className='font-medium'>
                      {paymentData.payment.product_info.name}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Amount</span>
                    <span className='font-medium'>
                      {formatAmount(
                        paymentData.payment.amount,
                        paymentData.payment.currency
                      )}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Payment Method</span>
                    <span className='font-medium capitalize'>{provider}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Completion Time</span>
                    <span className='font-medium'>
                      {formatDate(paymentData.payment.completed_at)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Status</span>
                    <span className='font-medium text-green-600'>
                      ✅ Completed
                    </span>
                  </div>
                </div>
              </div>

              {/* License information */}
              {paymentData.license ? (
                <div className='mb-8'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                    🔑 Your License
                  </h3>
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
                    <div className='text-sm text-blue-700 mb-2'>
                      License Key
                    </div>
                    <div className='bg-white border border-blue-300 rounded-lg p-4 mb-4'>
                      <code className='text-lg font-mono text-blue-900 break-all'>
                        {paymentData.license.license_key}
                      </code>
                    </div>
                    <button
                      onClick={copyLicenseKey}
                      className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2'
                    >
                      📋 Copy License
                    </button>
                  </div>
                </div>
              ) : (
                <div className='mb-8'>
                  <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6'>
                    <div className='flex items-center gap-3 mb-2'>
                      <Mail className='w-5 h-5 text-yellow-600' />
                      <span className='font-medium text-yellow-800'>
                        License is being generated
                      </span>
                    </div>
                    <p className='text-yellow-700 text-sm'>
                      Your license will be sent to{' '}
                      {paymentData.payment.customer_info.email} via email within
                      a few minutes
                    </p>
                  </div>
                </div>
              )}

              {/* Product features */}
              <div className='mb-8'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  ✨ Product Features
                </h3>
                <div className='grid gap-2'>
                  {paymentData.payment.product_info.features?.map(
                    (feature, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'
                      >
                        <CheckCircle className='w-5 h-5 text-green-500 flex-shrink-0' />
                        <span className='text-gray-700'>{feature}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Next steps */}
              <div className='mb-8'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  📱 Next Steps
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg'>
                    <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
                      1
                    </div>
                    <div>
                      <div className='font-medium text-gray-900'>
                        Download TopWindow App
                      </div>
                      <div className='text-sm text-gray-600'>
                        Get the latest version of TopWindow app
                      </div>
                    </div>
                    <Download className='w-5 h-5 text-blue-600' />
                  </div>

                  <div className='flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg'>
                    <div className='w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
                      2
                    </div>
                    <div>
                      <div className='font-medium text-gray-900'>
                        Activate Your License
                      </div>
                      <div className='text-sm text-gray-600'>
                        Enter your license key in the app
                      </div>
                    </div>
                    <span className='text-2xl'>🔑</span>
                  </div>

                  <div className='flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg'>
                    <div className='w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
                      3
                    </div>
                    <div>
                      <div className='font-medium text-gray-900'>
                        Start Using
                      </div>
                      <div className='text-sm text-gray-600'>
                        Enjoy powerful window management features
                      </div>
                    </div>
                    <span className='text-2xl'>🚀</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className='flex flex-col sm:flex-row gap-4'>
                <a
                  href='https://downloads.topwindow.app/releases/latest/topwindow-setup.dmg'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2'
                >
                  <Download className='w-5 h-5' />
                  Download TopWindow
                </a>

                {user && (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className='flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2'
                  >
                    <ArrowRight className='w-5 h-5' />
                    Go to Dashboard ({countdown}s)
                  </button>
                )}
              </div>

              {/* Help information */}
              <div className='mt-8 p-4 bg-gray-50 rounded-lg text-center'>
                <p className='text-sm text-gray-600 mb-2'>
                  Need help? Please check our
                  <a
                    href='/help'
                    className='text-blue-600 hover:text-blue-700 ml-1'
                  >
                    Help Documentation
                  </a>
                  or contact
                  <a
                    href='mailto:xsstomy@gmail.com'
                    className='text-blue-600 hover:text-blue-700 ml-1'
                  >
                    Technical Support
                  </a>
                </p>
                <p className='text-xs text-gray-500'>
                  Payment ID: {paymentData.payment.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// TESTING-GUIDE: 需覆盖用例
// 1. 支付状态获取 - 成功/失败/网络错误
// 2. 许可证显示 - 有许可证/无许可证/生成中
// 3. 自动跳转 - 倒计时功能/用户交互
// 4. 复制功能 - 许可证复制到剪贴板
// 5. 响应式设计 - 不同屏幕尺寸的适配
