'use client';

import { motion } from 'framer-motion';
import { Download, ArrowRight, Command } from 'lucide-react';
import DownloadButton from '@/components/DownloadButton';

export default function HeroSection() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section className='section-padding bg-gradient-to-br from-gray-light via-white to-blue-50'>
      <div className='container-custom'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
          {/* Left content */}
          <motion.div
            className='text-center lg:text-left'
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className='heading-lg mb-6'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Keep Any Window{' '}
              <span className='text-primary'>Always on Top</span> for macOS
            </motion.h1>

            <motion.p
              className='text-body mb-8 max-w-lg mx-auto lg:mx-0'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Professional mac window utility that fixes any window on top
              instantly. Pin and make any app window topmost with one click or{' '}
              <span className='inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md font-mono text-sm'>
                <Command size={12} />
                ⌥⌘P
              </span>{' '}
              keyboard shortcut. Perfect for multitasking and productivity.
            </motion.p>

            <motion.div
              className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <DownloadButton
                variant='primary'
                size='lg'
                platform='macos'
                className='inline-flex items-center gap-2 text-lg'
              />

              <button
                onClick={scrollToFeatures}
                className='btn-secondary inline-flex items-center gap-2 text-lg'
              >
                Learn More
                <ArrowRight size={18} />
              </button>
            </motion.div>

            <motion.div
              className='mt-6 text-sm text-gray-secondary'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Free Download • macOS 13.0+ • Intel & Apple Silicon Compatible
            </motion.div>
          </motion.div>

          {/* Right demo area */}
          <motion.div
            className='relative'
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Window demo container */}
            <div className='relative max-w-lg mx-auto'>
              {/* Background window (Xcode) */}
              <motion.div
                className='absolute inset-0 bg-gray-800 rounded-lg shadow-2xl transform rotate-2'
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className='h-8 bg-gray-700 rounded-t-lg flex items-center px-4'>
                  <div className='flex gap-2'>
                    <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                    <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                    <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                  </div>
                  <div className='flex-1 text-center'>
                    <span className='text-gray-300 text-sm'>Xcode</span>
                  </div>
                </div>
                <div className='p-6 h-64 bg-gray-800 rounded-b-lg'>
                  <div className='space-y-2'>
                    <div className='h-3 bg-gray-600 rounded w-3/4'></div>
                    <div className='h-3 bg-gray-600 rounded w-1/2'></div>
                    <div className='h-3 bg-gray-600 rounded w-2/3'></div>
                  </div>
                </div>
              </motion.div>

              {/* Foreground window (Safari - Always on top) */}
              <motion.div
                className='relative z-10 bg-white rounded-lg shadow-2xl transform -rotate-1 border border-gray-200'
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className='h-12 bg-gray-100 rounded-t-lg flex items-center px-4 border-b border-gray-200'>
                  <div className='flex gap-2'>
                    <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                    <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                    <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                  </div>
                  <div className='flex-1 text-center'>
                    <span className='text-gray-700 text-sm font-medium'>
                      Safari
                    </span>
                  </div>
                  {/* Always on top icon */}
                  <motion.div
                    className='absolute -top-3 -right-3 bg-primary text-white p-2 rounded-full shadow-lg'
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                    📌
                  </motion.div>
                </div>
                <div className='p-6 h-40 bg-white rounded-b-lg'>
                  <div className='space-y-3'>
                    <div className='h-4 bg-blue-100 rounded w-full'></div>
                    <div className='h-4 bg-gray-100 rounded w-4/5'></div>
                    <div className='h-4 bg-gray-100 rounded w-3/4'></div>
                    <div className='h-4 bg-gray-100 rounded w-2/3'></div>
                  </div>
                </div>
              </motion.div>

              {/* Keyboard shortcut hint */}
              <motion.div
                className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
              >
                <span className='text-sm font-medium flex items-center gap-2'>
                  <Command size={14} />
                  ⌥⌘P to pin
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
