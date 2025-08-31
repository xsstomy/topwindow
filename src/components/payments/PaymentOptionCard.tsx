'use client';

import { motion } from 'framer-motion';
import { PaymentOptionCardProps } from '@/types/payment-ui';
import { CreditCard, Zap, Shield, Star } from 'lucide-react';

export default function PaymentOptionCard({
  option,
  selected,
  onSelect,
  className = '',
}: PaymentOptionCardProps) {
  const getProviderIcon = () => {
    switch (option.provider) {
      case 'creem':
        return <Zap className='w-6 h-6 text-yellow-500' />;
      default:
        return <CreditCard className='w-6 h-6 text-gray-500' />;
    }
  };

  const getProviderColor = () => {
    return selected
      ? 'border-primary bg-primary/5'
      : 'border-gray-200 hover:border-gray-300';
  };

  return (
    <motion.div
      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${getProviderColor()} ${className}`}
      onClick={() => onSelect(option.provider)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3 flex-1'>
          {/* Radio Button */}
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selected ? 'border-primary bg-primary' : 'border-gray-300'
            }`}
          >
            {selected && (
              <motion.div
                className='w-2 h-2 rounded-full bg-white'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </div>

          {/* Payment Method Information */}
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-1'>
              <h5 className='font-semibold text-gray-900'>{option.name}</h5>
              {option.recommended && (
                <div className='flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium'>
                  <Star className='w-3 h-3' />
                  Recommended
                </div>
              )}
            </div>
            <p className='text-sm text-gray-600 mb-2'>{option.description}</p>

            {/* Features */}
            <div className='flex flex-wrap gap-1'>
              {option.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className='px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs'
                >
                  {feature}
                </span>
              ))}
              {option.features.length > 3 && (
                <span className='text-xs text-gray-500'>
                  +{option.features.length - 3} more
                </span>
              )}
            </div>

            {/* Processing Fee Information */}
            {option.processingFee && (
              <p className='text-xs text-gray-500 mt-2'>
                Processing Fee: {option.processingFee}
              </p>
            )}
          </div>
        </div>

        {/* Payment Method Icon */}
        <div className='flex items-center gap-2'>
          {getProviderIcon()}
          {selected && <Shield className='w-5 h-5 text-green-500' />}
        </div>
      </div>

      {/* Expanded Details */}
      {selected && (
        <motion.div
          className='mt-4 pt-4 border-t border-gray-100'
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <h6 className='font-medium text-gray-900 mb-2'>Key Benefits:</h6>
          <div className='grid grid-cols-2 gap-2'>
            {option.features.map((feature, index) => (
              <div
                key={index}
                className='flex items-center gap-2 text-sm text-gray-600'
              >
                <div className='w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0'></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className='mt-3 p-3 bg-blue-50 rounded-lg'>
            <p className='text-sm text-blue-800'>
              <strong>Creem</strong> secure payment processing for digital
              products.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
