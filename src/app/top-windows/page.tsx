import type { Metadata } from 'next';
import {
  ArrowRight,
  Monitor,
  Star,
  CheckCircle,
  Download,
  Zap,
  Shield,
  Users,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Top Windows - Best Always-On-Top Apps & Window Managers 2024',
  description:
    'Discover the top windows management solutions for Mac and Windows. Compare the best always-on-top apps, window managers, and productivity tools. Find your perfect window organization solution.',
  keywords: [
    'top windows',
    'best always-on-top apps',
    'best window managers for mac',
    'best window managers for windows',
    'window management software',
    'always on top windows',
    'mac window manager',
    'windows 11 window manager',
    'desktop organization tools',
    'multitasking productivity apps',
    'window pinning software',
    'floating window apps',
    'TopWindow',
    'macOS window utilities',
    'Windows window management',
  ],
  openGraph: {
    title: 'Top Windows - Complete Guide to Window Management Apps',
    description:
      'Compare and discover the best always-on-top apps and window managers for Mac and Windows. Expert reviews, feature comparisons, and user ratings.',
    type: 'article',
    url: '/top-windows/',
  },
  alternates: {
    canonical: '/top-windows/',
  },
};

const windowManagers = [
  {
    name: 'TopWindow',
    platform: 'macOS',
    rating: 4.8,
    description: 'Native macOS utility for keeping windows always on top',
    features: [
      'Always-on-top functionality',
      'ScreenCaptureKit integration',
      'Custom hotkeys (⌥⌘P)',
      'Lightweight design',
      'No battery drain',
    ],
    pros: ['Native performance', 'Privacy-focused', 'Easy to use'],
    cons: ['macOS only'],
    price: 'Free trial, $4.99 Pro',
    link: '/features/',
    officialUrl: 'https://topwindow.app',
  },
  {
    name: 'Magnet',
    platform: 'macOS',
    rating: 4.5,
    description: 'Window snapping and organization for macOS',
    features: [
      'Window snapping',
      'Keyboard shortcuts',
      'Multiple monitor support',
      'Menu bar access',
    ],
    pros: ['Reliable', 'Good integration', 'Affordable'],
    cons: ['Limited always-on-top', 'Older interface'],
    price: '$7.99',
    link: null,
    officialUrl: null,
  },
  {
    name: 'BetterTouchTool',
    platform: 'macOS',
    rating: 4.6,
    description: 'Advanced window management and gesture controls',
    features: [
      'Window snapping',
      'Touch bar controls',
      'Mouse gestures',
      'Custom triggers',
      'Scripting support',
    ],
    pros: ['Highly customizable', 'Powerful', 'Regular updates'],
    cons: ['Complex interface', 'Learning curve', 'Resource usage'],
    price: '$8.50',
    link: null,
    officialUrl: null,
  },
  {
    name: 'PowerToys',
    platform: 'Windows',
    rating: 4.7,
    description: "Microsoft's official power user toolkit",
    features: [
      'FancyZones (window layout)',
      'Always on Top',
      'PowerToys Run',
      'Keyboard Manager',
      'Free and open source',
    ],
    pros: ['Free', 'Microsoft supported', 'Feature rich'],
    cons: ['Windows only', 'Installation required'],
    price: 'Free',
    link: null,
    officialUrl: null,
  },
  {
    name: 'DisplayFusion',
    platform: 'Windows',
    rating: 4.4,
    description: 'Multi-monitor window management powerhouse',
    features: [
      'Multi-monitor support',
      'Window positioning',
      'Taskbar on multiple monitors',
      'Custom title bar buttons',
    ],
    pros: ['Multi-monitor expert', 'Highly configurable', 'Remote control'],
    cons: ['Windows only', 'Premium price', 'Complex'],
    price: '$29-$49',
    link: null,
    officialUrl: null,
  },
  {
    name: 'Rectangle',
    platform: 'macOS',
    rating: 4.3,
    description: 'Open-source window management',
    features: [
      'Window snapping',
      'Keyboard shortcuts',
      'Multiple layouts',
      'Open source',
      'Free',
    ],
    pros: ['Free', 'Open source', 'Simple'],
    cons: ['Limited features', 'No always-on-top', 'Basic interface'],
    price: 'Free',
    link: null,
    officialUrl: null,
  },
];

const faqItems = [
  {
    question: 'What is an "always-on-top" app?',
    answer:
      'An always-on-top app allows you to pin any window so it stays visible above all other windows. This is perfect for keeping reference materials, video calls, or monitoring apps visible while working in other applications.',
  },
  {
    question: 'Are window managers safe to use?',
    answer:
      'Yes, most window managers are safe. However, choose reputable apps from official websites or app stores. TopWindow is particularly privacy-focused with no data collection or internet access required for core functionality.',
  },
  {
    question: 'Do window managers slow down your computer?',
    answer:
      'Well-designed window managers have minimal performance impact. Native apps like TopWindow use system resources efficiently. Apps built with web technologies (Electron) may use more memory and battery.',
  },
  {
    question: 'Can I use multiple window managers together?',
    answer:
      "It's possible but not recommended. Multiple window managers can conflict with each other. Choose one that meets all your needs for the best experience.",
  },
  {
    question:
      "What's the difference between window snapping and always-on-top?",
    answer:
      "Window snapping automatically arranges windows in predefined positions or layouts. Always-on-top keeps a specific window visible above all others regardless of where it's positioned.",
  },
  {
    question: 'Do I need to pay for window management software?',
    answer:
      'Not necessarily. There are excellent free options like Rectangle (macOS) and PowerToys (Windows). Premium apps like TopWindow offer additional features and support with free trials available.',
  },
];

export default function TopWindowsPage() {
  return (
    <main className='min-h-screen bg-white'>
      {/* Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline:
              'Top Windows - Best Always-On-Top Apps & Window Managers 2024',
            description:
              'Comprehensive guide to the best window management apps for Mac and Windows',
            author: {
              '@type': 'Organization',
              name: 'TopWindow Team',
            },
            datePublished: '2024-01-01',
            dateModified: '2024-01-01',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://topwindow.app/top-windows/',
            },
          }),
        }}
      />

      {/* Structured Data for Software List */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Best Window Management Software',
            description:
              'Top-rated window management applications for Mac and Windows',
            numberOfItems: windowManagers.length,
            itemListElement: windowManagers.map((manager, index) => ({
              '@type': 'SoftwareApplication',
              position: index + 1,
              name: manager.name,
              operatingSystem: manager.platform,
              applicationCategory: 'UtilityApplication',
              description: manager.description,
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: manager.rating,
                worstRating: 1,
                bestRating: 5,
              },
              offers: {
                '@type': 'Offer',
                price: manager.price,
                availability: 'https://schema.org/InStock',
              },
            })),
          }),
        }}
      />

      {/* Hero Section */}
      <section className='py-20 bg-gradient-to-br from-blue-50 to-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
              Top Windows: Best{' '}
              <span className='text-primary'>Always-On-Top Apps</span> & Window
              Managers
            </h1>

            <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
              Complete guide to the best window management solutions for Mac and
              Windows in 2024. Compare features, pricing, and performance to
              find the perfect tool for your workflow.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href='/download'
                className='inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium'
              >
                <Download size={20} />
                Try TopWindow Free
              </Link>

              <Link
                href='#comparison'
                className='inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium'
              >
                <Monitor size={20} />
                Compare Tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='grid md:grid-cols-4 gap-8 text-center'>
              <div>
                <div className='text-3xl font-bold text-primary mb-2'>6+</div>
                <div className='text-gray-600'>Tools Compared</div>
              </div>
              <div>
                <div className='text-3xl font-bold text-primary mb-2'>2</div>
                <div className='text-gray-600'>Platforms</div>
              </div>
              <div>
                <div className='text-3xl font-bold text-primary mb-2'>Free</div>
                <div className='text-gray-600'>Options Available</div>
              </div>
              <div>
                <div className='text-3xl font-bold text-primary mb-2'>2024</div>
                <div className='text-gray-600'>Updated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id='comparison' className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold mb-4'>
                Window Management Software Comparison
              </h2>
              <p className='text-gray-600 max-w-2xl mx-auto'>
                Side-by-side comparison of the top window management tools for
                Mac and Windows. Features, pricing, and user ratings at a
                glance.
              </p>
            </div>

            <div className='space-y-6'>
              {windowManagers.map((manager, index) => (
                <div
                  key={manager.name}
                  className={`bg-white border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all ${
                    manager.name === 'TopWindow'
                      ? 'border-primary ring-4 ring-primary/10'
                      : 'border-gray-200'
                  }`}
                >
                  <div className='flex flex-col lg:flex-row lg:items-start gap-6'>
                    {/* Header */}
                    <div className='flex-shrink-0'>
                      <div className='flex items-center gap-3 mb-2'>
                        <h3 className='text-2xl font-bold text-gray-900'>
                          {manager.name}
                        </h3>
                        {manager.name === 'TopWindow' && (
                          <span className='bg-primary text-white text-xs px-2 py-1 rounded-full font-medium'>
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className='flex items-center gap-4 text-sm text-gray-600 mb-3'>
                        <span className='bg-gray-100 px-2 py-1 rounded'>
                          {manager.platform}
                        </span>
                        <div className='flex items-center gap-1'>
                          <Star
                            size={16}
                            className='fill-yellow-400 text-yellow-400'
                          />
                          <span className='font-medium'>{manager.rating}</span>
                        </div>
                        <span className='font-medium text-primary'>
                          {manager.price}
                        </span>
                      </div>
                      <p className='text-gray-700 mb-4'>
                        {manager.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className='flex-1'>
                      <h4 className='font-semibold mb-3'>Key Features:</h4>
                      <ul className='space-y-2 mb-4'>
                        {manager.features.map((feature, idx) => (
                          <li key={idx} className='flex items-center gap-2'>
                            <CheckCircle
                              size={16}
                              className='text-green-500 flex-shrink-0'
                            />
                            <span className='text-gray-700'>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className='grid sm:grid-cols-2 gap-4 mb-4'>
                        <div>
                          <h5 className='font-medium text-green-600 mb-1'>
                            Pros:
                          </h5>
                          <ul className='text-sm text-gray-600 space-y-1'>
                            {manager.pros.map((pro, idx) => (
                              <li key={idx}>• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        {manager.cons.length > 0 && (
                          <div>
                            <h5 className='font-medium text-red-600 mb-1'>
                              Cons:
                            </h5>
                            <ul className='text-sm text-gray-600 space-y-1'>
                              {manager.cons.map((con, idx) => (
                                <li key={idx}>• {con}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {manager.link && (
                        <Link
                          href={manager.link}
                          className='inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium'
                        >
                          Learn More
                          <ArrowRight size={16} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TopWindow Benefits */}
      <section className='py-16 bg-gradient-to-br from-primary/5 to-blue-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>
              Why Choose TopWindow for Always-On-Top?
            </h2>
            <p className='text-gray-600'>
              Native macOS performance with privacy-first design
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                <Zap size={28} className='text-blue-600' />
              </div>
              <h3 className='text-xl font-semibold mb-4'>Native Performance</h3>
              <p className='text-gray-600'>
                Built with Swift for macOS. No battery drain, no lag, just
                instant window management when you need it.
              </p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                <Shield size={28} className='text-green-600' />
              </div>
              <h3 className='text-xl font-semibold mb-4'>Privacy First</h3>
              <p className='text-gray-600'>
                No data collection, no internet access required. Your window
                management stays completely private and secure.
              </p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                <Users size={28} className='text-purple-600' />
              </div>
              <h3 className='text-xl font-semibold mb-4'>User Friendly</h3>
              <p className='text-gray-600'>
                Simple interface with powerful features. Start using immediately
                with the default ⌥⌘P hotkey.
              </p>
            </div>
          </div>

          <div className='text-center mt-12'>
            <Link
              href='/download'
              className='inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary-dark transition-colors font-medium text-lg'
            >
              Download TopWindow
              <Download size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold mb-4'>
                Frequently Asked Questions
              </h2>
              <p className='text-gray-600'>
                Common questions about window management and always-on-top apps
              </p>
            </div>

            <div className='space-y-6'>
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className='bg-gray-50 border border-gray-200 rounded-xl p-6'
                >
                  <div className='flex items-start gap-3'>
                    <HelpCircle
                      size={20}
                      className='text-primary flex-shrink-0 mt-1'
                    />
                    <div>
                      <h3 className='text-lg font-semibold mb-3'>
                        {item.question}
                      </h3>
                      <p className='text-gray-700 leading-relaxed'>
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className='py-16 bg-gradient-to-br from-primary to-blue-600 text-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-2xl mx-auto text-center'>
            <h2 className='text-3xl font-bold mb-4'>
              Ready to Transform Your Window Management?
            </h2>
            <p className='text-blue-100 mb-8 text-lg'>
              Join thousands of Mac users who've improved their productivity
              with TopWindow. Free trial, no credit card required.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href='/download'
                className='inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg'
              >
                <Download size={20} />
                Download Free Trial
              </Link>

              <Link
                href='/pricing'
                className='inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors font-medium text-lg'
              >
                View Pricing
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
