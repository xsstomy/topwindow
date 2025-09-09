import type { Metadata } from 'next';
import {
  ArrowLeft,
  ArrowRight,
  Monitor,
  Keyboard,
  Zap,
  Camera,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'TopWindow Features - Powerful macOS Window Management',
  description:
    'Discover all TopWindow features: always-on-top windows, customizable hotkeys, lightweight design, and ScreenCaptureKit integration for efficient macOS productivity.',
  keywords: [
    'TopWindow features',
    'macOS window management',
    'always on top mac',
    'window pinning macOS',
    'custom hotkeys mac',
    'lightweight window manager',
    'ScreenCaptureKit',
    'macOS productivity tools',
  ],
  openGraph: {
    title: 'TopWindow Features - Complete macOS Window Management',
    description:
      "Explore TopWindow's powerful features designed to enhance your macOS productivity and workflow.",
    type: 'article',
  },
};

const features = [
  {
    id: 'always-on-top',
    title: 'Always on Top',
    description:
      'Keep any window always on top on Mac (macOS). Pin or float windows above others with one click. Perfect for multitasking and reference materials.',
    icon: Monitor,
    color: 'blue',
    href: '/features/always-on-top',
    highlights: [
      'Works with any macOS app',
      'Instant pin/unpin toggle',
      'Visual indicators',
    ],
  },
  {
    id: 'hotkeys',
    title: 'Custom Hotkeys',
    description:
      'Lightning-fast keyboard shortcuts for window management. Fully customizable with conflict detection.',
    icon: Keyboard,
    color: 'purple',
    href: '/features/hotkeys',
    highlights: [
      'Default ⌥⌘P shortcut',
      'Fully customizable',
      'System-wide access',
    ],
  },
  {
    id: 'lightweight',
    title: 'Lightweight Design',
    description:
      'Minimal resource usage with maximum functionality. Native macOS integration without bloat.',
    icon: Zap,
    color: 'green',
    href: '/features/lightweight',
    highlights: [
      'Native performance',
      'Low memory footprint',
      'Battery friendly',
    ],
  },
  {
    id: 'screencapturekit',
    title: 'ScreenCaptureKit',
    description:
      "Advanced window detection using Apple's latest ScreenCaptureKit API for reliable window management.",
    icon: Camera,
    color: 'orange',
    href: '/features/screencapturekit',
    highlights: [
      'Apple latest technology',
      'Precise window detection',
      'Future-proof design',
    ],
  },
];

const colorClasses = {
  blue: {
    gradient: 'from-blue-50 to-blue-100',
    icon: 'bg-blue-100 text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    accent: 'text-blue-600',
  },
  purple: {
    gradient: 'from-purple-50 to-purple-100',
    icon: 'bg-purple-100 text-purple-600',
    button: 'bg-purple-600 hover:bg-purple-700 text-white',
    accent: 'text-purple-600',
  },
  green: {
    gradient: 'from-green-50 to-green-100',
    icon: 'bg-green-100 text-green-600',
    button: 'bg-green-600 hover:bg-green-700 text-white',
    accent: 'text-green-600',
  },
  orange: {
    gradient: 'from-orange-50 to-orange-100',
    icon: 'bg-orange-100 text-orange-600',
    button: 'bg-orange-600 hover:bg-orange-700 text-white',
    accent: 'text-orange-600',
  },
};

export default function FeaturesPage() {
  return (
    <main className='min-h-screen bg-white'>
      {/* Navigation */}
      <div className='bg-gray-50 border-b border-gray-200'>
        <div className='container mx-auto px-4 py-4'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors'
          >
            <ArrowLeft size={20} />
            Back to TopWindow
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className='py-20 bg-gradient-to-br from-gray-50 to-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
              TopWindow Features for{' '}
              <span className='text-primary'>Always on Top</span> on Mac
            </h1>

            <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
              TopWindow combines native macOS integration with advanced window
              controls to keep a window always on top on Mac. Discover features
              that help you pin, keep, or float windows for effortless workflows.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href='/download'
                className='inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium'
              >
                <CheckCircle size={20} />
                Try All Features Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='grid lg:grid-cols-2 gap-8'>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const colors = colorClasses[
                  feature.color as keyof typeof colorClasses
                ];

                return (
                  <div
                    key={feature.id}
                    className={`bg-gradient-to-br ${colors.gradient} p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div className='flex items-start gap-6'>
                      <div
                        className={`w-16 h-16 ${colors.icon} rounded-2xl flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon size={28} />
                      </div>

                      <div className='flex-1'>
                        <h3 className='text-2xl font-bold text-gray-900 mb-3'>
                          {feature.title}
                        </h3>

                        <p className='text-gray-600 mb-6 leading-relaxed'>
                          {feature.description}
                        </p>

                        <div className='space-y-3 mb-6'>
                          {feature.highlights.map((highlight, idx) => (
                            <div key={idx} className='flex items-center gap-3'>
                              <div className='w-2 h-2 bg-gray-400 rounded-full'></div>
                              <span className='text-gray-700 text-sm'>
                                {highlight}
                              </span>
                            </div>
                          ))}
                        </div>

                        <Link
                          href={feature.href}
                          className={`inline-flex items-center gap-2 ${colors.button} px-6 py-3 rounded-lg font-medium transition-colors`}
                        >
                          Learn More
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Benefits */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Why Choose TopWindow for Always‑on‑Top
            </h2>

            <div className='grid md:grid-cols-3 gap-8'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <span className='text-2xl'>🚀</span>
                </div>
                <h3 className='text-xl font-semibold mb-4'>
                  Native Performance
                </h3>
                <p className='text-gray-600'>
                  Built specifically for macOS using native APIs. No Electron,
                  no Java - just pure Swift performance.
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <span className='text-2xl'>⚡</span>
                </div>
                <h3 className='text-xl font-semibold mb-4'>Instant Response</h3>
                <p className='text-gray-600'>
                  Window management happens instantly with no lag or delay. Your
                  workflow stays uninterrupted.
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <span className='text-2xl'>🛡️</span>
                </div>
                <h3 className='text-xl font-semibold mb-4'>Privacy First</h3>
                <p className='text-gray-600'>
                  No data collection, no analytics, no tracking. Your window
                  management stays completely private.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Examples */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Always‑on‑Top Works with Your Favorite Apps
            </h2>

            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center'>
                <div className='w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center'>
                  <span className='text-2xl'>🌐</span>
                </div>
                <h3 className='font-semibold mb-2'>Web Browsers</h3>
                <p className='text-sm text-gray-600'>
                  Safari, Chrome, Firefox, Edge
                </p>
              </div>

              <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center'>
                <div className='w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center'>
                  <span className='text-2xl'>💻</span>
                </div>
                <h3 className='font-semibold mb-2'>Development</h3>
                <p className='text-sm text-gray-600'>
                  VS Code, Xcode, Terminal
                </p>
              </div>

              <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center'>
                <div className='w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center'>
                  <span className='text-2xl'>📊</span>
                </div>
                <h3 className='font-semibold mb-2'>Productivity</h3>
                <p className='text-sm text-gray-600'>Excel, Numbers, Notion</p>
              </div>

              <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center'>
                <div className='w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center'>
                  <span className='text-2xl'>🎥</span>
                </div>
                <h3 className='font-semibold mb-2'>Communication</h3>
                <p className='text-sm text-gray-600'>Zoom, Teams, Slack</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-gradient-to-br from-primary/5 to-purple-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-2xl mx-auto text-center'>
            <h2 className='text-3xl font-bold mb-4'>
              Ready for Always‑on‑Top on Mac?
            </h2>
            <p className='text-gray-600 mb-8'>
              Experience all TopWindow features with our free trial. No credit
              card required.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href='/download'
                className='inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary-dark transition-colors font-medium text-lg'
              >
                Download TopWindow
              </Link>

              <Link
                href='/faq'
                className='inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg'
              >
                Have Questions?
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
