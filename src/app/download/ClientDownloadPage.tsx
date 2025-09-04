'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  CheckCircle,
  Monitor,
  HardDrive,
  Cpu,
  Shield,
  Clock,
  FileText,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import DownloadButton from '@/components/DownloadButton';
import Breadcrumbs from '@/components/Breadcrumbs';
import { downloadService, type VersionInfo } from '@/lib/download-service';

export default function ClientDownloadPage() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVersionInfo = async () => {
      try {
        const info = await downloadService.getLatestVersion();
        setVersionInfo(info);
      } catch (err) {
        console.error('Failed to load version info:', err);
        setError('Failed to load version information');
      } finally {
        setIsLoading(false);
      }
    };

    loadVersionInfo();
  }, []);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading download information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='container-custom'>
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Download' }]} className='mb-8' />

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-12'
        >
          <h1 className='heading-lg mb-4'>Download TopWindow</h1>
          <p className='text-body text-xl max-w-2xl mx-auto'>
            Get started with TopWindow today. Professional window management for
            macOS.
          </p>

          {versionInfo && (
            <div className='mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-800'>
              <Clock className='w-4 h-4' />
              <span className='text-sm font-medium'>
                Latest Version: {versionInfo.version} • Released{' '}
                {new Date(versionInfo.releaseDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12'>
          {/* Main Download Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='lg:col-span-2 space-y-8'
          >
            {/* Primary Download Card */}
            <div className='bg-white rounded-xl p-8 shadow-lg border border-gray-100'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center'>
                  <Download className='w-8 h-8 text-white' />
                </div>
                <div>
                  <h2 className='text-2xl font-semibold text-gray-900'>
                    TopWindow
                  </h2>
                  <p className='text-gray-600'>
                    Professional Window Management
                  </p>
                  {versionInfo && (
                    <p className='text-sm text-primary font-medium'>
                      Version {versionInfo.version}
                    </p>
                  )}
                </div>
              </div>

              {/* Auto-detected download */}
              <div className='mb-6'>
                <DownloadButton
                  variant='primary'
                  size='lg'
                  className='w-full'
                  showSystemInfo={true}
                  showVersion={true}
                />
              </div>

              {/* Alternative Downloads */}
              <div className='border-t pt-6'>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  macOS Download
                </h3>
                <div className='max-w-sm'>
                  {/* macOS Download */}
                  <div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
                    <div className='flex items-center gap-3 mb-3'>
                      <Monitor className='w-5 h-5 text-gray-600' />
                      <span className='font-medium text-gray-900'>macOS</span>
                    </div>
                    <DownloadButton
                      platform='macos'
                      variant='outline'
                      size='sm'
                      className='w-full'
                    >
                      Download DMG
                    </DownloadButton>
                    {versionInfo?.builds.macos && (
                      <p className='text-xs text-gray-500 mt-2'>
                        {versionInfo.builds.macos.size} • Universal Binary
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Release Notes */}
            {versionInfo && (
              <div className='bg-white rounded-xl p-8 shadow-lg border border-gray-100'>
                <div className='flex items-center gap-3 mb-6'>
                  <FileText className='w-6 h-6 text-primary' />
                  <h3 className='text-xl font-semibold text-gray-900'>
                    What's New in {versionInfo.version}
                  </h3>
                </div>
                <div className='space-y-3'>
                  {versionInfo.changelog.map((item, index) => (
                    <div key={index} className='flex items-start gap-3'>
                      <CheckCircle className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                      <span className='text-gray-700'>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='space-y-6'
          >
            {/* System Requirements */}
            <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-100'>
              <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                <Monitor className='w-5 h-5' />
                System Requirements
              </h3>

              <div className='space-y-4'>
                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>macOS</h4>
                  <div className='space-y-2 text-sm text-gray-700'>
                    <div className='flex items-center gap-2'>
                      <CheckCircle className='w-4 h-4 text-green-500' />
                      <span>macOS 13.0 (Ventura) or later</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Cpu className='w-4 h-4 text-blue-500' />
                      <span>Intel or Apple Silicon Mac</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <HardDrive className='w-4 h-4 text-purple-500' />
                      <span>50 MB available storage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-100'>
              <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                <Shield className='w-5 h-5' />
                Security & Privacy
              </h3>

              <div className='space-y-3 text-sm text-gray-700'>
                <div className='flex items-start gap-2'>
                  <CheckCircle className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                  <span>Code signed and notarized by Apple</span>
                </div>
                <div className='flex items-start gap-2'>
                  <CheckCircle className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                  <span>No data collection or tracking</span>
                </div>
                <div className='flex items-start gap-2'>
                  <CheckCircle className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                  <span>Open source and transparent</span>
                </div>
                <div className='flex items-start gap-2'>
                  <CheckCircle className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                  <span>Regular security updates</span>
                </div>
              </div>
            </div>

            {/* Installation Guide */}
            <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-100'>
              <h3 className='font-semibold text-gray-900 mb-4'>
                Quick Installation
              </h3>

              <div className='space-y-4'>
                <div className='flex gap-3'>
                  <div className='w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0'>
                    1
                  </div>
                  <span className='text-sm text-gray-700'>
                    Download and open the installer
                  </span>
                </div>
                <div className='flex gap-3'>
                  <div className='w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0'>
                    2
                  </div>
                  <span className='text-sm text-gray-700'>
                    Follow the installation wizard
                  </span>
                </div>
                <div className='flex gap-3'>
                  <div className='w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0'>
                    3
                  </div>
                  <span className='text-sm text-gray-700'>
                    Grant accessibility permissions
                  </span>
                </div>
                <div className='flex gap-3'>
                  <div className='w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0'>
                    4
                  </div>
                  <span className='text-sm text-gray-700'>
                    Start managing your windows!
                  </span>
                </div>
              </div>

              <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                <div className='flex items-start gap-2'>
                  <AlertTriangle className='w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5' />
                  <div className='text-sm text-blue-800'>
                    <p className='font-medium mb-1'>Need help?</p>
                    <p>
                      Check our{' '}
                      <a
                        href='/docs'
                        className='text-primary hover:underline font-medium'
                      >
                        documentation
                      </a>{' '}
                      or{' '}
                      <a
                        href='/faq'
                        className='text-primary hover:underline font-medium'
                      >
                        FAQ
                      </a>{' '}
                      for detailed installation guides.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Links */}
            <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-100'>
              <h3 className='font-semibold text-gray-900 mb-4'>
                More Information
              </h3>

              <div className='space-y-3'>
                <a
                  href='/releases'
                  className='flex items-center gap-2 text-primary hover:text-blue-600 text-sm font-medium'
                >
                  <FileText className='w-4 h-4' />
                  View All Releases
                  <ExternalLink className='w-3 h-3' />
                </a>
                <a
                  href='/requirements'
                  className='flex items-center gap-2 text-primary hover:text-blue-600 text-sm font-medium'
                >
                  <Monitor className='w-4 h-4' />
                  System Requirements
                  <ExternalLink className='w-3 h-3' />
                </a>
                <a
                  href='/docs'
                  className='flex items-center gap-2 text-primary hover:text-blue-600 text-sm font-medium'
                >
                  <FileText className='w-4 h-4' />
                  Documentation
                  <ExternalLink className='w-3 h-3' />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'
          >
            <AlertTriangle className='w-8 h-8 text-red-500 mx-auto mb-2' />
            <p className='text-red-800 font-medium mb-2'>
              Unable to load download information
            </p>
            <p className='text-red-600 text-sm'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors'
            >
              Try Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
