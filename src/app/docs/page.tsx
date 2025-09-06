import { generatePageMetadata } from '@/lib/page-metadata';
import { motion } from 'framer-motion';
import {
  Command,
  MousePointer,
  Settings,
  HelpCircle,
  Download,
  Keyboard,
} from 'lucide-react';
import Footer from '@/components/Footer';

export const metadata = generatePageMetadata('docs');

export default function DocumentationPage() {
  return (
    <main className='min-h-screen bg-white'>
      <div className='container-custom section-padding'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='heading-lg mb-4'>TopWindow Documentation</h1>
          <p className='text-body max-w-2xl mx-auto'>
            Everything you need to know about using TopWindow effectively on
            macOS.
          </p>
        </div>

        <div className='max-w-4xl mx-auto'>
          {/* Quick Start */}
          <section className='mb-16'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
                <Download className='w-5 h-5 text-primary' />
              </div>
              <h2 className='text-2xl font-semibold text-gray-900'>
                Getting Started
              </h2>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-gray-50 rounded-xl p-6'>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  Installation
                </h3>
                <ol className='space-y-2 text-gray-700'>
                  <li>1. Download TopWindow from our homepage</li>
                  <li>2. Open the downloaded DMG file</li>
                  <li>3. Drag TopWindow to Applications folder</li>
                  <li>4. Launch TopWindow from Applications</li>
                  <li>5. Grant accessibility permissions when prompted</li>
                </ol>
              </div>

              <div className='bg-gray-50 rounded-xl p-6'>
                <h3 className='font-semibold text-gray-900 mb-4'>First Use</h3>
                <ol className='space-y-2 text-gray-700'>
                  <li>1. Open any application window</li>
                  <li>
                    2. Press{' '}
                    <kbd className='px-2 py-1 bg-white rounded text-sm'>
                      ⌘⌥P
                    </kbd>
                  </li>
                  <li>3. The window is now always on top</li>
                  <li>4. Press the same shortcut to unpin</li>
                  <li>5. Access menu bar icon for more options</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section className='mb-16'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
                <Keyboard className='w-5 h-5 text-primary' />
              </div>
              <h2 className='text-2xl font-semibold text-gray-900'>
                Keyboard Shortcuts
              </h2>
            </div>

            <div className='bg-white border border-gray-200 rounded-xl overflow-hidden'>
              <div className='grid grid-cols-1 divide-y divide-gray-200'>
                <div className='p-6'>
                  <div className='flex justify-between items-center'>
                    <div>
                      <h3 className='font-semibold text-gray-900'>
                        Pin/Unpin Window
                      </h3>
                      <p className='text-gray-600 text-sm'>
                        Toggle always on top for active window
                      </p>
                    </div>
                    <kbd className='px-3 py-2 bg-gray-100 rounded-lg font-mono text-sm'>
                      ⌘⌥P
                    </kbd>
                  </div>
                </div>

                <div className='p-6'>
                  <div className='flex justify-between items-center'>
                    <div>
                      <h3 className='font-semibold text-gray-900'>
                        Open Preferences
                      </h3>
                      <p className='text-gray-600 text-sm'>
                        Access TopWindow settings
                      </p>
                    </div>
                    <kbd className='px-3 py-2 bg-gray-100 rounded-lg font-mono text-sm'>
                      ⌘,
                    </kbd>
                  </div>
                </div>

                <div className='p-6'>
                  <div className='flex justify-between items-center'>
                    <div>
                      <h3 className='font-semibold text-gray-900'>
                        Show All Pinned Windows
                      </h3>
                      <p className='text-gray-600 text-sm'>
                        View list of all pinned windows
                      </p>
                    </div>
                    <kbd className='px-3 py-2 bg-gray-100 rounded-lg font-mono text-sm'>
                      ⌘⌥L
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Guide */}
          <section className='mb-16'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
                <MousePointer className='w-5 h-5 text-primary' />
              </div>
              <h2 className='text-2xl font-semibold text-gray-900'>Features</h2>
            </div>

            <div className='space-y-8'>
              <div className='bg-white border border-gray-200 rounded-xl p-8'>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  Window Management
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <h4 className='font-medium text-gray-900 mb-2'>
                      Always on Top
                    </h4>
                    <p className='text-gray-600 text-sm mb-3'>
                      Keep any window above all others, perfect for reference
                      materials, video calls, or monitoring tools.
                    </p>
                    <ul className='text-gray-600 text-sm space-y-1'>
                      <li>• Works with any macOS application</li>
                      <li>• Visual indicator when window is pinned</li>
                      <li>• Easy toggle on/off functionality</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900 mb-2'>
                      Multiple Pinned Windows
                    </h4>
                    <p className='text-gray-600 text-sm mb-3'>
                      Pin and manage multiple windows simultaneously.
                    </p>
                    <ul className='text-gray-600 text-sm space-y-1'>
                      <li>• Pin multiple windows at the same time</li>
                      <li>• Manage all pinned windows from menu bar</li>
                      <li>• Easy window switching and organization</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className='bg-white border border-gray-200 rounded-xl p-8'>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  Menu Bar Integration
                </h3>
                <p className='text-gray-600 mb-4'>
                  Access TopWindow features directly from the macOS menu bar.
                </p>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='text-center p-4 bg-gray-50 rounded-lg'>
                    <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2'>
                      <Command className='w-4 h-4 text-primary' />
                    </div>
                    <h4 className='font-medium text-gray-900 mb-1'>
                      Quick Actions
                    </h4>
                    <p className='text-gray-600 text-xs'>
                      Pin/unpin current window
                    </p>
                  </div>
                  <div className='text-center p-4 bg-gray-50 rounded-lg'>
                    <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2'>
                      <Settings className='w-4 h-4 text-primary' />
                    </div>
                    <h4 className='font-medium text-gray-900 mb-1'>
                      Preferences
                    </h4>
                    <p className='text-gray-600 text-xs'>
                      Customize shortcuts and behavior
                    </p>
                  </div>
                  <div className='text-center p-4 bg-gray-50 rounded-lg'>
                    <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2'>
                      <MousePointer className='w-4 h-4 text-primary' />
                    </div>
                    <h4 className='font-medium text-gray-900 mb-1'>
                      Window List
                    </h4>
                    <p className='text-gray-600 text-xs'>
                      View all pinned windows
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section className='mb-16'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
                <HelpCircle className='w-5 h-5 text-primary' />
              </div>
              <h2 className='text-2xl font-semibold text-gray-900'>
                Troubleshooting
              </h2>
            </div>

            <div className='space-y-6'>
              <div className='bg-white border border-gray-200 rounded-xl p-6'>
                <h3 className='font-semibold text-gray-900 mb-3'>
                  TopWindow Not Working?
                </h3>
                <div className='space-y-4'>
                  <div>
                    <h4 className='font-medium text-gray-900 mb-2'>
                      Check Accessibility Permissions
                    </h4>
                    <ol className='text-gray-600 text-sm space-y-1 ml-4'>
                      <li>1. Open System Preferences → Privacy & Security</li>
                      <li>2. Click "Accessibility" in the sidebar</li>
                      <li>3. Ensure TopWindow is listed and enabled</li>
                      <li>4. If not listed, click + and add TopWindow</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className='font-medium text-gray-900 mb-2'>
                      Shortcuts Not Working
                    </h4>
                    <ul className='text-gray-600 text-sm space-y-1 ml-4'>
                      <li>• Check if shortcuts conflict with other apps</li>
                      <li>
                        • Try customizing shortcuts in TopWindow preferences
                      </li>
                      <li>• Ensure TopWindow is running (check menu bar)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className='bg-white border border-gray-200 rounded-xl p-6'>
                <h3 className='font-semibold text-gray-900 mb-3'>
                  Common Issues
                </h3>
                <div className='space-y-3'>
                  <details className='group'>
                    <summary className='cursor-pointer font-medium text-gray-900 hover:text-primary'>
                      Window doesn't stay on top
                    </summary>
                    <p className='text-gray-600 text-sm mt-2 ml-4'>
                      Some applications (like full-screen games) may override
                      the always-on-top behavior. Try using windowed mode or
                      check if the application has its own always-on-top
                      setting.
                    </p>
                  </details>

                  <details className='group'>
                    <summary className='cursor-pointer font-medium text-gray-900 hover:text-primary'>
                      Menu bar icon missing
                    </summary>
                    <p className='text-gray-600 text-sm mt-2 ml-4'>
                      Check if TopWindow is running in Activity Monitor. If not,
                      launch it from Applications. The icon may be hidden in the
                      menu bar overflow area on smaller screens.
                    </p>
                  </details>

                  <details className='group'>
                    <summary className='cursor-pointer font-medium text-gray-900 hover:text-primary'>
                      App crashes on launch
                    </summary>
                    <p className='text-gray-600 text-sm mt-2 ml-4'>
                      Ensure you're running macOS 13.0 or later. Try restarting
                      your Mac and launching TopWindow again. If issues persist,
                      contact support.
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </section>

          {/* Support Links */}
          <section className='bg-gray-50 rounded-xl p-8 text-center'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Need More Help?
            </h2>
            <p className='text-gray-600 mb-6'>
              Can't find what you're looking for? We're here to help.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a href='/faq' className='btn-secondary'>
                Browse FAQ
              </a>
              <a href='mailto:xsstomy@gmail.com' className='btn-primary'>
                Contact Support
              </a>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
