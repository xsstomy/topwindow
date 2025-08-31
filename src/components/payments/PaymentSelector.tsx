'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePayment, useProductInfo } from '@/hooks/usePayment';
import { PaymentSelectorProps } from '@/types/payment-ui';
import PaymentUIService from '@/lib/payment/ui-service';
import {
  CreditCard,
  Shield,
  Zap,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import PaymentOptionCard from './PaymentOptionCard';
import PricingDisplay from './PricingDisplay';
import FeatureList from './FeatureList';

export default function PaymentSelector({
  productId,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentCancel,
  className = '',
  showComparison = true,
}: PaymentSelectorProps) {
  const {
    user,
    loading: paymentLoading,
    error: paymentError,
    createPaymentSession,
  } = usePayment();
  const {
    product,
    loading: productLoading,
    error: productError,
  } = useProductInfo(productId);
  const [selectedProvider, setSelectedProvider] = useState<'creem'>('creem');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentOptions = PaymentUIService.getPaymentOptions();

  const handlePurchase = async () => {
    if (!user) {
      alert('Please login before purchase');
      return;
    }

    if (!product) {
      alert('Loading product information, please try again later');
      return;
    }

    setIsProcessing(true);
    onPaymentStart?.();

    try {
      const session = await createPaymentSession({
        provider: selectedProvider,
        product_id: product.id,
        success_url: `${window.location.origin}/payment/success`,
        customer_email: user.email!,
      });

      console.log('Payment session received:', session);
      console.log('Session URL:', session.sessionUrl);

      // Redirect to payment page
      if (session.sessionUrl) {
        window.location.href = session.sessionUrl;
      } else {
        console.error('No session URL received');
        throw new Error('No session URL received from payment service');
      }
    } catch (error) {
      setIsProcessing(false);
      console.error('Payment session creation failed:', error);
    }
  };

  if (productLoading) {
    return (
      <div className={`flex items-center justify-center p-12 ${className}`}>
        <div className='flex items-center gap-3 text-gray-600'>
          <Loader2 className='w-6 h-6 animate-spin' />
          <span>Loading product information...</span>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-2xl p-8 ${className}`}
      >
        <div className='flex items-center gap-3 text-red-600'>
          <AlertCircle className='w-6 h-6' />
          <div>
            <h3 className='font-semibold'>Loading Failed</h3>
            <p className='text-sm mt-1'>
              {productError?.message ||
                'Unable to load product information, please refresh and try again'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className='p-8 md:p-12'>
        {/* Product Information Header */}
        <motion.div
          className='text-center mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className='text-2xl md:text-3xl font-bold text-gray-900 mb-3'>
            {product.name}
          </h3>
          <p className='text-gray-600 text-lg'>{product.description}</p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* 左侧：价格和功能 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <PricingDisplay
              price={product.price}
              currency={product.currency}
              features={product.features}
              className='mb-6'
            />

            {showComparison && (
              <div className='bg-blue-50 border border-blue-200 rounded-xl p-6'>
                <h4 className='font-semibold text-blue-900 mb-3 flex items-center gap-2'>
                  <Shield className='w-5 h-5' />
                  Purchase Protection
                </h4>
                <div className='space-y-2 text-sm text-blue-800'>
                  <div className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-blue-600' />
                    <span>30-day unconditional money-back guarantee</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-blue-600' />
                    <span>One-time purchase, lifetime usage</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-blue-600' />
                    <span>Free technical support and updates</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-blue-600' />
                    <span>Support for {product.activationLimit} device</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* 右侧：支付方式选择 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className='text-xl font-semibold text-gray-900 mb-6'>
              Choose Payment Method
            </h4>

            <div className='space-y-4 mb-6'>
              {paymentOptions.map(option => (
                <PaymentOptionCard
                  key={option.provider}
                  option={option}
                  selected={selectedProvider === option.provider}
                  onSelect={setSelectedProvider}
                />
              ))}
            </div>

            {/* 错误提示 */}
            {paymentError && (
              <motion.div
                className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className='flex items-center gap-2'>
                  <AlertCircle className='w-5 h-5 text-red-600' />
                  <span className='text-red-600 text-sm font-medium'>
                    {paymentError.message}
                  </span>
                </div>
              </motion.div>
            )}

            {/* 购买按钮 */}
            <motion.button
              onClick={handlePurchase}
              disabled={paymentLoading || isProcessing || !user}
              className='w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {paymentLoading || isProcessing ? (
                <>
                  <Loader2 className='w-6 h-6 animate-spin' />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className='w-6 h-6' />
                  Buy Now - ${product.price}
                </>
              )}
            </motion.button>

            {!user && (
              <p className='text-center text-gray-600 text-sm mt-3'>
                Please login before purchase
              </p>
            )}

            {/* Security Notice */}
            <div className='mt-6 flex items-center justify-center gap-2 text-sm text-gray-500'>
              <Shield className='w-4 h-4' />
              <span>SSL Encrypted Secure Payment</span>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className='flex items-center gap-3 text-center md:text-left'>
            <div className='w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0'>
              <Check className='w-6 h-6 text-green-500' />
            </div>
            <div>
              <h5 className='font-semibold text-gray-900'>
                Instant Activation
              </h5>
              <p className='text-gray-600 text-sm'>
                Get license immediately after successful payment
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3 text-center md:text-left'>
            <div className='w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0'>
              <Shield className='w-6 h-6 text-blue-500' />
            </div>
            <div>
              <h5 className='font-semibold text-gray-900'>
                Security Protection
              </h5>
              <p className='text-gray-600 text-sm'>
                Bank-level SSL encryption protection
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3 text-center md:text-left'>
            <div className='w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0'>
              <Zap className='w-6 h-6 text-purple-500' />
            </div>
            <div>
              <h5 className='font-semibold text-gray-900'>Technical Support</h5>
              <p className='text-gray-600 text-sm'>
                Professional team ready to assist you
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
