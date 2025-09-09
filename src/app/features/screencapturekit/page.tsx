import type { Metadata } from 'next';
import {
  ArrowLeft,
  Shield,
  Cpu,
  Lock,
  Zap,
  PlayCircle,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ScreenCaptureKit for Always-on-Top on Mac | TopWindow',
  description:
    'How TopWindow uses Apple ScreenCaptureKit for secure, efficient always-on-top window control on macOS. Modern APIs for reliable performance.',
  keywords: [
    'ScreenCaptureKit macOS',
    'always on top mac',
    'keep window on top macOS',
    'secure window control mac',
    'Apple ScreenCaptureKit integration',
  ],
  openGraph: {
    title: 'ScreenCaptureKit for Always-on-Top on Mac – TopWindow',
    description:
      'Modern Apple framework powering secure, efficient always-on-top behavior on macOS.',
    type: 'article',
  },
};

export default function ScreenCaptureKitPage() {
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
      <section className='py-20 bg-gradient-to-br from-indigo-50 to-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-6'>
              <Shield size={16} />
              Technical Foundation
            </div>

            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
              <span className='text-primary'>ScreenCaptureKit</span> for Always‑on‑Top on Mac
            </h1>

            <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
              TopWindow leverages Apple's cutting-edge ScreenCaptureKit
              framework to provide secure, efficient, and reliable window
              management. Experience the power of modern macOS APIs working
              seamlessly in the background.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href='/download'
                className='inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium'
              >
                <PlayCircle size={20} />
                Try It Free
              </Link>

              <button className='inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors'>
                <Shield size={20} />
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* What is ScreenCaptureKit */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              What is Apple ScreenCaptureKit?
            </h2>

            <div className='grid lg:grid-cols-2 gap-12 items-center'>
              <div>
                <div className='prose prose-lg'>
                  <p className='text-gray-600 leading-relaxed mb-6'>
                    ScreenCaptureKit is Apple's modern framework for screen
                    content access and window management, introduced in macOS
                    12.3. It provides secure, privacy-focused APIs that allow
                    applications to interact with system windows while
                    respecting user privacy and security.
                  </p>

                  <p className='text-gray-600 leading-relaxed mb-6'>
                    Unlike older methods that relied on accessibility APIs or
                    system hacks, ScreenCaptureKit offers a sanctioned,
                    efficient way to manage windows at the system level.
                  </p>
                </div>
              </div>

              <div className='bg-indigo-50 p-8 rounded-2xl'>
                <h3 className='text-xl font-semibold mb-6 text-indigo-900'>
                  Key Framework Features
                </h3>

                <div className='space-y-4'>
                  <div className='flex items-start gap-3'>
                    <CheckCircle
                      className='text-indigo-600 mt-1 flex-shrink-0'
                      size={20}
                    />
                    <div>
                      <div className='font-medium text-indigo-900'>
                        System-Level Access
                      </div>
                      <div className='text-sm text-indigo-700'>
                        Direct integration with macOS window server
                      </div>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <CheckCircle
                      className='text-indigo-600 mt-1 flex-shrink-0'
                      size={20}
                    />
                    <div>
                      <div className='font-medium text-indigo-900'>
                        Privacy by Design
                      </div>
                      <div className='text-sm text-indigo-700'>
                        User consent required for window access
                      </div>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <CheckCircle
                      className='text-indigo-600 mt-1 flex-shrink-0'
                      size={20}
                    />
                    <div>
                      <div className='font-medium text-indigo-900'>
                        High Performance
                      </div>
                      <div className='text-sm text-indigo-700'>
                        Optimized for minimal system impact
                      </div>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <CheckCircle
                      className='text-indigo-600 mt-1 flex-shrink-0'
                      size={20}
                    />
                    <div>
                      <div className='font-medium text-indigo-900'>
                        Future-Proof
                      </div>
                      <div className='text-sm text-indigo-700'>
                        Actively maintained by Apple
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How TopWindow Uses It */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              How TopWindow Uses ScreenCaptureKit for Always‑on‑Top
            </h2>

            <div className='grid md:grid-cols-2 gap-8'>
              <div className='bg-white p-8 rounded-2xl shadow-sm'>
                <div className='w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6'>
                  <Shield className='text-blue-600' size={32} />
                </div>

                <h3 className='text-xl font-semibold mb-4'>Window Discovery</h3>
                <p className='text-gray-600 leading-relaxed'>
                  ScreenCaptureKit allows TopWindow to enumerate and identify
                  all available windows across applications, providing accurate
                  window metadata and properties for precise control.
                </p>
              </div>

              <div className='bg-white p-8 rounded-2xl shadow-sm'>
                <div className='w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6'>
                  <Zap className='text-green-600' size={32} />
                </div>

                <h3 className='text-xl font-semibold mb-4'>
                  Real-time Monitoring
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  The framework enables TopWindow to monitor window state
                  changes in real-time, ensuring pinned windows maintain their
                  always-on-top behavior even as the system changes.
                </p>
              </div>

              <div className='bg-white p-8 rounded-2xl shadow-sm'>
                <div className='w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6'>
                  <Lock className='text-purple-600' size={32} />
                </div>

                <h3 className='text-xl font-semibold mb-4'>
                  Secure Operations
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  All window manipulations happen through authorized API calls,
                  ensuring TopWindow operates within Apple's security sandbox
                  without compromising system integrity.
                </p>
              </div>

              <div className='bg-white p-8 rounded-2xl shadow-sm'>
                <div className='w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6'>
                  <Cpu className='text-orange-600' size={32} />
                </div>

                <h3 className='text-xl font-semibold mb-4'>
                  Efficient Resource Usage
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  ScreenCaptureKit's optimized implementation means TopWindow
                  uses minimal CPU and memory, running efficiently in the
                  background without impacting system performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Benefits */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Technical Advantages
            </h2>

            <div className='grid lg:grid-cols-3 gap-8'>
              <div className='text-center'>
                <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <span className='text-white text-2xl font-bold'>1</span>
                </div>
                <h3 className='text-xl font-semibold mb-4'>
                  Modern API Design
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  ScreenCaptureKit represents Apple's latest thinking on window
                  management APIs, offering cleaner interfaces and better error
                  handling than legacy alternatives.
                </p>
              </div>

              <div className='text-center'>
                <div className='w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <span className='text-white text-2xl font-bold'>2</span>
                </div>
                <h3 className='text-xl font-semibold mb-4'>
                  Enhanced Compatibility
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  Works consistently across all macOS versions from 12.3+,
                  including Apple Silicon Macs, ensuring TopWindow functions
                  reliably on modern hardware and software.
                </p>
              </div>

              <div className='text-center'>
                <div className='w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <span className='text-white text-2xl font-bold'>3</span>
                </div>
                <h3 className='text-xl font-semibold mb-4'>Future-Ready</h3>
                <p className='text-gray-600 leading-relaxed'>
                  As an actively developed Apple framework, ScreenCaptureKit
                  ensures TopWindow remains compatible with future macOS updates
                  and new features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Why ScreenCaptureKit vs Older Methods
            </h2>

            <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-4 text-left text-sm font-medium text-gray-900'>
                        Feature
                      </th>
                      <th className='px-6 py-4 text-center text-sm font-medium text-gray-900'>
                        Legacy Methods
                      </th>
                      <th className='px-6 py-4 text-center text-sm font-medium text-primary'>
                        ScreenCaptureKit
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    <tr>
                      <td className='px-6 py-4 text-sm text-gray-900'>
                        Security
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <span className='text-red-600'>
                          ⚠️ Accessibility bypass
                        </span>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <span className='text-green-600'>
                          ✅ Apple-sanctioned APIs
                        </span>
                      </td>
                    </tr>
                    <tr className='bg-gray-50'>
                      <td className='px-6 py-4 text-sm text-gray-900'>
                        Performance
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <span className='text-orange-600'>
                          ⚠️ High overhead
                        </span>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <span className='text-green-600'>
                          ✅ Optimized implementation
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className='px-6 py-4 text-sm text-gray-900'>
                        Reliability
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <span className='text-red-600'>
                          ❌ Prone to breaking
                        </span>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <span className='text-green-600'>
                          ✅ Stable API contract
                        </span>
                      </td>
                    </tr>
                    <tr className='bg-gray-50'>
                      <td className='px-6 py-4 text-sm text-gray-900'>
                        Privacy
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <span className='text-red-600'>
                          ❌ Broad permissions
                        </span>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <span className='text-green-600'>
                          ✅ Granular consent
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className='px-6 py-4 text-sm text-gray-900'>
                        Future Support
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <span className='text-red-600'>❌ Deprecated</span>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <span className='text-green-600'>
                          ✅ Actively developed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Privacy & Security First
            </h2>

            <div className='bg-blue-50 p-8 rounded-2xl'>
              <div className='grid lg:grid-cols-2 gap-8 items-center'>
                <div>
                  <h3 className='text-2xl font-semibold mb-6 text-blue-900'>
                    Your Privacy Matters
                  </h3>

                  <div className='space-y-4'>
                    <div className='flex items-start gap-3'>
                      <div className='w-2 h-2 bg-blue-600 rounded-full mt-2'></div>
                      <p className='text-blue-800'>
                        <strong>Screen Recording Permission:</strong> macOS
                        requires explicit user consent before TopWindow can
                        access window information.
                      </p>
                    </div>

                    <div className='flex items-start gap-3'>
                      <div className='w-2 h-2 bg-blue-600 rounded-full mt-2'></div>
                      <p className='text-blue-800'>
                        <strong>No Content Access:</strong> TopWindow only
                        manages window positioning - it never sees or accesses
                        the actual content of your windows.
                      </p>
                    </div>

                    <div className='flex items-start gap-3'>
                      <div className='w-2 h-2 bg-blue-600 rounded-full mt-2'></div>
                      <p className='text-blue-800'>
                        <strong>Local Processing:</strong> All window management
                        happens locally on your Mac - no data is sent to
                        external servers.
                      </p>
                    </div>

                    <div className='flex items-start gap-3'>
                      <div className='w-2 h-2 bg-blue-600 rounded-full mt-2'></div>
                      <p className='text-blue-800'>
                        <strong>Minimal Footprint:</strong> TopWindow only
                        requests the specific permissions needed for window
                        management, nothing more.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='text-center'>
                  <div className='w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-6'>
                    <Lock className='text-blue-700' size={64} />
                  </div>
                  <div className='text-blue-900 font-semibold text-lg'>
                    Apple-Approved Security Model
                  </div>
                  <div className='text-blue-700 text-sm mt-2'>
                    ScreenCaptureKit operates within Apple's strict security
                    sandbox, ensuring your system remains protected.
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
              Technical Questions
            </h2>

            <div className='space-y-6'>
              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>
                  What macOS versions support ScreenCaptureKit?
                </h3>
                <p className='text-gray-600 text-sm'>
                  ScreenCaptureKit is available on macOS 12.3 and later.
                  TopWindow requires macOS 13.0+ to ensure the best
                  compatibility and performance with the framework.
                </p>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>
                  Does ScreenCaptureKit work with Apple Silicon Macs?
                </h3>
                <p className='text-gray-600 text-sm'>
                  Yes! ScreenCaptureKit is fully optimized for both Intel and
                  Apple Silicon Macs. TopWindow runs natively on M1, M2, M3, and
                  newer processors for maximum performance.
                </p>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>
                  Why does TopWindow need screen recording permission?
                </h3>
                <p className='text-gray-600 text-sm'>
                  macOS requires screen recording permission for apps to access
                  window information through ScreenCaptureKit. This is a
                  security measure - TopWindow only uses this permission to
                  identify windows for pinning, never to record or capture
                  screen content.
                </p>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>
                  How does this differ from accessibility-based window managers?
                </h3>
                <p className='text-gray-600 text-sm'>
                  Unlike older window managers that rely on accessibility APIs
                  (which can be unreliable and slow), TopWindow uses
                  ScreenCaptureKit for direct, efficient communication with the
                  macOS window server. This provides better performance and
                  reliability.
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
              Experience Modern Window Management
            </h2>
            <p className='text-gray-600 mb-8'>
              Try TopWindow's ScreenCaptureKit-powered window management and
              feel the difference of modern, secure, and efficient macOS
              integration.
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
