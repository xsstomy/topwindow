import type { Metadata } from 'next';
import {
  ArrowLeft,
  Keyboard,
  Command,
  Settings,
  Zap,
  PlayCircle,
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Hotkeys for Always on Top on Mac | TopWindow',
  description:
    "Customize hotkeys to keep a window always on top on macOS. Use ⌥⌘P to pin or unpin instantly and boost productivity.",
  keywords: [
    'always on top hotkey mac',
    'macOS window hotkeys',
    'pin window keyboard shortcut',
    'keep window on top mac shortcut',
    'TopWindow hotkeys',
  ],
  openGraph: {
    title: 'Hotkeys for Always on Top on Mac – TopWindow',
    description:
      'Pin or unpin any window with ⌥⌘P. Customize shortcuts for faster always-on-top workflow on macOS.',
    type: 'article',
  },
  alternates: {
    canonical: '/features/hotkeys/',
  },
};

export default function HotkeysPage() {
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
      <section className='py-20 bg-gradient-to-br from-purple-50 to-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6'>
              <Keyboard size={16} />
              Productivity Feature
            </div>

            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
              Hotkeys for{' '}
              <span className='text-primary'>Always on Top</span> on Mac
            </h1>

            <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
              Pin and unpin windows instantly with customizable hotkeys.
              TopWindow's keyboard shortcuts make window management effortless,
              keeping your hands on the keyboard and your workflow
              uninterrupted.
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
                <Command size={20} />
                See It in Action
              </button>
            </div>

            {/* Default Hotkey Showcase */}
            <div className='bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto'>
              <div className='text-sm text-gray-500 mb-2'>Default Hotkey</div>
              <div className='flex items-center justify-center gap-3 mb-4'>
                <kbd className='px-4 py-3 bg-gray-100 rounded-lg font-mono text-lg font-bold shadow-sm'>
                  ⌥
                </kbd>
                <span className='text-gray-400 text-2xl'>+</span>
                <kbd className='px-4 py-3 bg-gray-100 rounded-lg font-mono text-lg font-bold shadow-sm'>
                  ⌘
                </kbd>
                <span className='text-gray-400 text-2xl'>+</span>
                <kbd className='px-4 py-3 bg-gray-100 rounded-lg font-mono text-lg font-bold shadow-sm'>
                  P
                </kbd>
              </div>
              <p className='text-gray-600'>
                Press to pin/unpin any active window
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Shortcuts */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Always‑on‑Top Hotkeys
            </h2>

            <div className='grid md:grid-cols-2 gap-8'>
              <div className='bg-white p-8 rounded-2xl shadow-lg border border-gray-100'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                    <Zap className='text-blue-600' size={24} />
                  </div>
                  <h3 className='text-xl font-bold'>Pin/Unpin Window</h3>
                </div>

                <div className='flex items-center gap-2 mb-4'>
                  <kbd className='px-3 py-2 bg-gray-100 rounded font-mono'>
                    ⌥
                  </kbd>
                  <span>+</span>
                  <kbd className='px-3 py-2 bg-gray-100 rounded font-mono'>
                    ⌘
                  </kbd>
                  <span>+</span>
                  <kbd className='px-3 py-2 bg-gray-100 rounded font-mono'>
                    P
                  </kbd>
                </div>

                <p className='text-gray-600 mb-4'>
                  Toggle the always-on-top state of the currently active window.
                  Press once to pin, press again to unpin.
                </p>

                <div className='text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg'>
                  ✓ Works system-wide with any application
                </div>
              </div>

              <div className='bg-white p-8 rounded-2xl shadow-lg border border-gray-100'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                    <Settings className='text-green-600' size={24} />
                  </div>
                  <h3 className='text-xl font-bold'>Quick Menu Access</h3>
                </div>

                <div className='flex items-center gap-2 mb-4'>
                  <kbd className='px-3 py-2 bg-gray-100 rounded font-mono'>
                    ⌥
                  </kbd>
                  <span>+</span>
                  <kbd className='px-3 py-2 bg-gray-100 rounded font-mono'>
                    ⌘
                  </kbd>
                  <span>+</span>
                  <kbd className='px-3 py-2 bg-gray-100 rounded font-mono'>
                    M
                  </kbd>
                </div>

                <p className='text-gray-600 mb-4'>
                  Open TopWindow's menu to see all pinned windows, manage
                  settings, and access additional features.
                </p>

                <div className='text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg'>
                  ✓ Quick access to all features
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customization */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Customize Always‑on‑Top Hotkeys
            </h2>

            <div className='bg-white p-8 rounded-2xl shadow-lg'>
              <div className='grid lg:grid-cols-2 gap-8 items-center'>
                <div>
                  <h3 className='text-2xl font-semibold mb-4'>
                    Make It Your Own
                  </h3>
                  <p className='text-gray-600 mb-6 leading-relaxed'>
                    TopWindow lets you customize keyboard shortcuts to match
                    your workflow. Change the default hotkey, add new shortcuts,
                    or disable them entirely if you prefer menu-only access.
                  </p>

                  <div className='space-y-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 bg-primary rounded-full'></div>
                      <span className='text-gray-700'>
                        Conflict detection with system shortcuts
                      </span>
                    </div>

                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 bg-primary rounded-full'></div>
                      <span className='text-gray-700'>
                        Support for function keys and modifier combinations
                      </span>
                    </div>

                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 bg-primary rounded-full'></div>
                      <span className='text-gray-700'>
                        Import/export hotkey configurations
                      </span>
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 p-6 rounded-xl'>
                  <div className='text-sm text-gray-500 mb-4'>
                    Custom Hotkey Examples
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-3 bg-white rounded-lg'>
                      <span className='text-sm text-gray-600'>Pin Window</span>
                      <div className='flex items-center gap-1'>
                        <kbd className='px-2 py-1 bg-gray-100 rounded text-xs'>
                          ⌃
                        </kbd>
                        <kbd className='px-2 py-1 bg-gray-100 rounded text-xs'>
                          ⌘
                        </kbd>
                        <kbd className='px-2 py-1 bg-gray-100 rounded text-xs'>
                          T
                        </kbd>
                      </div>
                    </div>

                    <div className='flex items-center justify-between p-3 bg-white rounded-lg'>
                      <span className='text-sm text-gray-600'>Quick Menu</span>
                      <div className='flex items-center gap-1'>
                        <kbd className='px-2 py-1 bg-gray-100 rounded text-xs'>
                          F12
                        </kbd>
                      </div>
                    </div>

                    <div className='flex items-center justify-between p-3 bg-white rounded-lg'>
                      <span className='text-sm text-gray-600'>Unpin All</span>
                      <div className='flex items-center gap-1'>
                        <kbd className='px-2 py-1 bg-gray-100 rounded text-xs'>
                          ⌥
                        </kbd>
                        <kbd className='px-2 py-1 bg-gray-100 rounded text-xs'>
                          ⌘
                        </kbd>
                        <kbd className='px-2 py-1 bg-gray-100 rounded text-xs'>
                          ⌫
                        </kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productivity Tips */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Always‑on‑Top Productivity Tips
            </h2>

            <div className='grid md:grid-cols-3 gap-8'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <span className='text-2xl'>⚡</span>
                </div>
                <h3 className='text-xl font-semibold mb-4'>Muscle Memory</h3>
                <p className='text-gray-600'>
                  Use the same hotkey consistently to build muscle memory. After
                  a few days, pinning windows becomes second nature.
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <span className='text-2xl'>🎯</span>
                </div>
                <h3 className='text-xl font-semibold mb-4'>
                  Context Switching
                </h3>
                <p className='text-gray-600'>
                  Pin reference materials when starting a task. Keep them
                  visible while you switch between other apps.
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <span className='text-2xl'>🔄</span>
                </div>
                <h3 className='text-xl font-semibold mb-4'>Quick Toggle</h3>
                <p className='text-gray-600'>
                  Remember that the same hotkey pins and unpins. Quickly toggle
                  window states without accessing menus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Examples */}
      <section className='py-16 bg-gradient-to-br from-blue-50 to-purple-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>
              Common Workflow Examples
            </h2>

            <div className='space-y-8'>
              <div className='bg-white p-8 rounded-2xl shadow-lg'>
                <div className='flex items-start gap-6'>
                  <div className='flex-shrink-0'>
                    <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
                      <span className='text-xl'>👩‍💻</span>
                    </div>
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-xl font-semibold mb-3'>
                      Developer Workflow
                    </h3>
                    <div className='text-gray-600 space-y-2'>
                      <p>
                        <strong>1.</strong> Open documentation in Safari
                      </p>
                      <p>
                        <strong>2.</strong> Press{' '}
                        <kbd className='px-2 py-1 bg-gray-100 rounded font-mono'>
                          ⌥⌘P
                        </kbd>{' '}
                        to pin it
                      </p>
                      <p>
                        <strong>3.</strong> Switch to VS Code and start coding
                      </p>
                      <p>
                        <strong>4.</strong> Reference docs remain visible above
                        your code
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-white p-8 rounded-2xl shadow-lg'>
                <div className='flex items-start gap-6'>
                  <div className='flex-shrink-0'>
                    <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                      <span className='text-xl'>📊</span>
                    </div>
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-xl font-semibold mb-3'>
                      Data Analysis Workflow
                    </h3>
                    <div className='text-gray-600 space-y-2'>
                      <p>
                        <strong>1.</strong> Open analytics dashboard
                      </p>
                      <p>
                        <strong>2.</strong> Pin with{' '}
                        <kbd className='px-2 py-1 bg-gray-100 rounded font-mono'>
                          ⌥⌘P
                        </kbd>{' '}
                        to monitor metrics
                      </p>
                      <p>
                        <strong>3.</strong> Work in Excel/Numbers while watching
                        data
                      </p>
                      <p>
                        <strong>4.</strong> Quickly spot changes without
                        switching apps
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-white p-8 rounded-2xl shadow-lg'>
                <div className='flex items-start gap-6'>
                  <div className='flex-shrink-0'>
                    <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                      <span className='text-xl'>🎥</span>
                    </div>
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-xl font-semibold mb-3'>
                      Meeting + Work Workflow
                    </h3>
                    <div className='text-gray-600 space-y-2'>
                      <p>
                        <strong>1.</strong> Join video call in Zoom/Teams
                      </p>
                      <p>
                        <strong>2.</strong> Pin the call window with{' '}
                        <kbd className='px-2 py-1 bg-gray-100 rounded font-mono'>
                          ⌥⌘P
                        </kbd>
                      </p>
                      <p>
                        <strong>3.</strong> Continue working in other apps
                      </p>
                      <p>
                        <strong>4.</strong> Stay engaged in meeting while
                        multitasking
                      </p>
                    </div>
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
              Always‑on‑Top Hotkey Questions
            </h2>

            <div className='space-y-6'>
              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>
                  Can I change the default hotkey?
                </h3>
                <p className='text-gray-600 text-sm'>
                  Yes! TopWindow allows full hotkey customization. Access
                  preferences through the menu bar and set any key combination
                  that doesn't conflict with system shortcuts.
                </p>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>
                  What if my hotkey conflicts with another app?
                </h3>
                <p className='text-gray-600 text-sm'>
                  TopWindow detects conflicts and will warn you. You can either
                  choose a different combination or disable the conflicting
                  app's shortcut if TopWindow's functionality is more important.
                </p>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>
                  Do hotkeys work in all applications?
                </h3>
                <p className='text-gray-600 text-sm'>
                  Yes! TopWindow's hotkeys are registered system-wide and work
                  regardless of which application is currently active. This
                  ensures consistent behavior across your entire macOS
                  experience.
                </p>
              </div>

              <div className='bg-white p-6 rounded-xl shadow-sm'>
                <h3 className='font-semibold mb-2'>
                  Can I disable hotkeys completely?
                </h3>
                <p className='text-gray-600 text-sm'>
                  Absolutely. If you prefer using only the menu bar, you can
                  disable all keyboard shortcuts in TopWindow's preferences
                  while keeping full functionality through mouse interaction.
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
              Start Using Always‑on‑Top Hotkeys Today
            </h2>
            <p className='text-gray-600 mb-8'>
              Experience lightning-fast window management with TopWindow's
              customizable keyboard shortcuts.
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
