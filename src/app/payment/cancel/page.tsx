'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, CreditCard, HelpCircle, Mail } from 'lucide-react';
import { formatPrice, TOPWINDOW_LICENSE_PRICE } from '@/config/pricing';
import Link from 'next/link';

interface PaymentCancelData {
  payment_id?: string;
  provider?: string;
  reason?: string;
}

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [paymentData, setPaymentData] = useState<PaymentCancelData>({});
  const [showFAQ, setShowFAQ] = useState(false);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const provider = searchParams.get('provider');
    const reason = searchParams.get('reason');

    setPaymentData({
      payment_id: paymentId || undefined,
      provider: provider || undefined,
      reason: reason || undefined,
    });
  }, [searchParams]);

  const handleRetryPayment = () => {
    router.push('/pricing');
  };

  const faqs = [
    {
      question: 'Why was my payment canceled?',
      answer:
        'Payments may be canceled for the following reasons: user cancellation, bank card verification failure, network connection interruption, or payment timeout.',
    },
    {
      question: 'Is my money safe?',
      answer:
        'Yes, canceled payments do not incur any charges. If you see pre-authorization charges, they will typically be automatically refunded to your account within 1-3 business days.',
    },
    {
      question: 'How can I complete payment again?',
      answer:
        'You can click the "Purchase Again" button to return to the purchase page and select a payment method to complete your purchase.',
    },
    {
      question: 'What payment methods are supported?',
      answer:
        'We support multiple payment methods including credit cards, debit cards, PayPal, and more. We recommend using a stable network environment for payment.',
    },
  ];

  const commonReasons = [
    {
      title: 'Network Connection Issues',
      description: 'Unstable network connection during payment',
      solution:
        'Please check network connection, use stable WiFi or mobile network to retry',
    },
    {
      title: 'Incorrect Card Information',
      description: 'Card number, expiry date, or CVV code entered incorrectly',
      solution:
        'Please carefully check card information, ensure all fields are filled correctly',
    },
    {
      title: 'Insufficient Balance',
      description: 'Card balance insufficient to complete this payment',
      solution:
        'Please ensure card has sufficient balance, or use another payment method',
    },
    {
      title: 'Bank Restrictions',
      description:
        'Bank has restrictions on online payments or requires verification',
      solution:
        'Please contact your bank to confirm if online payment functionality is enabled',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50'>
      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-2xl mx-auto'>
          {/* 主要内容 */}
          <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
            {/* 头部 */}
            <div className='bg-gradient-to-r from-orange-500 to-red-600 px-8 py-12 text-center'>
              <XCircle className='w-20 h-20 text-white mx-auto mb-6' />
              <h1 className='text-3xl font-bold text-white mb-2'>
                Payment Canceled
              </h1>
              <p className='text-orange-100 text-lg'>
                Your payment process has been canceled, no need to worry about
                fund safety
              </p>
            </div>

            {/* 内容区域 */}
            <div className='p-8'>
              {/* 取消信息 */}
              {paymentData.payment_id && (
                <div className='mb-8'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                    📋 Cancellation Details
                  </h3>
                  <div className='bg-gray-50 rounded-lg p-6 space-y-3'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Payment ID</span>
                      <span className='font-mono text-sm'>
                        {paymentData.payment_id}
                      </span>
                    </div>
                    {paymentData.provider && (
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Payment Method</span>
                        <span className='font-medium capitalize'>
                          {paymentData.provider}
                        </span>
                      </div>
                    )}
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Status</span>
                      <span className='font-medium text-orange-600'>
                        ❌ Canceled
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Cancellation Time</span>
                      <span className='font-medium'>
                        {new Date().toLocaleString('en-US')}
                      </span>
                    </div>
                    {paymentData.reason && (
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>
                          Cancellation Reason
                        </span>
                        <span className='font-medium'>
                          {paymentData.reason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 重要说明 */}
              <div className='mb-8'>
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
                  <h4 className='font-semibold text-blue-900 mb-3 flex items-center gap-2'>
                    <span className='text-xl'>💳</span>
                    Fund Security Guarantee
                  </h4>
                  <ul className='text-blue-800 text-sm space-y-2'>
                    <li>• Canceled payments do not incur any charges</li>
                    <li>
                      • If there are pre-authorization charges, they will
                      automatically be refunded within 1-3 business days
                    </li>
                    <li>
                      • Your card information is completely secure and not
                      stored
                    </li>
                  </ul>
                </div>
              </div>

              {/* 常见原因 */}
              <div className='mb-8'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  🔍 Common Cancellation Reasons and Solutions
                </h3>
                <div className='space-y-4'>
                  {commonReasons.map((reason, index) => (
                    <div
                      key={index}
                      className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'
                    >
                      <div className='font-medium text-gray-900 mb-2'>
                        {reason.title}
                      </div>
                      <div className='text-sm text-gray-600 mb-2'>
                        {reason.description}
                      </div>
                      <div className='text-sm text-blue-600 font-medium'>
                        💡 Solution: {reason.solution}
                      </div>
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
                  <CreditCard className='w-5 h-5' />
                  Purchase Again
                </button>

                <Link
                  href='/'
                  className='flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-decoration-none'
                >
                  <ArrowLeft className='w-5 h-5' />
                  Return to Homepage
                </Link>
              </div>

              {/* FAQ 部分 */}
              <div className='mb-8'>
                <button
                  onClick={() => setShowFAQ(!showFAQ)}
                  className='w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors'
                >
                  <div className='flex items-center gap-3'>
                    <HelpCircle className='w-5 h-5 text-blue-600' />
                    <span className='font-medium text-gray-900'>
                      Frequently Asked Questions
                    </span>
                  </div>
                  <span
                    className={`transform transition-transform ${showFAQ ? 'rotate-180' : ''}`}
                  >
                    ▼
                  </span>
                </button>

                {showFAQ && (
                  <div className='mt-4 space-y-4'>
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className='border-l-4 border-blue-400 pl-4 py-2'
                      >
                        <div className='font-medium text-gray-900 mb-2'>
                          {faq.question}
                        </div>
                        <div className='text-sm text-gray-600'>
                          {faq.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 联系支持 */}
              <div className='text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg'>
                <h4 className='font-semibold text-gray-900 mb-3 flex items-center justify-center gap-2'>
                  <Mail className='w-5 h-5 text-blue-600' />
                  Need Help?
                </h4>
                <p className='text-gray-600 mb-4'>
                  If you continue to experience payment issues, our support team
                  is ready to provide assistance
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <a
                    href='mailto:xsstomy@gmail.com'
                    className='text-blue-600 hover:text-blue-700 font-medium'
                  >
                    📧 xsstomy@gmail.com
                  </a>
                  <Link
                    href='/help'
                    className='text-blue-600 hover:text-blue-700 font-medium'
                  >
                    📚 Help Center
                  </Link>
                </div>
              </div>

              {/* 底部信息 */}
              <div className='mt-8 pt-6 border-t border-gray-200 text-center'>
                <p className='text-sm text-gray-500 mb-2'>
                  TopWindow - Make your Mac window management more efficient
                </p>
                <div className='flex justify-center gap-4 text-xs text-gray-400'>
                  <Link href='/privacy' className='hover:text-gray-600'>
                    Privacy Policy
                  </Link>
                  <Link href='/terms' className='hover:text-gray-600'>
                    Terms of Service
                  </Link>
                  <Link href='/refund' className='hover:text-gray-600'>
                    Refund Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 产品特色提醒 */}
          <div className='mt-8 bg-white rounded-xl shadow-lg p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 text-center'>
              🚀 Powerful Features You're Missing
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                <span className='text-2xl'>⚡</span>
                <div>
                  <div className='font-medium text-gray-900'>
                    Fast Window Switching
                  </div>
                  <div className='text-sm text-gray-600'>
                    One-click switching between any application windows
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                <span className='text-2xl'>📐</span>
                <div>
                  <div className='font-medium text-gray-900'>
                    Smart Window Arrangement
                  </div>
                  <div className='text-sm text-gray-600'>
                    Automatically organize desktop layout
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                <span className='text-2xl'>🎯</span>
                <div>
                  <div className='font-medium text-gray-900'>
                    Precise Window Control
                  </div>
                  <div className='text-sm text-gray-600'>
                    Pixel-level precision adjustment
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                <span className='text-2xl'>⚙️</span>
                <div>
                  <div className='font-medium text-gray-900'>
                    Personalized Settings
                  </div>
                  <div className='text-sm text-gray-600'>
                    Completely customizable experience
                  </div>
                </div>
              </div>
            </div>
            <div className='text-center mt-6'>
              <button
                onClick={handleRetryPayment}
                className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105'
              >
                Buy Now - Only {formatPrice(TOPWINDOW_LICENSE_PRICE)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// TESTING-GUIDE: 需覆盖用例
// 1. URL参数解析 - payment_id/provider/reason参数处理
// 2. FAQ交互 - 展开/收起功能
// 3. 页面导航 - 重新购买/返回首页
// 4. 响应式设计 - 移动端和桌面端适配
// 5. 链接功能 - 邮箱/帮助中心/政策页面
