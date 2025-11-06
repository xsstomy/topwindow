import type { Metadata } from 'next';
import { Monitor, Command, CheckCircle, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Keep Any Window Always on Top on Mac | TopWindow',
  description:
    'Use TopWindow to keep a window always on top on macOS. Pin or float Safari, Chrome, Finder, or any app window above others with one click or ⌥⌘P.',
  keywords: [
    'always on top mac',
    'keep window on top macOS',
    'pin window on top mac',
    'macOS window pinning',
    'always visible window mac',
    'window stays on top mac',
  ],
  openGraph: {
    title: 'Keep Any Window Always on Top on Mac – TopWindow',
    description:
      'Pin or float any macOS window to stay always on top. Ideal for multitasking and persistent reference.',
    type: 'article',
  },
  alternates: {
    canonical: '/features/always-on-top/',
  },
};

export default function AlwaysOnTopPage() {
  return (
    <main className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='py-20 bg-gradient-to-br from-blue-50 to-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6'>
              <Monitor size={16} />
              Core Feature
            </div>

            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
              Keep Any Window{' '}
              <span className='text-primary'>Always on Top</span> on Mac
            </h1>

            <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
              TopWindow's core functionality lets you pin any application window
              to stay visible above all others. Perfect for reference materials,
              monitoring tools, or keeping important information in sight while
              you work.
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
                <Command size={20} />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              How Always‑on‑Top Works on Mac
            </h2>

            <div className='grid md:grid-cols-3 gap-8'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl font-bold text-blue-600'>1</span>
                </div>
                <h3 className='text-xl font-semibold mb-3'>
                  Select Your Window
                </h3>
                <p className='text-gray-600'>
                  Click on any application window to make it active. Works with
                  Safari, Chrome, Finder, VS Code, or any macOS app.
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl font-bold text-green-600'>2</span>
                </div>
                <h3 className='text-xl font-semibold mb-3'>Pin It</h3>
                <p className='text-gray-600'>
                  Press{' '}
                  <kbd className='px-2 py-1 bg-gray-100 rounded font-mono'>
                    ⌥⌘P
                  </kbd>{' '}
                  or use TopWindow's menu bar to instantly pin the window.
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl font-bold text-purple-600'>3</span>
                </div>
                <h3 className='text-xl font-semibold mb-3'>Stay Focused</h3>
                <p className='text-gray-600'>
                  Your window now stays visible above all others. Switch apps,
                  open new windows - your pinned content remains on top.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Popular Always‑on‑Top Use Cases
            </h2>

            <div className='grid md:grid-cols-2 gap-8'>
              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <div className='flex items-start gap-4'>
                  <CheckCircle
                    className='text-green-500 mt-1 flex-shrink-0'
                    size={20}
                  />
                  <div>
                    <h3 className='font-semibold mb-2'>
                      Code Reference While Coding
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      Keep documentation, Stack Overflow, or API references
                      visible while coding in your IDE.
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <div className='flex items-start gap-4'>
                  <CheckCircle
                    className='text-green-500 mt-1 flex-shrink-0'
                    size={20}
                  />
                  <div>
                    <h3 className='font-semibold mb-2'>
                      Video Calls During Work
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      Pin your Zoom, Teams, or FaceTime window to stay connected
                      while working on other tasks.
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <div className='flex items-start gap-4'>
                  <CheckCircle
                    className='text-green-500 mt-1 flex-shrink-0'
                    size={20}
                  />
                  <div>
                    <h3 className='font-semibold mb-2'>
                      Monitoring & Analytics
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      Keep system monitors, analytics dashboards, or server logs
                      visible for real-time monitoring.
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <div className='flex items-start gap-4'>
                  <CheckCircle
                    className='text-green-500 mt-1 flex-shrink-0'
                    size={20}
                  />
                  <div>
                    <h3 className='font-semibold mb-2'>
                      Note-Taking & Research
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      Pin your note-taking app or research materials while
                      browsing, reading, or working.
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <div className='flex items-start gap-4'>
                  <CheckCircle
                    className='text-green-500 mt-1 flex-shrink-0'
                    size={20}
                  />
                  <div>
                    <h3 className='font-semibold mb-2'>
                      Media & Entertainment
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      Watch YouTube videos, Netflix, or streams while working on
                      other applications.
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <div className='flex items-start gap-4'>
                  <CheckCircle
                    className='text-green-500 mt-1 flex-shrink-0'
                    size={20}
                  />
                  <div>
                    <h3 className='font-semibold mb-2'>Calculator & Tools</h3>
                    <p className='text-gray-600 text-sm'>
                      Keep Calculator, Calendar, or other utility apps
                      accessible while working in other apps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              How TopWindow Enables Always‑on‑Top
            </h2>

            <div className='prose prose-lg max-w-none'>
              <div className='bg-blue-50 p-8 rounded-xl'>
                <h3 className='text-xl font-semibold mb-4 text-blue-900'>
                  ScreenCaptureKit Integration
                </h3>
                <p className='text-blue-800 mb-4'>
                  TopWindow leverages macOS's advanced ScreenCaptureKit
                  framework to provide precise window control. This modern
                  approach ensures compatibility with the latest macOS versions
                  and provides reliable window management.
                </p>

                <div className='grid md:grid-cols-2 gap-6 mt-6'>
                  <div>
                    <h4 className='font-semibold text-blue-900 mb-2'>
                      ✓ System-Level Integration
                    </h4>
                    <p className='text-blue-700 text-sm'>
                      Uses official Apple APIs for stable, secure window
                      manipulation.
                    </p>
                  </div>

                  <div>
                    <h4 className='font-semibold text-blue-900 mb-2'>
                      ✓ Universal App Support
                    </h4>
                    <p className='text-blue-700 text-sm'>
                      Works with any macOS application, including system apps
                      and third-party software.
                    </p>
                  </div>

                  <div>
                    <h4 className='font-semibold text-blue-900 mb-2'>
                      ✓ Minimal Performance Impact
                    </h4>
                    <p className='text-blue-700 text-sm'>
                      Lightweight implementation that doesn't slow down your
                      Mac.
                    </p>
                  </div>

                  <div>
                    <h4 className='font-semibold text-blue-900 mb-2'>
                      ✓ Privacy Focused
                    </h4>
                    <p className='text-blue-700 text-sm'>
                      Only controls window positioning - never accesses window
                      content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Always‑on‑Top FAQ
            </h2>

            <div className='space-y-6'>
              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>
                  Does macOS have native always-on-top functionality?
                </h3>
                <p className='text-gray-600 text-sm'>
                  No, macOS doesn't include a built-in always-on-top feature
                  like some other operating systems. TopWindow fills this gap by
                  providing system-level window pinning capabilities.
                </p>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>
                  Will pinned windows stay on top when I switch apps?
                </h3>
                <p className='text-gray-600 text-sm'>
                  Yes! Once pinned, windows remain visible above all other
                  applications, even when you ⌘+Tab between apps or open new
                  windows. This is perfect for keeping reference materials
                  visible.
                </p>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>
                  Can I pin multiple windows at once?
                </h3>
                <p className='text-gray-600 text-sm'>
                  Absolutely! TopWindow supports pinning multiple windows
                  simultaneously. You can have your video call, documentation,
                  and monitoring tools all pinned at the same time.
                </p>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>How do I unpin a window?</h3>
                <p className='text-gray-600 text-sm'>
                  Simply press ⌥⌘P again on the pinned window, or use
                  TopWindow's menu bar to unpin it. The window will return to
                  normal behavior immediately.
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
              Ready to Keep Your Windows on Top?
            </h2>
            <p className='text-gray-600 mb-8'>
              Start your 7-day free trial and experience how TopWindow
              transforms your macOS workflow.
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
