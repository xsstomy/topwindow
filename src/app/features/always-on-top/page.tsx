// app/features/always-on-top/page.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { Monitor, Command, CheckCircle, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Keep Any Window Always on Top on macOS – TopWindow',
  description:
    'Use TopWindow to keep any window always on top on macOS. One-click pin or ⌥⌘P to float Safari, Chrome, Finder, or any app above others. Lightweight, privacy-safe.',
  keywords: [
    'always on top mac',
    'keep window on top mac',
    'mac always on top app',
    'macOS window pinning',
    'pin window above others',
    'floating window mac',
  ],
  alternates: {
    canonical: 'https://topwindow.app/features/always-on-top/',
    languages: {
      en: 'https://topwindow.app/features/always-on-top/',
      // zh: 'https://topwindow.app/zh/features/always-on-top/',
    },
  },
  robots: {
    index: true,
    follow: true,
    maxSnippet: -1,
    maxImagePreview: 'large',
  },
  openGraph: {
    type: 'article',
    url: 'https://topwindow.app/features/always-on-top/',
    siteName: 'TopWindow',
    title: 'Keep Any Window Always on Top on macOS – TopWindow',
    description:
      'TopWindow lets you keep any macOS window always visible. Perfect for multitasking, tutorials, meetings and monitoring.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keep Any Window Always on Top on macOS – TopWindow',
    description:
      'Pin any macOS window above others with TopWindow. One-click or shortcut ⌥⌘P.',
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
              <span className='text-primary'>Always on Top</span> on macOS
            </h1>

            <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
              TopWindow lets you pin any application window to stay visible
              above all others. Perfect for reference materials, monitoring
              tools, tutorials, meetings, or keeping important information in
              sight while you work.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href='/download'
                className='inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium'
              >
                <PlayCircle size={20} />
                Download TopWindow – Always-on-Top for macOS
              </Link>

              <a
                href='/multipin.mp4'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors'
              >
                <Command size={20} />
                Watch Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              How to Keep Any Window Always on Top on macOS
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
                  or use TopWindow&apos;s menu bar to instantly pin the window
                  above others.
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl font-bold text-purple-600'>3</span>
                </div>
                <h3 className='text-xl font-semibold mb-3'>Stay Focused</h3>
                <p className='text-gray-600'>
                  Your window now stays visible above all others. Switch apps,
                  open new windows— your pinned content remains on top.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold mb-4'>
                See TopWindow in Action
              </h2>
              <p className='text-gray-600 text-lg'>
                Watch how easy it is to pin multiple windows on top
              </p>
            </div>

            <div className='relative bg-white rounded-2xl shadow-2xl overflow-hidden'>
              {/* Video Player */}
              <div className='aspect-video bg-black relative'>
                <video
                  className='w-full h-full object-cover'
                  controls
                  preload='metadata'
                  poster='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMUYyOTM3Ii8+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjIyNSIgcj0iNDAiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuOSIvPgo8cGF0aCBkPSJNMzg1IDIwNUw0MjUgMjI1TDM4NSAyNDVWMjA1WiIgZmlsbD0iIzFGMjkzNyIvPgo8L3N2Zz4K'
                >
                  <source src='/multipin.mp4' type='video/mp4' />
                  Your browser does not support the video tag.
                </video>

                {/* Video Title */}
                <div className='absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm'>
                  Multi-Pin Demo
                </div>
              </div>

              {/* Video Information */}
              <div className='p-4 bg-white border-t border-gray-100'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      TopWindow Always-on-Top Feature
                    </h3>
                    <p className='text-sm text-gray-600'>
                      See how to pin any window above others on macOS
                    </p>
                  </div>
                  <div className='text-sm text-gray-600'>Live Demo</div>
                </div>
              </div>
            </div>

            <div className='text-center mt-6'>
              <p className='text-sm text-gray-500'>
                Press{' '}
                <kbd className='px-2 py-1 bg-gray-100 rounded font-mono'>
                  ⌥⌘P
                </kbd>{' '}
                to pin/unpin any window
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Popular Always-on-Top Use Cases
            </h2>

            <div className='grid md:grid-cols-2 gap-8'>
              {[
                {
                  title: 'Code Reference While Coding',
                  text: 'Keep documentation, Stack Overflow, or API references visible while coding in your IDE.',
                },
                {
                  title: 'Video Calls During Work',
                  text: 'Pin your Zoom, Teams, or FaceTime window to stay connected while working on other tasks.',
                },
                {
                  title: 'Monitoring & Analytics',
                  text: 'Keep system monitors, analytics dashboards, or server logs visible for real-time monitoring.',
                },
                {
                  title: 'Note-Taking & Research',
                  text: 'Pin your note-taking app or research materials while browsing, reading, or working.',
                },
                {
                  title: 'Media & Entertainment',
                  text: 'Watch YouTube videos or streams while working in other applications via a floating window.',
                },
                {
                  title: 'Calculator & Tools',
                  text: 'Keep Calculator, Calendar, or other utility apps accessible while working in other apps.',
                },
              ].map(item => (
                <div
                  key={item.title}
                  className='bg-white p-6 rounded-xl shadow-sm'
                >
                  <div className='flex items-start gap-4'>
                    <CheckCircle
                      className='text-green-500 mt-1 flex-shrink-0'
                      size={20}
                    />
                    <div>
                      <h3 className='font-semibold mb-2'>{item.title}</h3>
                      <p className='text-gray-600 text-sm'>{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Why TopWindow Is the Best Always-on-Top Utility for macOS
            </h2>

            <div className='prose prose-lg max-w-none'>
              <div className='bg-blue-50 p-8 rounded-xl'>
                <h3 className='text-xl font-semibold mb-4 text-blue-900'>
                  ScreenCaptureKit Integration
                </h3>
                <p className='text-blue-800 mb-4'>
                  TopWindow uses official Apple APIs to provide precise, stable
                  window pinning with minimal performance impact and strong
                  privacy guarantees.
                </p>

                <div className='grid md:grid-cols-2 gap-6 mt-6'>
                  <FeaturePoint title='✓ System-Level Integration'>
                    Uses official Apple APIs for stable, secure window
                    manipulation.
                  </FeaturePoint>
                  <FeaturePoint title='✓ Universal App Support'>
                    Works with any macOS application, including system apps and
                    third-party software.
                  </FeaturePoint>
                  <FeaturePoint title='✓ Minimal Performance Impact'>
                    Lightweight implementation that doesn&apos;t slow down your
                    Mac.
                  </FeaturePoint>
                  <FeaturePoint title='✓ Privacy Focused'>
                    Only controls window positioning—never accesses window
                    content.
                  </FeaturePoint>
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
              Always-on-Top FAQ
            </h2>

            <div className='space-y-6'>
              <FaqItem q='Does macOS have native always-on-top functionality?'>
                No, macOS doesn&apos;t include a built-in always-on-top feature.
                TopWindow fills this gap by providing system-level window
                pinning capabilities.
              </FaqItem>

              <FaqItem q='Will pinned windows stay on top when I switch apps?'>
                Yes. Once pinned, windows remain visible above all other
                applications, even when you ⌘+Tab between apps or open new
                windows—perfect for keeping reference materials visible.
              </FaqItem>

              <FaqItem q='Can I pin multiple windows at once?'>
                Absolutely. TopWindow supports pinning multiple windows
                simultaneously. You can have your video call, documentation, and
                monitoring tools all pinned at the same time.
              </FaqItem>

              <FaqItem q='How do I unpin a window?'>
                Press ⌥⌘P again on the pinned window, or use TopWindow&apos;s
                menu bar to unpin it. The window will return to normal behavior
                immediately.
              </FaqItem>
            </div>

            {/* Internal deep links to strengthen topical authority */}
            <div className='mt-10 text-center text-sm text-gray-600'>
              Explore more:{' '}
              <Link className='text-primary underline' href='/features/hotkeys'>
                Hotkeys
              </Link>{' '}
              ·{' '}
              <Link
                className='text-primary underline'
                href='/features/screencapturekit'
              >
                ScreenCaptureKit
              </Link>{' '}
              ·{' '}
              <Link
                className='text-primary underline'
                href='/comparison/windowtop-vs-topwindow'
              >
                TopWindow vs WindowTop
              </Link>
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

      {/* JSON-LD: WebPage */}
      <Script
        id='ld-webpage'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Keep Any Window Always on Top on macOS – TopWindow',
            url: 'https://topwindow.app/features/always-on-top/',
            description:
              'Use TopWindow to keep any window always on top on macOS with one click or ⌥⌘P.',
            isPartOf: {
              '@type': 'WebSite',
              name: 'TopWindow',
              url: 'https://topwindow.app',
            },
          }),
        }}
      />
      {/* JSON-LD: Breadcrumb */}
      <Script
        id='ld-breadcrumb'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Features',
                item: 'https://topwindow.app/features/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Always on Top',
                item: 'https://topwindow.app/features/always-on-top/',
              },
            ],
          }),
        }}
      />
      {/* JSON-LD: FAQ */}
      <Script
        id='ld-faq'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How do I keep a window always on top on macOS?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Install TopWindow, then press ⌥⌘P or use the menu bar to pin the active window above others.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can I pin multiple windows at once?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. TopWindow supports multiple pinned windows simultaneously for calls, docs and monitoring.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is TopWindow lightweight and privacy-safe?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'TopWindow is lightweight and privacy-focused. It only controls window position and never reads window content.',
                },
              },
            ],
          }),
        }}
      />

      <Script
        id='ld-video'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: 'TopWindow – Always on Top on macOS',
            description:
              'Demo showing how to pin any macOS window always on top with TopWindow.',
            uploadDate: '2025-11-09',
            contentUrl: 'https://topwindow.app/multipin.mp4',
            publisher: { '@type': 'Organization', name: 'TopWindow' },
          }),
        }}
      />

      <Footer />
    </main>
  );
}

/** --- Small presentational helpers --- */
function FeaturePoint({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className='font-semibold text-blue-900 mb-2'>{title}</h4>
      <p className='text-blue-700 text-sm'>{children}</p>
    </div>
  );
}

function FaqItem({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className='bg-white p-6 rounded-xl shadow-sm'>
      <h3 className='font-semibold mb-2'>{q}</h3>
      <p className='text-gray-600 text-sm'>{children}</p>
    </div>
  );
}
