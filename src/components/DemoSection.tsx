'use client';

import { motion } from 'framer-motion';
import {
  Play,
  MousePointer2,
  Command,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

const steps = [
  {
    number: '01',
    title: 'Select the window you want to pin',
    description: 'Click on any application window to make it active.',
    icon: MousePointer2,
  },
  {
    number: '02',
    title: 'Press ⌥⌘P or click "Pin Current Window" in menu bar',
    description:
      'Use the keyboard shortcut or access the menu bar for one-click pinning.',
    icon: Command,
  },
  {
    number: '03',
    title: 'Done — your window stays on top',
    description: 'The window will remain visible above all other applications.',
    icon: Check,
  },
];

export default function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <section className='section-padding bg-gradient-to-br from-gray-light to-blue-50'>
      <div className='container-custom'>
        {/* Title Section */}
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className='heading-md mb-4'>See Always‑on‑Top in Action</h2>
          <p className='text-body max-w-2xl mx-auto'>
            TopWindow makes window management effortless. Watch how simple it is
            to keep any window always on top on Mac.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          {/* Left: Demo Video Area */}
          <motion.div
            className='relative'
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className='relative bg-white rounded-2xl shadow-2xl overflow-hidden'>
              {/* Actual Video Player */}
              <div className='aspect-video bg-black relative'>
                <video
                  className='w-full h-full object-cover'
                  controls
                  preload='none'
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
                  onError={e => {
                    console.error('Video loading error:', e);
                    setHasError(true);
                    setIsLoading(false);
                  }}
                >
                  <source src='/action.mp4' type='video/mp4' />
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

                {/* Video Loading State */}
                <motion.div
                  className='absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  TopWindow Demo
                </motion.div>
              </div>

              {/* Video Information */}
              <div className='p-4 bg-white border-t border-gray-100'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-semibold text-gray-text'>
                      How to Use TopWindow
                    </h3>
                    <p className='text-sm text-gray-secondary'>
                      Real usage demonstration
                    </p>
                  </div>
                  <div className='text-sm text-gray-secondary'>
                    Video Tutorial
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className='absolute -top-6 -left-6 w-12 h-12 bg-primary/10 rounded-full'></div>
            <div className='absolute -bottom-8 -right-8 w-20 h-20 bg-blue-100 rounded-full'></div>
          </motion.div>

          {/* Right: Operation Steps */}
          <motion.div
            className='space-y-8'
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className='flex gap-6 items-start'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {/* Step Number */}
                <div className='flex-shrink-0'>
                  <div className='w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold'>
                    {step.number}
                  </div>
                </div>

                {/* Step Content */}
                <div className='flex-1'>
                  <div className='flex items-start gap-3 mb-3'>
                    <step.icon className='w-6 h-6 text-primary mt-1 flex-shrink-0' />
                    <h3 className='text-xl font-semibold text-gray-text leading-tight'>
                      {step.title}
                    </h3>
                  </div>
                  <p className='text-gray-secondary leading-relaxed'>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Bottom Hint */}
            <motion.div
              className='mt-12 p-6 bg-white rounded-2xl border border-primary/20 shadow-lg'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                  <Check className='w-5 h-5 text-green-600' />
                </div>
                <div>
                  <p className='font-semibold text-gray-text'>That's it!</p>
                  <p className='text-sm text-gray-secondary'>
                    No complex setup, no learning curve. Just instant
                    productivity.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
