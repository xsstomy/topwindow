import { generatePageMetadata } from '@/lib/page-metadata';
import {
  Monitor,
  Cpu,
  HardDrive,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import Footer from '@/components/Footer';

export const metadata = generatePageMetadata('requirements');

const macOSVersions = [
  {
    version: 'macOS 15 Sequoia',
    status: 'supported',
    note: 'Latest version - fully supported',
  },
  { version: 'macOS 14 Sonoma', status: 'supported', note: 'Fully supported' },
  {
    version: 'macOS 13 Ventura',
    status: 'supported',
    note: 'Minimum required version',
  },
  {
    version: 'macOS 12 Monterey',
    status: 'unsupported',
    note: 'Not supported - please upgrade',
  },
  {
    version: 'macOS 11 Big Sur',
    status: 'unsupported',
    note: 'Not supported - please upgrade',
  },
  {
    version: 'macOS 10.15 Catalina',
    status: 'unsupported',
    note: 'Not supported - please upgrade',
  },
];

const macModels = [
  {
    category: 'MacBook Air',
    models: [
      { name: 'MacBook Air (M3, 2024)', status: 'excellent' },
      { name: 'MacBook Air (M2, 2022)', status: 'excellent' },
      { name: 'MacBook Air (M1, 2020)', status: 'excellent' },
      { name: 'MacBook Air (Intel, 2018-2020)', status: 'good' },
    ],
  },
  {
    category: 'MacBook Pro',
    models: [
      { name: 'MacBook Pro 14/16-inch (M3, 2023)', status: 'excellent' },
      { name: 'MacBook Pro 14/16-inch (M2, 2023)', status: 'excellent' },
      { name: 'MacBook Pro 14/16-inch (M1, 2021)', status: 'excellent' },
      { name: 'MacBook Pro 13-inch (M2, 2022)', status: 'excellent' },
      { name: 'MacBook Pro 13-inch (M1, 2020)', status: 'excellent' },
      { name: 'MacBook Pro (Intel, 2016-2020)', status: 'good' },
    ],
  },
  {
    category: 'iMac',
    models: [
      { name: 'iMac 24-inch (M3, 2023)', status: 'excellent' },
      { name: 'iMac 24-inch (M1, 2021)', status: 'excellent' },
      { name: 'iMac 27-inch (Intel, 2019-2020)', status: 'good' },
      { name: 'iMac 21.5-inch (Intel, 2019)', status: 'good' },
    ],
  },
  {
    category: 'Mac mini',
    models: [
      { name: 'Mac mini (M2, 2023)', status: 'excellent' },
      { name: 'Mac mini (M1, 2020)', status: 'excellent' },
      { name: 'Mac mini (Intel, 2018-2020)', status: 'good' },
    ],
  },
  {
    category: 'Mac Studio',
    models: [
      { name: 'Mac Studio (M2, 2023)', status: 'excellent' },
      { name: 'Mac Studio (M1, 2022)', status: 'excellent' },
    ],
  },
  {
    category: 'Mac Pro',
    models: [
      { name: 'Mac Pro (M2, 2023)', status: 'excellent' },
      { name: 'Mac Pro (Intel, 2019)', status: 'good' },
    ],
  },
];

interface RequirementCardProps {
  icon: React.ComponentType<any>;
  title: string;
  items: Array<{
    label: string;
    value: string;
    status?: 'required' | 'recommended' | 'optimal';
  }>;
}

function RequirementCard({ icon: Icon, title, items }: RequirementCardProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'required':
        return 'text-red-600 bg-red-50';
      case 'recommended':
        return 'text-yellow-600 bg-yellow-50';
      case 'optimal':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className='bg-white border border-gray-200 rounded-xl p-8'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
          <Icon className='w-5 h-5 text-primary' />
        </div>
        <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
      </div>

      <div className='space-y-4'>
        {items.map((item, index) => (
          <div
            key={index}
            className='flex justify-between items-center p-3 rounded-lg bg-gray-50'
          >
            <span className='font-medium text-gray-900'>{item.label}</span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SystemRequirementsPage() {
  return (
    <main className='min-h-screen bg-white'>
      <div className='container-custom section-padding'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='heading-lg mb-4'>System Requirements</h1>
          <p className='text-body max-w-2xl mx-auto'>
            Check if your Mac is compatible with TopWindow and learn about the
            hardware requirements for optimal performance.
          </p>
        </div>

        <div className='max-w-6xl mx-auto'>
          {/* Quick Check */}
          <div className='bg-gradient-to-r from-primary/10 to-blue-50 rounded-xl p-8 mb-12'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4 text-center'>
              Quick Compatibility Check
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Monitor className='w-8 h-8 text-primary' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  macOS Version
                </h3>
                <p className='text-gray-600 text-sm'>
                  macOS 13.0 (Ventura) or later required
                </p>
              </div>
              <div className='text-center'>
                <div className='w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Cpu className='w-8 h-8 text-primary' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>Processor</h3>
                <p className='text-gray-600 text-sm'>
                  Intel or Apple Silicon Mac
                </p>
              </div>
              <div className='text-center'>
                <div className='w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <HardDrive className='w-8 h-8 text-primary' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>Storage</h3>
                <p className='text-gray-600 text-sm'>50 MB available space</p>
              </div>
            </div>
          </div>

          {/* Detailed Requirements */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
            {/* Minimum Requirements */}
            <RequirementCard
              icon={AlertCircle}
              title='Minimum Requirements'
              items={[
                {
                  label: 'Operating System',
                  value: 'macOS 13.0+',
                  status: 'required',
                },
                {
                  label: 'Processor',
                  value: 'Intel or Apple Silicon',
                  status: 'required',
                },
                { label: 'Memory (RAM)', value: '4 GB', status: 'required' },
                { label: 'Storage', value: '50 MB', status: 'required' },
                {
                  label: 'Permissions',
                  value: 'Accessibility Access',
                  status: 'required',
                },
              ]}
            />

            {/* Recommended Requirements */}
            <RequirementCard
              icon={CheckCircle}
              title='Recommended for Best Performance'
              items={[
                {
                  label: 'Operating System',
                  value: 'macOS 14.0+',
                  status: 'recommended',
                },
                {
                  label: 'Processor',
                  value: 'Apple Silicon (M1+)',
                  status: 'optimal',
                },
                {
                  label: 'Memory (RAM)',
                  value: '8 GB or more',
                  status: 'recommended',
                },
                {
                  label: 'Storage',
                  value: '100 MB free',
                  status: 'recommended',
                },
                {
                  label: 'Display',
                  value: 'Retina Display',
                  status: 'optimal',
                },
              ]}
            />
          </div>

          {/* macOS Version Compatibility */}
          <div className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-8 flex items-center gap-3'>
              <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
                <Monitor className='w-5 h-5 text-primary' />
              </div>
              macOS Version Compatibility
            </h2>

            <div className='bg-white border border-gray-200 rounded-xl overflow-hidden'>
              {macOSVersions.map((version, index) => (
                <div
                  key={index}
                  className={`p-6 flex items-center justify-between ${index !== macOSVersions.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  <div className='flex items-center gap-4'>
                    {version.status === 'supported' ? (
                      <CheckCircle className='w-6 h-6 text-green-500' />
                    ) : (
                      <AlertCircle className='w-6 h-6 text-red-500' />
                    )}
                    <div>
                      <h3 className='font-semibold text-gray-900'>
                        {version.version}
                      </h3>
                      <p className='text-gray-600 text-sm'>{version.note}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      version.status === 'supported'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {version.status === 'supported'
                      ? 'Supported'
                      : 'Not Supported'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mac Model Compatibility */}
          <div className='mb-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-8 flex items-center gap-3'>
              <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
                <Cpu className='w-5 h-5 text-primary' />
              </div>
              Mac Model Compatibility
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {macModels.map((category, categoryIndex) => (
                <div
                  key={categoryIndex}
                  className='bg-white border border-gray-200 rounded-xl p-6'
                >
                  <h3 className='font-semibold text-gray-900 mb-4'>
                    {category.category}
                  </h3>
                  <div className='space-y-3'>
                    {category.models.map((model, modelIndex) => (
                      <div
                        key={modelIndex}
                        className='flex items-center justify-between'
                      >
                        <span className='text-gray-700 text-sm'>
                          {model.name}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            model.status === 'excellent'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {model.status === 'excellent' ? 'Excellent' : 'Good'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Notes */}
          <div className='bg-white border border-gray-200 rounded-xl p-8 mb-12'>
            <h2 className='text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3'>
              <Info className='w-6 h-6 text-primary' />
              Performance Notes
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div>
                <h3 className='font-semibold text-gray-900 mb-3'>
                  Apple Silicon Macs (M1, M2, M3)
                </h3>
                <ul className='space-y-2 text-gray-600 text-sm'>
                  <li>• Exceptional performance and energy efficiency</li>
                  <li>• Instant window pinning with minimal system impact</li>
                  <li>• Optimized for Apple's unified memory architecture</li>
                  <li>• Best overall experience with TopWindow</li>
                </ul>
              </div>

              <div>
                <h3 className='font-semibold text-gray-900 mb-3'>Intel Macs</h3>
                <ul className='space-y-2 text-gray-600 text-sm'>
                  <li>• Full compatibility with all TopWindow features</li>
                  <li>
                    • Slightly higher memory usage compared to Apple Silicon
                  </li>
                  <li>• Works well on models from 2016 onwards</li>
                  <li>
                    • May require more system resources for optimal performance
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Accessibility Requirements */}
          <div className='bg-yellow-50 border border-yellow-200 rounded-xl p-8 mb-12'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Required Permissions
            </h2>
            <p className='text-gray-700 mb-4'>
              TopWindow requires the following system permissions to function
              properly:
            </p>
            <div className='space-y-3'>
              <div className='flex items-start gap-3'>
                <CheckCircle className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                <div>
                  <h3 className='font-semibold text-gray-900'>
                    Accessibility Access
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    Required to detect active windows and apply always-on-top
                    functionality. Granted in System Preferences → Privacy &
                    Security → Accessibility.
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-6 p-4 bg-white rounded-lg'>
              <p className='text-sm text-gray-700'>
                <strong>Privacy Note:</strong> TopWindow only uses these
                permissions for its core functionality and does not collect,
                store, or transmit any personal data.
              </p>
            </div>
          </div>

          {/* Help & Support */}
          <div className='bg-gradient-to-r from-primary/10 to-blue-50 rounded-xl p-8 text-center'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Need Help Checking Compatibility?
            </h2>
            <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
              Not sure if your Mac meets the requirements? Our support team can
              help you determine compatibility and optimize TopWindow for your
              system.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a href='mailto:xsstomy@gmail.com' className='btn-primary'>
                Contact Support
              </a>
              <a href='/faq' className='btn-secondary'>
                View FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
