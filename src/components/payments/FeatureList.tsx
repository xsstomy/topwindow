'use client';

import { motion } from 'framer-motion';
import { FeatureListProps } from '@/types/payment-ui';
import { Check, Star } from 'lucide-react';

export default function FeatureList({
  features,
  className = '',
  showCheckmarks = true,
}: FeatureListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className={`space-y-3 ${className}`}
      variants={containerVariants}
      initial='hidden'
      animate='show'
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className='flex items-center gap-3'
          variants={itemVariants}
          transition={{ duration: 0.3 }}
        >
          {showCheckmarks ? (
            <div className='flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
              <Check className='w-4 h-4 text-white' />
            </div>
          ) : (
            <div className='flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2'></div>
          )}

          <span className='text-gray-700 font-medium'>{feature}</span>

          {/* Feature Highlight Marker */}
          {(feature.includes('Lifetime') ||
            feature.includes('Free') ||
            feature.includes('Support')) && (
            <Star className='w-4 h-4 text-yellow-500 flex-shrink-0' />
          )}
        </motion.div>
      ))}

      {/* Additional Value Note */}
      {features.length > 0 && (
        <motion.div
          className='mt-4 pt-4 border-t border-gray-100'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: features.length * 0.1 }}
        >
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <div className='w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center'>
              <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
            </div>
            <span>All features with no time restrictions</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
