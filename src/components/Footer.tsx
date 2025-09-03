'use client';

import { motion } from 'framer-motion';
import { Mail, Twitter, ExternalLink, Heart } from 'lucide-react';
import { useEffect } from 'react';
import { logBuildInfo } from '@/lib/build-info';
import { useBuildInfo } from '@/hooks/useBuildInfo';

const footerLinks = {
  product: [
    { name: 'Download', href: '/download' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Release Notes', href: '/releases' },
  ],
  support: [
    { name: 'Documentation', href: '/docs' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact Support', href: 'mailto:xsstomy@gmail.com' },
    { name: 'System Requirements', href: '/requirements' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'License Agreement', href: '/license' },
    { name: 'Refund Policy', href: '/refunds' },
  ],
  social: [
    { name: 'Twitter', href: 'https://twitter.com/topwindow', icon: Twitter },
    {
      name: 'Product Hunt',
      href: 'https://producthunt.com/posts/topwindow',
      icon: ExternalLink,
    },
    {
      name: 'Reddit',
      href: 'https://reddit.com/r/topwindow',
      icon: ExternalLink,
    },
  ],
};

export default function Footer() {
  // Use the build info hook to get version
  const { displayVersion } = useBuildInfo();

  // Log build info to console when component mounts
  useEffect(() => {
    logBuildInfo();
  }, []);

  return (
    <footer className='bg-gray-900 text-gray-300'>
      {/* Main content area */}
      <div className='section-padding border-b border-gray-800'>
        <div className='container-custom'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8'>
            {/* Brand information */}
            <motion.div
              className='lg:col-span-2'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className='mb-6'>
                <h3 className='text-2xl font-bold text-white mb-3'>
                  TopWindow
                </h3>
                <p className='text-gray-400 leading-relaxed max-w-md'>
                  The ultimate window management tool for macOS. Keep any window
                  always on top with simple shortcuts and intuitive controls.
                </p>
              </div>

              {/* Contact information */}
              <div className='space-y-3'>
                <a
                  href='mailto:xsstomy@gmail.com'
                  className='flex items-center gap-3 text-gray-300 hover:text-primary transition-colors'
                >
                  <Mail className='w-5 h-5' />
                  <span>xsstomy@gmail.com</span>
                </a>

                {/* Social links */}
                <div className='flex gap-4 pt-2'>
                  {footerLinks.social.map(link => (
                    <a
                      key={link.name}
                      href={link.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-all duration-300 transform hover:scale-110'
                      title={link.name}
                    >
                      <link.icon className='w-5 h-5' />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Product links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className='text-white font-semibold mb-6'>Product</h4>
              <ul className='space-y-4'>
                {footerLinks.product.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className='text-gray-400 hover:text-white transition-colors duration-300'
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className='text-white font-semibold mb-6'>Support</h4>
              <ul className='space-y-4'>
                {footerLinks.support.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className='text-gray-400 hover:text-white transition-colors duration-300'
                      target={
                        link.href.startsWith('mailto:') ||
                        link.href.startsWith('/')
                          ? undefined
                          : '_blank'
                      }
                      rel={
                        link.href.startsWith('mailto:') ||
                        link.href.startsWith('/')
                          ? undefined
                          : 'noopener noreferrer'
                      }
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className='text-white font-semibold mb-6'>Legal</h4>
              <ul className='space-y-4'>
                {footerLinks.legal.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className='text-gray-400 hover:text-white transition-colors duration-300'
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom copyright area */}
      <div className='py-8'>
        <div className='container-custom'>
          <motion.div
            className='flex flex-col md:flex-row justify-between items-center gap-4'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className='text-gray-400 text-sm text-center md:text-left'>
              © 2025 TopWindow. All rights reserved.
              {displayVersion && (
                <span className='ml-3 opacity-50'>{displayVersion}</span>
              )}
            </div>

            <div className='flex items-center gap-2 text-gray-400 text-sm'>
              <span>Made with</span>
              <Heart className='w-4 h-4 text-red-500' fill='currentColor' />
              <span>for macOS users</span>
            </div>

            <div className='text-gray-400 text-sm text-center md:text-right'>
              <span>macOS 13.0+ • Universal Binary</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
