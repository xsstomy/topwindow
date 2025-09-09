import { generatePageMetadata } from '@/lib/page-metadata';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';

export const metadata = generatePageMetadata('pricing');

export default function PricingPage() {
  return (
    <main className='min-h-screen bg-white'>
      <section className='section-padding'>
        <div className='container-custom text-center mb-8'>
          <h1 className='heading-lg mb-4'>TopWindow Pricing</h1>
          <p className='text-body max-w-2xl mx-auto'>
            Keep any window always on top on macOS. Start with a 7-day free
            trial, then make a one-time purchase for a lifetime license.
          </p>
        </div>
        <PricingSection />
      </section>

      {/* SEO benefit section */}
      <section className='section-padding border-t border-gray-100'>
        <div className='container-custom'>
          <div className='max-w-5xl mx-auto'>
            <h2 className='heading-md mb-4'>Keep Any Window Always on Top on macOS</h2>
            <p className='text-gray-700 mb-6'>
              TopWindow helps you pin or float windows above others. Perfect for
              video calls, coding with docs open, note taking, stock monitors,
              and more.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='bg-gray-50 rounded-xl p-6 border border-gray-100'>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Always on Top for macOS
                </h3>
                <p className='text-sm text-gray-700'>
                  Keep window on top with one click or ⌥⌘P shortcut.
                </p>
              </div>
              <div className='bg-gray-50 rounded-xl p-6 border border-gray-100'>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Pin or Float Any App
                </h3>
                <p className='text-sm text-gray-700'>
                  Pin window on top on Mac for browsers, IDEs, chat apps, and more.
                </p>
              </div>
              <div className='bg-gray-50 rounded-xl p-6 border border-gray-100'>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Lightweight & Fast
                </h3>
                <p className='text-sm text-gray-700'>
                  Minimal resource usage, native feel, and reliable performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className='section-padding pt-0'>
        <div className='container-custom'>
          <div className='max-w-5xl mx-auto'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Popular Use Cases</h2>
            <ul className='list-disc pl-6 text-gray-700 space-y-2'>
              <li>Keep meeting notes always on top during video calls</li>
              <li>Float reference docs while coding in Xcode or VS Code</li>
              <li>Pin timers, stock tickers, or music players above other apps</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
