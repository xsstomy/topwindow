import { generatePageMetadata } from '@/lib/page-metadata';
import { Calendar, Download, Star, Bug, Zap, Shield, Plus } from 'lucide-react';

export const metadata = generatePageMetadata('releases');

const releases = [
  {
    version: '2.1.0',
    date: '2025-01-15',
    type: 'major',
    downloadUrl: '#download-placeholder',
    size: '15.2 MB',
    features: [
      'Universal Binary support for Apple Silicon and Intel Macs',
      'Improved window detection performance by 40%',
      'New visual indicator for pinned windows',
      'Enhanced menu bar interface with quick actions',
      'macOS Sequoia (15.0) full compatibility',
    ],
    improvements: [
      'Reduced memory usage by 25%',
      'Faster app startup time',
      'Better handling of system permissions',
      'Improved accessibility support',
    ],
    bugFixes: [
      'Fixed issue with some windows not staying pinned',
      'Resolved crash when unpinning windows quickly',
      'Fixed menu bar icon disappearing on some systems',
      'Corrected keyboard shortcut conflicts with other apps',
    ],
  },
  {
    version: '2.0.3',
    date: '2024-12-10',
    type: 'patch',
    downloadUrl: '#download-placeholder-old',
    size: '14.8 MB',
    features: [],
    improvements: [
      'Better compatibility with macOS Sonoma',
      'Enhanced window tracking accuracy',
      'Optimized for low-power mode',
    ],
    bugFixes: [
      'Fixed issue with Finder windows not pinning correctly',
      'Resolved memory leak in background monitoring',
      'Fixed preferences not saving properly in some cases',
    ],
  },
  {
    version: '2.0.2',
    date: '2024-11-25',
    type: 'patch',
    downloadUrl: '#download-placeholder-old',
    size: '14.5 MB',
    features: [],
    improvements: [
      'Improved detection of full-screen applications',
      'Better error handling and user feedback',
    ],
    bugFixes: [
      'Fixed crash when using multiple monitors',
      'Resolved issue with Safari windows',
      'Fixed keyboard shortcuts not working after sleep mode',
    ],
  },
  {
    version: '2.0.1',
    date: '2024-11-05',
    type: 'patch',
    downloadUrl: '#download-placeholder-old',
    size: '14.3 MB',
    features: [],
    improvements: [
      'Enhanced stability and performance',
      'Better integration with system accessibility features',
    ],
    bugFixes: [
      'Fixed issue preventing TopWindow from launching on some Macs',
      'Resolved compatibility issues with certain third-party applications',
      'Fixed menu bar icon not appearing consistently',
    ],
  },
  {
    version: '2.0.0',
    date: '2024-10-15',
    type: 'major',
    downloadUrl: '#download-placeholder-old',
    size: '14.0 MB',
    features: [
      'Complete rewrite for better performance and reliability',
      'New modern interface design',
      'Support for multiple pinned windows management',
      'Customizable keyboard shortcuts',
      'Enhanced preferences panel',
      'Dark mode support',
    ],
    improvements: [
      '50% faster window pinning/unpinning',
      'Significantly reduced CPU usage',
      'Better compatibility with macOS Ventura and Sonoma',
      'Improved error handling and user experience',
    ],
    bugFixes: [
      'Fixed numerous stability issues from v1.x',
      'Resolved window detection problems',
      'Fixed memory leaks and performance issues',
    ],
  },
  {
    version: '1.2.5',
    date: '2024-08-20',
    type: 'patch',
    downloadUrl: '#download-placeholder-legacy',
    size: '12.8 MB',
    features: [],
    improvements: [
      'Final improvements to the legacy 1.x branch',
      'Preparation for 2.0 migration',
    ],
    bugFixes: [
      'Last round of critical bug fixes for 1.x users',
      'Improved compatibility before 2.0 upgrade',
    ],
    note: 'This is the final version of the 1.x series. Please upgrade to 2.x for the latest features and support.',
  },
];

interface ReleaseCardProps {
  release: (typeof releases)[0];
}

function ReleaseCard({ release }: ReleaseCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major':
        return 'bg-blue-100 text-blue-800';
      case 'minor':
        return 'bg-green-100 text-green-800';
      case 'patch':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isLatest = release.version === releases[0].version;

  return (
    <div
      className={`bg-white border rounded-xl p-8 ${isLatest ? 'border-primary shadow-lg' : 'border-gray-200'}`}
    >
      {isLatest && (
        <div className='flex items-center gap-2 mb-4'>
          <Star className='w-5 h-5 text-yellow-500 fill-current' />
          <span className='text-sm font-medium text-primary'>
            Latest Release
          </span>
        </div>
      )}

      {/* Header */}
      <div className='flex items-start justify-between mb-6'>
        <div>
          <div className='flex items-center gap-3 mb-2'>
            <h2 className='text-2xl font-semibold text-gray-900'>
              Version {release.version}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(release.type)}`}
            >
              {release.type.charAt(0).toUpperCase() + release.type.slice(1)}
            </span>
          </div>

          <div className='flex items-center gap-4 text-gray-600 text-sm'>
            <span className='flex items-center gap-1'>
              <Calendar className='w-4 h-4' />
              {new Date(release.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span>{release.size}</span>
          </div>
        </div>

        <a
          href={release.downloadUrl}
          className={`btn-${isLatest ? 'primary' : 'secondary'} flex items-center gap-2`}
        >
          <Download className='w-4 h-4' />
          Download
        </a>
      </div>

      {release.note && (
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
          <p className='text-yellow-800 text-sm'>{release.note}</p>
        </div>
      )}

      {/* Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* New Features */}
        {release.features.length > 0 && (
          <div>
            <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
              <Plus className='w-5 h-5 text-green-500' />
              New Features
            </h3>
            <ul className='space-y-2'>
              {release.features.map((feature, index) => (
                <li
                  key={index}
                  className='text-gray-700 text-sm flex items-start gap-2'
                >
                  <span className='w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0'></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {release.improvements.length > 0 && (
          <div>
            <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
              <Zap className='w-5 h-5 text-blue-500' />
              Improvements
            </h3>
            <ul className='space-y-2'>
              {release.improvements.map((improvement, index) => (
                <li
                  key={index}
                  className='text-gray-700 text-sm flex items-start gap-2'
                >
                  <span className='w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0'></span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bug Fixes */}
        {release.bugFixes.length > 0 && (
          <div>
            <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
              <Bug className='w-5 h-5 text-red-500' />
              Bug Fixes
            </h3>
            <ul className='space-y-2'>
              {release.bugFixes.map((fix, index) => (
                <li
                  key={index}
                  className='text-gray-700 text-sm flex items-start gap-2'
                >
                  <span className='w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0'></span>
                  {fix}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReleasesPage() {
  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='container-custom section-padding'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='heading-lg mb-4'>Release Notes</h1>
          <p className='text-body max-w-2xl mx-auto'>
            Stay up to date with the latest TopWindow features, improvements,
            and bug fixes. We're constantly working to make TopWindow better for
            you.
          </p>
        </div>

        {/* Current Version Highlight */}
        <div className='bg-gradient-to-r from-primary/10 to-blue-50 rounded-xl p-8 mb-12 text-center'>
          <div className='flex items-center justify-center gap-2 mb-4'>
            <Shield className='w-6 h-6 text-primary' />
            <h2 className='text-xl font-semibold text-gray-900'>
              Current Stable Version
            </h2>
          </div>
          <p className='text-3xl font-bold text-primary mb-2'>
            v{releases[0].version}
          </p>
          <p className='text-gray-600 mb-6'>
            Released on{' '}
            {new Date(releases[0].date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <a href={releases[0].downloadUrl} className='btn-primary'>
              <Download className='w-5 h-5' />
              Download Latest Version
            </a>
            <a href='/requirements' className='btn-secondary'>
              Check Requirements
            </a>
          </div>
        </div>

        {/* Release History */}
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-8'>
            Version History
          </h2>

          <div className='space-y-8'>
            {releases.map((release, index) => (
              <ReleaseCard key={release.version} release={release} />
            ))}
          </div>

          {/* Upgrade Notice */}
          <div className='mt-16 bg-white border border-gray-200 rounded-xl p-8 text-center'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Upgrading from Older Versions
            </h2>
            <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
              If you're using TopWindow v1.x, we strongly recommend upgrading to
              the latest 2.x version for better performance, stability, and new
              features. The upgrade process is seamless and your preferences
              will be preserved.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a href='#download' className='btn-primary'>
                Download Latest Version
              </a>
              <a href='/docs' className='btn-secondary'>
                View Upgrade Guide
              </a>
            </div>
          </div>

          {/* Beta Program */}
          <div className='mt-12 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-8'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4 text-center'>
              Join the Beta Program
            </h2>
            <p className='text-gray-600 mb-6 text-center max-w-2xl mx-auto'>
              Want to try new features before they're officially released? Join
              our beta program to get early access to upcoming features and help
              shape the future of TopWindow.
            </p>
            <div className='text-center'>
              <a
                href='mailto:xsstomy@gmail.com?subject=Beta%20Program%20Interest'
                className='btn-primary'
              >
                Join Beta Program
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
