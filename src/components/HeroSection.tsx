'use client';

import { motion } from 'framer-motion';
import {
  Download,
  ArrowRight,
  Command,
  Play,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import DownloadButton from '@/components/DownloadButton';

export default function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

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

          {/* Right demo area - Video Demo */}
          <motion.div
            className='relative'
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className='relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-lg mx-auto'>
              {/* Video Player */}
              <div className='aspect-video bg-black relative'>
                <video
                  className='w-full h-full object-cover'
                  controls
                  preload='metadata'
                  poster='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMUYyOTM3Ii8+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjIyNSIgcj0iNDAiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuOSIvPgo8cGF0aCBkPSJNMzg1IDIwNUw0MjUgMjI1TDM4NSAyNDVWMjA1WiIgZmlsbD0iIzFGMjkzNyIvPgo8L3N2Zz4K'
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onLoadStart={() => {
                    setIsLoading(true);
                    setHasError(false);
                  }}
                  onCanPlay={() => {
                    setIsLoading(false);
                    setHasError(false);
                  }}
                  onLoadedData={() => {
                    setIsLoading(false);
                    setHasError(false);
                  }}
                  onError={e => {
                    console.error('Video loading error:', e);
                    setHasError(true);
                    setIsLoading(false);
                  }}
                >
                  <source src='/multipin.mp4' type='video/mp4' />
                  Your browser does not support the video tag.
                </video>

                {/* Loading State */}
                {isLoading && (
                  <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
                    <div className='flex flex-col items-center gap-3'>
                      <Loader2 className='w-8 h-8 text-white animate-spin' />
                      <span className='text-white text-sm'>
                        Loading video...
                      </span>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {hasError && (
                  <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
                    <div className='flex flex-col items-center gap-3'>
                      <AlertCircle className='w-8 h-8 text-red-400' />
                      <span className='text-white text-sm'>
                        Video failed to load
                      </span>
                      <button
                        className='px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors'
                        onClick={() => {
                          setHasError(false);
                          setIsLoading(true);
                          const video = document.querySelector(
                            'video'
                          ) as HTMLVideoElement;
                          if (video) video.load();
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}

                {/* Custom Play Button Overlay */}
                {!isPlaying && !isLoading && !hasError && (
                  <motion.div
                    className='absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm cursor-pointer'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const video = document.querySelector(
                        'video'
                      ) as HTMLVideoElement;
                      if (video) video.play();
                    }}
                  >
                    <div className='w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl hover:bg-primary-dark transition-colors'>
                      <Play
                        className='w-8 h-8 text-white ml-1'
                        fill='currentColor'
                      />
                    </div>
                  </motion.div>
                )}

                {/* Video Title */}
                <motion.div
                  className='absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Multi-Pin Demo
                </motion.div>
              </div>

              {/* Video Information */}
              <div className='p-4 bg-white border-t border-gray-100'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-semibold text-gray-text'>
                      TopWindow in Action
                    </h3>
                    <p className='text-sm text-gray-secondary'>
                      Pin multiple windows simultaneously
                    </p>
                  </div>
                  <div className='text-sm text-gray-secondary'>Live Demo</div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className='absolute -top-6 -left-6 w-12 h-12 bg-primary/10 rounded-full'></div>
            <div className='absolute -bottom-8 -right-8 w-20 h-20 bg-blue-100 rounded-full'></div>

            {/* Keyboard shortcut hint */}
            <motion.div
              className='absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              <span className='text-sm font-medium flex items-center gap-2'>
                <Command size={14} />
                ⌥⌘P to pin any window
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
