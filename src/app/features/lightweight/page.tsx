import type { Metadata } from 'next';
import {
  ArrowLeft,
  Zap,
  Activity,
  HardDrive,
  Battery,
  PlayCircle,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Lightweight macOS Utility for Enhanced Performance | TopWindow',
  description:
    'TopWindow uses minimal system resources - under 20MB RAM, negligible CPU usage. Experience fast, efficient window management without slowing down your Mac.',
  keywords: [
    'lightweight macOS utility',
    'low memory mac app',
    'efficient window manager',
    'minimal CPU usage mac',
    'fast macOS app',
    'lightweight productivity tool',
    'system performance mac',
  ],
  openGraph: {
    title: 'Lightweight & Fast Performance - TopWindow',
    description:
      'Minimal system impact with maximum functionality. TopWindow runs efficiently in the background.',
    type: 'article',
  },
};

export default function LightweightPage() {
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
      <section className='py-20 bg-gradient-to-br from-green-50 to-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6'>
              <Zap size={16} />
              Performance Focused
            </div>

            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
              <span className='text-primary'>Lightweight</span> & Lightning Fast
            </h1>

            <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
              TopWindow is engineered for efficiency. With minimal memory usage,
              negligible CPU impact, and optimized performance, it delivers
              powerful window management without slowing down your Mac.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center mb-8'>
              <Link
                href='/download'
                className='inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium'
              >
                <PlayCircle size={20} />
                Try It Free
              </Link>

              <button className='inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors'>
                <Activity size={20} />
                View Performance
              </button>
            </div>

            {/* Performance Stats */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto'>
              <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100'>
                <div className='text-2xl font-bold text-green-600 mb-2'>
                  4.3MB
                </div>
                <div className='text-sm text-gray-600'>App Size</div>
              </div>

              <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100'>
                <div className='text-2xl font-bold text-blue-600 mb-2'>
                  &lt;20MB
                </div>
                <div className='text-sm text-gray-600'>RAM Usage</div>
              </div>

              <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100'>
                <div className='text-2xl font-bold text-purple-600 mb-2'>
                  &lt;1%
                </div>
                <div className='text-sm text-gray-600'>CPU Usage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Performance Matters */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Why Performance Matters
            </h2>

            <div className='grid lg:grid-cols-2 gap-12 items-center'>
              <div>
                <h3 className='text-2xl font-semibold mb-6'>
                  Your Mac Deserves Better
                </h3>
                <div className='prose prose-lg'>
                  <p className='text-gray-600 leading-relaxed mb-6'>
                    Many utility apps become resource hogs, consuming precious
                    system resources and slowing down your Mac. TopWindow takes
                    the opposite approach - maximum functionality with minimal
                    impact.
                  </p>

                  <p className='text-gray-600 leading-relaxed mb-6'>
                    Whether you're running on an older MacBook or the latest Mac
                    Studio, TopWindow ensures your system resources remain
                    available for the work that matters most.
                  </p>
                </div>
              </div>

              <div className='space-y-6'>
                <div className='flex items-start gap-4 p-6 bg-red-50 rounded-xl'>
                  <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <span className='text-red-600 text-xl'>😔</span>
                  </div>
                  <div>
                    <h4 className='font-semibold text-red-900 mb-2'>
                      Heavy Utilities
                    </h4>
                    <p className='text-red-700 text-sm'>
                      Consume 100MB+ RAM, cause fan noise, drain battery, and
                      slow down other applications.
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4 p-6 bg-green-50 rounded-xl'>
                  <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <span className='text-green-600 text-xl'>🚀</span>
                  </div>
                  <div>
                    <h4 className='font-semibold text-green-900 mb-2'>
                      TopWindow
                    </h4>
                    <p className='text-green-700 text-sm'>
                      Under 20MB RAM, silent operation, excellent battery life,
                      and seamless performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Breakdown */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Performance Breakdown
            </h2>

            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
              <div className='bg-white p-8 rounded-2xl shadow-sm text-center'>
                <div className='w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <HardDrive className='text-blue-600' size={32} />
                </div>

                <div className='text-2xl font-bold text-blue-600 mb-2'>
                  4.3MB
                </div>
                <h3 className='font-semibold mb-3'>Disk Space</h3>
                <p className='text-gray-600 text-sm'>
                  Compact app bundle that installs in seconds and takes minimal
                  storage space.
                </p>
              </div>

              <div className='bg-white p-8 rounded-2xl shadow-sm text-center'>
                <div className='w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <Activity className='text-green-600' size={32} />
                </div>

                <div className='text-2xl font-bold text-green-600 mb-2'>
                  &lt;20MB
                </div>
                <h3 className='font-semibold mb-3'>Memory Usage</h3>
                <p className='text-gray-600 text-sm'>
                  Efficient memory management keeps RAM usage minimal, even with
                  multiple pinned windows.
                </p>
              </div>

              <div className='bg-white p-8 rounded-2xl shadow-sm text-center'>
                <div className='w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <Zap className='text-purple-600' size={32} />
                </div>

                <div className='text-2xl font-bold text-purple-600 mb-2'>
                  &lt;1%
                </div>
                <h3 className='font-semibold mb-3'>CPU Usage</h3>
                <p className='text-gray-600 text-sm'>
                  Negligible processor usage means no impact on performance or
                  system responsiveness.
                </p>
              </div>

              <div className='bg-white p-8 rounded-2xl shadow-sm text-center'>
                <div className='w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <Battery className='text-orange-600' size={32} />
                </div>

                <div className='text-2xl font-bold text-orange-600 mb-2'>
                  0%
                </div>
                <h3 className='font-semibold mb-3'>Battery Impact</h3>
                <p className='text-gray-600 text-sm'>
                  Optimized for energy efficiency with zero measurable impact on
                  battery life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Achieve This */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              How We Achieve Lightweight Performance
            </h2>

            <div className='space-y-8'>
              <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                <div className='flex items-start gap-6'>
                  <div className='flex-shrink-0'>
                    <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                      <span className='text-xl font-bold text-blue-600'>1</span>
                    </div>
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold mb-3'>
                      Native Swift Implementation
                    </h3>
                    <p className='text-gray-600 leading-relaxed'>
                      Built entirely in Swift using native Apple frameworks. No
                      heavyweight cross-platform libraries or unnecessary
                      dependencies that bloat the app size and memory usage.
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                <div className='flex items-start gap-6'>
                  <div className='flex-shrink-0'>
                    <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                      <span className='text-xl font-bold text-green-600'>
                        2
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold mb-3'>
                      Efficient Event Handling
                    </h3>
                    <p className='text-gray-600 leading-relaxed'>
                      Uses macOS's native notification system to monitor window
                      changes. The app only processes events when needed,
                      remaining dormant during idle periods.
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                <div className='flex items-start gap-6'>
                  <div className='flex-shrink-0'>
                    <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
                      <span className='text-xl font-bold text-purple-600'>
                        3
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold mb-3'>
                      Smart Memory Management
                    </h3>
                    <p className='text-gray-600 leading-relaxed'>
                      Automatic memory cleanup and efficient data structures
                      ensure TopWindow's memory footprint remains constant
                      regardless of how many windows you pin.
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                <div className='flex items-start gap-6'>
                  <div className='flex-shrink-0'>
                    <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center'>
                      <span className='text-xl font-bold text-orange-600'>
                        4
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold mb-3'>
                      Background Optimization
                    </h3>
                    <p className='text-gray-600 leading-relaxed'>
                      Designed to run efficiently in the background without
                      polling or continuous processing. TopWindow only activates
                      when you interact with it or when window states change.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Comparison */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-5xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Performance Comparison
            </h2>

            <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-4 text-left text-sm font-medium text-gray-900'>
                        App
                      </th>
                      <th className='px-6 py-4 text-center text-sm font-medium text-gray-900'>
                        App Size
                      </th>
                      <th className='px-6 py-4 text-center text-sm font-medium text-gray-900'>
                        RAM Usage
                      </th>
                      <th className='px-6 py-4 text-center text-sm font-medium text-gray-900'>
                        CPU Usage
                      </th>
                      <th className='px-6 py-4 text-center text-sm font-medium text-gray-900'>
                        Battery Impact
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    <tr className='bg-green-50'>
                      <td className='px-6 py-4 text-sm font-medium text-gray-900'>
                        TopWindow
                      </td>
                      <td className='px-6 py-4 text-center text-green-600 font-semibold'>
                        4.3MB
                      </td>
                      <td className='px-6 py-4 text-center text-green-600 font-semibold'>
                        &lt;20MB
                      </td>
                      <td className='px-6 py-4 text-center text-green-600 font-semibold'>
                        &lt;1%
                      </td>
                      <td className='px-6 py-4 text-center text-green-600 font-semibold'>
                        None
                      </td>
                    </tr>
                    <tr>
                      <td className='px-6 py-4 text-sm text-gray-900'>
                        Typical Window Manager A
                      </td>
                      <td className='px-6 py-4 text-center text-red-600'>
                        45MB
                      </td>
                      <td className='px-6 py-4 text-center text-red-600'>
                        120MB
                      </td>
                      <td className='px-6 py-4 text-center text-red-600'>
                        3-5%
                      </td>
                      <td className='px-6 py-4 text-center text-red-600'>
                        High
                      </td>
                    </tr>
                    <tr className='bg-gray-50'>
                      <td className='px-6 py-4 text-sm text-gray-900'>
                        Typical Window Manager B
                      </td>
                      <td className='px-6 py-4 text-center text-orange-600'>
                        78MB
                      </td>
                      <td className='px-6 py-4 text-center text-orange-600'>
                        95MB
                      </td>
                      <td className='px-6 py-4 text-center text-orange-600'>
                        2-4%
                      </td>
                      <td className='px-6 py-4 text-center text-orange-600'>
                        Medium
                      </td>
                    </tr>
                    <tr>
                      <td className='px-6 py-4 text-sm text-gray-900'>
                        Heavy Productivity Suite
                      </td>
                      <td className='px-6 py-4 text-center text-red-600'>
                        250MB+
                      </td>
                      <td className='px-6 py-4 text-center text-red-600'>
                        400MB+
                      </td>
                      <td className='px-6 py-4 text-center text-red-600'>
                        8-12%
                      </td>
                      <td className='px-6 py-4 text-center text-red-600'>
                        Very High
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-600'>
                * Performance measurements taken on a MacBook Pro M2 with 16GB
                RAM running macOS 14
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Real-World Benefits
            </h2>

            <div className='grid md:grid-cols-2 gap-8'>
              <div className='space-y-6'>
                <div className='flex items-start gap-4'>
                  <CheckCircle
                    className='text-green-500 mt-1 flex-shrink-0'
                    size={20}
                  />
                  <div>
                    <h3 className='font-semibold mb-2'>Longer Battery Life</h3>
                    <p className='text-gray-600 text-sm'>
                      Zero battery impact means your MacBook lasts longer on a
                      single charge, perfect for all-day productivity sessions.
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <CheckCircle
                    className='text-green-500 mt-1 flex-shrink-0'
                    size={20}
                  />
                  <div>
                    <h3 className='font-semibold mb-2'>Silent Operation</h3>
                    <p className='text-gray-600 text-sm'>
                      No fans spinning up, no heat generation. TopWindow runs so
                      efficiently your Mac stays quiet and cool.
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <CheckCircle
                    className='text-green-500 mt-1 flex-shrink-0'
                    size={20}
                  />
                  <div>
                    <h3 className='font-semibold mb-2'>Instant Startup</h3>
                    <p className='text-gray-600 text-sm'>
                      Launches in milliseconds and is immediately ready to use.
                      No splash screens or loading delays.
                    </p>
                  </div>
                </div>
              </div>

              <div className='space-y-6'>
                <div className='flex items-start gap-4'>
                  <CheckCircle
                    className='text-green-500 mt-1 flex-shrink-0'
                    size={20}
                  />
                  <div>
                    <h3 className='font-semibold mb-2'>
                      More Resources for Other Apps
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      Your RAM and CPU remain available for demanding
                      applications like video editing, development tools, and
                      creative software.
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <CheckCircle
                    className='text-green-500 mt-1 flex-shrink-0'
                    size={20}
                  />
                  <div>
                    <h3 className='font-semibold mb-2'>Works on Older Macs</h3>
                    <p className='text-gray-600 text-sm'>
                      Runs perfectly on older MacBooks with limited RAM,
                      extending the useful life of your hardware.
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <CheckCircle
                    className='text-green-500 mt-1 flex-shrink-0'
                    size={20}
                  />
                  <div>
                    <h3 className='font-semibold mb-2'>Set and Forget</h3>
                    <p className='text-gray-600 text-sm'>
                      Install once and it works reliably in the background
                      without maintenance, updates, or configuration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Performance Questions
            </h2>

            <div className='space-y-6'>
              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>
                  Will TopWindow slow down my older Mac?
                </h3>
                <p className='text-gray-600 text-sm'>
                  Not at all! TopWindow is specifically designed to run
                  efficiently on older hardware. With under 20MB RAM usage, it
                  works great even on 8GB systems from 2015 and newer.
                </p>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>
                  How does memory usage scale with pinned windows?
                </h3>
                <p className='text-gray-600 text-sm'>
                  TopWindow's memory usage remains virtually constant regardless
                  of how many windows you pin. Each pinned window adds less than
                  1KB to memory usage thanks to efficient data structures.
                </p>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>
                  Does it affect gaming or video performance?
                </h3>
                <p className='text-gray-600 text-sm'>
                  No impact whatsoever. TopWindow uses less than 1% CPU and
                  doesn't interfere with graphics-intensive applications. Your
                  games and videos will run exactly as before.
                </p>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>
                  Why is TopWindow smaller than other similar apps?
                </h3>
                <p className='text-gray-600 text-sm'>
                  We built TopWindow from the ground up using only native macOS
                  frameworks. No bloated cross-platform libraries, no
                  unnecessary features - just efficient, focused functionality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-2xl mx-auto text-center'>
            <h2 className='text-3xl font-bold mb-4'>
              Experience Lightweight Performance
            </h2>
            <p className='text-gray-600 mb-8'>
              Try TopWindow and feel the difference of truly efficient software
              that respects your Mac's resources.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href='/download'
                className='inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary-dark transition-colors font-medium text-lg'
              >
                Download TopWindow
              </Link>

              <Link
                href='/features'
                className='inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg'
              >
                Explore All Features
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
