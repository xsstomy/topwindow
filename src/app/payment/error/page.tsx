'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  AlertTriangle,
  RefreshCw,
  CreditCard,
  ArrowLeft,
  Copy,
  Mail,
  Phone,
} from 'lucide-react';
import Link from 'next/link';

interface PaymentErrorData {
  payment_id?: string;
  provider?: string;
  error_code?: string;
  error_message?: string;
}

interface ErrorSolution {
  code: string;
  title: string;
  description: string;
  solutions: string[];
  severity: 'low' | 'medium' | 'high';
}

export default function PaymentErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [errorData, setErrorData] = useState<PaymentErrorData>({});
  const [copying, setCopying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const provider = searchParams.get('provider');
    const errorCode = searchParams.get('error_code');
    const errorMessage = searchParams.get('error_message');

    setErrorData({
      payment_id: paymentId || undefined,
      provider: provider || undefined,
      error_code: errorCode || undefined,
      error_message: errorMessage || undefined,
    });
  }, [searchParams]);

  const getErrorSolution = (errorCode?: string): ErrorSolution => {
    const errorSolutions: Record<string, ErrorSolution> = {
      CARD_DECLINED: {
        code: 'CARD_DECLINED',
        title: 'Card Declined',
        description:
          'Your card transaction was declined by the bank or card issuer',
        solutions: [
          'Check if card information is correct (card number, expiry date, CVV code)',
          'Confirm sufficient card balance',
          'Contact your bank to confirm any transaction restrictions',
          'Try using another card or payment method',
        ],
        severity: 'medium',
      },
      INSUFFICIENT_FUNDS: {
        code: 'INSUFFICIENT_FUNDS',
        title: 'Insufficient Funds',
        description:
          'Card available balance is insufficient to complete this transaction',
        solutions: [
          'Check if card balance is sufficient',
          'Consider possible pre-authorization hold amounts',
          'Use another card with sufficient balance',
          'Contact bank to confirm account status',
        ],
        severity: 'low',
      },
      EXPIRED_CARD: {
        code: 'EXPIRED_CARD',
        title: 'Card Expired',
        description: 'The card you are using has expired',
        solutions: [
          'Check if card expiry date is correct',
          'Use a non-expired card',
          'Contact bank to apply for new card',
          'Use other payment methods',
        ],
        severity: 'low',
      },
      INVALID_CVC: {
        code: 'INVALID_CVC',
        title: 'Invalid CVV Code',
        description:
          'The CVV security code on the back of your card is incorrect',
        solutions: [
          'Check the 3-digit CVV code on the back of your card',
          'Ensure no input errors or omissions',
          'For American Express cards, CVV code may be 4 digits',
          'Try re-entering or use another card',
        ],
        severity: 'low',
      },
      PROCESSING_ERROR: {
        code: 'PROCESSING_ERROR',
        title: 'Processing Error',
        description: 'A technical error occurred during payment processing',
        solutions: [
          'Retry payment later',
          'Check if network connection is stable',
          'Clear browser cache and cookies',
          'Try using another browser or device',
        ],
        severity: 'medium',
      },
      RATE_LIMIT_EXCEEDED: {
        code: 'RATE_LIMIT_EXCEEDED',
        title: 'Too Many Requests',
        description: 'Too many payment attempts in a short time',
        solutions: [
          'Wait 10-15 minutes before retrying',
          'Ensure only one payment operation',
          'Avoid duplicate payment requests',
          'Contact customer service for assistance',
        ],
        severity: 'low',
      },
      GATEWAY_TIMEOUT: {
        code: 'GATEWAY_TIMEOUT',
        title: 'Gateway Timeout',
        description: 'Payment gateway response timeout',
        solutions: [
          'Check network connection stability',
          'Retry payment later',
          'Try using another network environment',
          'Contact customer service to confirm payment status',
        ],
        severity: 'medium',
      },
    };

    return (
      errorSolutions[errorCode || ''] || {
        code: 'UNKNOWN_ERROR',
        title: 'Unknown Error',
        description: 'An unknown error occurred during payment process',
        solutions: [
          'Please retry payment later',
          'Check network connection',
          'Try using other payment methods',
          'Contact customer service for assistance',
        ],
        severity: 'high',
      }
    );
  };

  const errorSolution = getErrorSolution(errorData.error_code);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-yellow-600 bg-yellow-100';
      case 'medium':
        return 'text-orange-600 bg-orange-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'Easy to solve';
      case 'medium':
        return 'Needs attention';
      case 'high':
        return 'Needs assistance';
      default:
        return 'Unknown';
    }
  };

  const handleRetryPayment = () => {
    router.push('/pricing');
  };

  const copyErrorDetails = async () => {
    setCopying(true);
    const details = `
Error Details:
- Payment ID: ${errorData.payment_id || 'N/A'}
- Payment Method: ${errorData.provider || 'N/A'}
- Error Code: ${errorData.error_code || 'N/A'}
- Error Message: ${errorData.error_message || 'N/A'}
- Time: ${new Date().toLocaleString('en-US')}
    `.trim();

    try {
      await navigator.clipboard.writeText(details);
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      setCopying(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50'>
      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-2xl mx-auto'>
          {/* 主要内容 */}
          <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
            {/* 头部 */}
            <div className='bg-gradient-to-r from-red-500 to-orange-600 px-8 py-12 text-center'>
              <AlertTriangle className='w-20 h-20 text-white mx-auto mb-6' />
              <h1 className='text-3xl font-bold text-white mb-2'>
                Payment Issue
              </h1>
              <p className='text-red-100 text-lg'>
                Your payment could not be completed, but we'll help you resolve
                this
              </p>
            </div>

            {/* 内容区域 */}
            <div className='p-8'>
              {/* 错误信息 */}
              <div className='mb-8'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    ❗ Error Information
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(errorSolution.severity)}`}
                  >
                    {getSeverityText(errorSolution.severity)}
                  </span>
                </div>

                <div className='bg-red-50 border border-red-200 rounded-lg p-6 mb-4'>
                  <h4 className='font-semibold text-red-900 mb-2'>
                    {errorSolution.title}
                  </h4>
                  <p className='text-red-700 text-sm mb-3'>
                    {errorSolution.description}
                  </p>
                  {errorData.error_message && (
                    <div className='bg-white border border-red-300 rounded-lg p-3'>
                      <p className='text-red-600 text-sm font-mono'>
                        {errorData.error_message}
                      </p>
                    </div>
                  )}
                </div>

                {/* 错误详情 */}
                {errorData.payment_id && (
                  <div>
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className='flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-4'
                    >
                      <span
                        className={`transform transition-transform ${showDetails ? 'rotate-90' : ''}`}
                      >
                        ▶
                      </span>
                      View error details
                    </button>

                    {showDetails && (
                      <div className='bg-gray-50 rounded-lg p-4 mb-4'>
                        <div className='space-y-2 text-sm'>
                          <div className='flex justify-between'>
                            <span className='text-gray-600'>Payment ID:</span>
                            <span className='font-mono'>
                              {errorData.payment_id}
                            </span>
                          </div>
                          {errorData.provider && (
                            <div className='flex justify-between'>
                              <span className='text-gray-600'>
                                Payment Method:
                              </span>
                              <span className='capitalize'>
                                {errorData.provider}
                              </span>
                            </div>
                          )}
                          {errorData.error_code && (
                            <div className='flex justify-between'>
                              <span className='text-gray-600'>Error Code:</span>
                              <span className='font-mono'>
                                {errorData.error_code}
                              </span>
                            </div>
                          )}
                          <div className='flex justify-between'>
                            <span className='text-gray-600'>
                              Occurrence Time:
                            </span>
                            <span>{new Date().toLocaleString('en-US')}</span>
                          </div>
                        </div>
                        <button
                          onClick={copyErrorDetails}
                          className='mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm'
                          disabled={copying}
                        >
                          <Copy className='w-4 h-4' />
                          {copying ? 'Copied!' : 'Copy error details'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 解决方案 */}
              <div className='mb-8'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  🔧 Solutions
                </h3>
                <div className='space-y-3'>
                  {errorSolution.solutions.map((solution, index) => (
                    <div
                      key={index}
                      className='flex items-start gap-3 p-4 bg-blue-50 rounded-lg'
                    >
                      <div className='w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5'>
                        {index + 1}
                      </div>
                      <p className='text-blue-800 text-sm'>{solution}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className='flex flex-col sm:flex-row gap-4 mb-8'>
                <button
                  onClick={handleRetryPayment}
                  className='flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2'
                >
                  <RefreshCw className='w-5 h-5' />
                  Retry Payment
                </button>

                <button
                  onClick={() => router.push('/pricing')}
                  className='flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2'
                >
                  <CreditCard className='w-5 h-5' />
                  Choose Other Payment Method
                </button>
              </div>

              {/* 替代支付方式 */}
              <div className='mb-8'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  💳 Other Payment Options
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'>
                    <div className='flex items-center gap-3 mb-2'>
                      <span className='text-2xl'>💳</span>
                      <span className='font-medium'>Credit/Debit Card</span>
                    </div>
                    <p className='text-sm text-gray-600'>
                      Supports Visa, MasterCard, American Express
                    </p>
                  </div>

                  <div className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'>
                    <div className='flex items-center gap-3 mb-2'>
                      <span className='text-2xl'>🟦</span>
                      <span className='font-medium'>PayPal</span>
                    </div>
                    <p className='text-sm text-gray-600'>
                      Secure and convenient online payment
                    </p>
                  </div>
                </div>
              </div>

              {/* 客服支持 */}
              <div className='mb-8'>
                <div className='bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6'>
                  <h4 className='font-semibold text-purple-900 mb-3 flex items-center gap-2'>
                    <Mail className='w-5 h-5' />
                    Need Human Assistance?
                  </h4>
                  <p className='text-purple-800 text-sm mb-4'>
                    If the problem persists, our customer service team is ready
                    to provide professional assistance
                  </p>
                  <div className='flex flex-col sm:flex-row gap-4'>
                    <a
                      href='mailto:xsstomy@gmail.com'
                      className='flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium'
                    >
                      <Mail className='w-4 h-4' />
                      xsstomy@gmail.com
                    </a>
                    <div className='flex items-center gap-2 text-purple-600 font-medium'>
                      <Phone className='w-4 h-4' />
                      Online Support (9:00-18:00)
                    </div>
                  </div>
                </div>
              </div>

              {/* 常见问题快速链接 */}
              <div className='mb-8'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  📚 Related Help
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <Link
                    href='/help/payment'
                    className='flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <span className='text-xl'>💡</span>
                    <span className='text-sm font-medium text-gray-700'>
                      Payment Troubleshooting
                    </span>
                  </Link>
                  <Link
                    href='/help/refund'
                    className='flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <span className='text-xl'>💰</span>
                    <span className='text-sm font-medium text-gray-700'>
                      Refund Policy
                    </span>
                  </Link>
                  <Link
                    href='/help/security'
                    className='flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <span className='text-xl'>🔒</span>
                    <span className='text-sm font-medium text-gray-700'>
                      Payment Security
                    </span>
                  </Link>
                  <Link
                    href='/help/faq'
                    className='flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <span className='text-xl'>❓</span>
                    <span className='text-sm font-medium text-gray-700'>
                      FAQ
                    </span>
                  </Link>
                </div>
              </div>

              {/* 返回选项 */}
              <div className='text-center'>
                <Link
                  href='/'
                  className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium'
                >
                  <ArrowLeft className='w-4 h-4' />
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>

          {/* 安全保障说明 */}
          <div className='mt-8 bg-white rounded-xl shadow-lg p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 text-center flex items-center justify-center gap-2'>
              🔒 Your Payment Security
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-center'>
              <div className='p-3'>
                <div className='text-2xl mb-2'>🛡️</div>
                <div className='font-medium text-gray-900 mb-1'>
                  Bank-level Encryption
                </div>
                <div className='text-sm text-gray-600'>
                  All data transmission is encrypted and protected
                </div>
              </div>
              <div className='p-3'>
                <div className='text-2xl mb-2'>🔐</div>
                <div className='font-medium text-gray-900 mb-1'>
                  No Card Information Storage
                </div>
                <div className='text-sm text-gray-600'>
                  We do not store your credit card information
                </div>
              </div>
              <div className='p-3'>
                <div className='text-2xl mb-2'>✅</div>
                <div className='font-medium text-gray-900 mb-1'>
                  PCI DSS Certified
                </div>
                <div className='text-sm text-gray-600'>
                  Complies with international payment security standards
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// TESTING-GUIDE: 需覆盖用例
// 1. 错误代码解析 - 不同错误类型的正确识别和处理
// 2. 错误详情展示 - 显示/隐藏功能
// 3. 复制功能 - 错误详情复制到剪贴板
// 4. 解决方案匹配 - 根据错误代码提供对应解决方案
// 5. 页面导航 - 重试支付/其他支付方式/返回首页
