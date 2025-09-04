import { generatePageMetadata } from '@/lib/page-metadata';
import { generateFAQStructuredData } from '@/lib/faq-structured-data';
import {
  HelpCircle,
  Download,
  Settings,
  Shield,
  CreditCard,
  Monitor,
} from 'lucide-react';

export const metadata = generatePageMetadata('faq');

const faqData = {
  general: [
    {
      question: 'What is TopWindow?',
      answer:
        "TopWindow is a macOS application that allows you to keep any window always on top of other windows. It's perfect for keeping reference materials, video calls, or monitoring tools visible while working with other applications.",
    },
    {
      question: 'Is TopWindow free?',
      answer:
        'TopWindow offers a 7-day free trial with full professional features. After the trial period, you can purchase a one-time professional license for lifetime usage. There are no subscription fees.',
    },
    {
      question: 'What macOS versions are supported?',
      answer:
        'TopWindow requires macOS 13.0 (Ventura) or later. It works on both Intel and Apple Silicon Macs.',
    },
    {
      question: 'How do I pin a window to always stay on top?',
      answer:
        'Simply click on the window you want to pin and press ⌘⌥P (Command + Option + P). You can also use the menu bar icon to access pinning options.',
    },
  ],
  installation: [
    {
      question: 'How do I install TopWindow?',
      answer:
        'Download the DMG file from our website, open it, and drag TopWindow to your Applications folder. Then launch it from Applications and grant the required accessibility permissions.',
    },
    {
      question: 'Why does macOS ask for accessibility permissions?',
      answer:
        'TopWindow needs accessibility permissions to detect active windows and apply the always-on-top functionality. This is required for the app to work properly and is completely safe.',
    },
    {
      question: "The app won't open after installation. What should I do?",
      answer:
        "Make sure you're running macOS 13.0 or later. If the issue persists, right-click on TopWindow in Applications and select 'Open' to bypass Gatekeeper restrictions.",
    },
    {
      question: 'Can I install TopWindow on multiple Macs?',
      answer:
        'Yes, you can install TopWindow on multiple Macs with a valid license. Each installation requires a proper license for commercial or multi-device use.',
    },
  ],
  usage: [
    {
      question: 'How do I unpin a window?',
      answer:
        'Press the same shortcut (⌘⌥P) on the pinned window to unpin it, or use the menu bar icon to manage pinned windows.',
    },
    {
      question: 'Can I pin multiple windows at once?',
      answer:
        'Yes, TopWindow supports pinning and managing multiple windows simultaneously.',
    },
    {
      question: 'Will pinned windows stay on top of full-screen applications?',
      answer:
        'Most full-screen applications will hide pinned windows. However, windowed full-screen mode (not true full-screen) will respect the always-on-top setting.',
    },
    {
      question: 'Can I customize the keyboard shortcuts?',
      answer:
        'Yes, you can customize keyboard shortcuts in TopWindow preferences. Access preferences through the menu bar icon or by pressing ⌘, (Command + Comma).',
    },
    {
      question: 'Does TopWindow work with all applications?',
      answer:
        'TopWindow works with the vast majority of macOS applications. Some system dialogs and security-sensitive applications may not support always-on-top functionality.',
    },
  ],
  troubleshooting: [
    {
      question: "TopWindow shortcuts aren't working. What's wrong?",
      answer:
        'First, ensure TopWindow has accessibility permissions in System Preferences > Privacy & Security > Accessibility. Also check if your shortcuts conflict with other applications and consider customizing them in TopWindow preferences.',
    },
    {
      question: "I don't see the TopWindow menu bar icon. Where is it?",
      answer:
        'The icon might be hidden in the menu bar overflow area. Try expanding your menu bar or check if TopWindow is running in Activity Monitor. If not running, launch it from Applications.',
    },
    {
      question: "A window isn't staying on top even after pinning. Why?",
      answer:
        'Some applications have their own window management that may override always-on-top. Try pinning a different window first to test if TopWindow is working. Certain system windows cannot be pinned for security reasons.',
    },
    {
      question: 'TopWindow is using too much CPU. Is this normal?',
      answer:
        'TopWindow should use minimal CPU when not actively pinning/unpinning windows. If you notice high CPU usage, try restarting the app. Contact support if the issue persists.',
    },
    {
      question: 'How do I completely uninstall TopWindow?',
      answer:
        'Drag TopWindow from Applications to Trash, then empty the Trash. You may also want to remove preferences by deleting ~/Library/Preferences/com.topwindow.mac.plist',
    },
  ],
  privacy: [
    {
      question: 'Does TopWindow collect any personal data?',
      answer:
        'No, TopWindow does not collect, store, or transmit any personal data. It operates entirely on your local machine and respects your privacy.',
    },
    {
      question: 'Why does TopWindow need accessibility permissions?',
      answer:
        "Accessibility permissions allow TopWindow to detect which window is active and apply the always-on-top functionality. This permission is used solely for the app's core features and nothing else.",
    },
    {
      question: 'Can TopWindow see the content of my windows?',
      answer:
        'No, TopWindow only detects window properties (like title and position) necessary for its functionality. It cannot see or access the actual content within your windows.',
    },
  ],
};

interface FAQSectionProps {
  title: string;
  icon: React.ComponentType<any>;
  questions: Array<{ question: string; answer: string }>;
}

function FAQSection({ title, icon: Icon, questions }: FAQSectionProps) {
  return (
    <div className='mb-12'>
      <div className='flex items-center gap-3 mb-8'>
        <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
          <Icon className='w-5 h-5 text-primary' />
        </div>
        <h2 className='text-2xl font-semibold text-gray-900'>{title}</h2>
      </div>

      <div className='space-y-4'>
        {questions.map((faq, index) => (
          <details
            key={index}
            className='group bg-white border border-gray-200 rounded-xl p-6'
          >
            <summary className='cursor-pointer font-medium text-gray-900 hover:text-primary flex items-center gap-3'>
              <HelpCircle className='w-5 h-5 text-gray-400 group-open:text-primary flex-shrink-0' />
              {faq.question}
            </summary>
            <div className='mt-4 ml-8 text-gray-600 leading-relaxed'>
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function FAQPage() {
  const faqStructuredData = generateFAQStructuredData(faqData);

  return (
    <>
      {/* FAQ Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />

      <main className='min-h-screen bg-white'>
        <div className='container-custom section-padding'>
          {/* Header */}
          <div className='text-center mb-16'>
            <h1 className='heading-lg mb-4'>Frequently Asked Questions</h1>
            <p className='text-body max-w-2xl mx-auto'>
              Find answers to common questions about TopWindow. Can't find what
              you're looking for?
              <a
                href='mailto:xsstomy@gmail.com'
                className='text-primary hover:underline ml-1'
              >
                Contact our support team
              </a>
              .
            </p>
          </div>

          <div className='max-w-4xl mx-auto'>
            {/* General Questions */}
            <FAQSection
              title='General'
              icon={HelpCircle}
              questions={faqData.general}
            />

            {/* Installation */}
            <FAQSection
              title='Installation & Setup'
              icon={Download}
              questions={faqData.installation}
            />

            {/* Usage */}
            <FAQSection
              title='Using TopWindow'
              icon={Settings}
              questions={faqData.usage}
            />

            {/* Troubleshooting */}
            <FAQSection
              title='Troubleshooting'
              icon={Monitor}
              questions={faqData.troubleshooting}
            />

            {/* Privacy & Security */}
            <FAQSection
              title='Privacy & Security'
              icon={Shield}
              questions={faqData.privacy}
            />

            {/* Contact Support */}
            <div className='bg-gradient-to-r from-primary/10 to-blue-50 rounded-xl p-8 text-center mt-16'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Still Have Questions?
              </h2>
              <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
                Our support team is here to help. We typically respond within 24
                hours and are happy to assist with any issues or questions you
                might have.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <a href='mailto:xsstomy@gmail.com' className='btn-primary'>
                  Contact Support
                </a>
                <a href='/docs' className='btn-secondary'>
                  Read Documentation
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-6'>
              <a
                href='/docs'
                className='bg-white border border-gray-200 rounded-xl p-6 hover:border-primary transition-colors group'
              >
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors'>
                  <Settings className='w-6 h-6 text-primary' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Documentation
                </h3>
                <p className='text-gray-600 text-sm'>
                  Complete guide to using TopWindow
                </p>
              </a>

              <a
                href='/requirements'
                className='bg-white border border-gray-200 rounded-xl p-6 hover:border-primary transition-colors group'
              >
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors'>
                  <Monitor className='w-6 h-6 text-primary' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  System Requirements
                </h3>
                <p className='text-gray-600 text-sm'>
                  Check compatibility with your Mac
                </p>
              </a>

              <a
                href='#download'
                className='bg-white border border-gray-200 rounded-xl p-6 hover:border-primary transition-colors group'
              >
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors'>
                  <Download className='w-6 h-6 text-primary' />
                </div>
                <h3 className='font-semibold text-gray-900 mb-2'>Download</h3>
                <p className='text-gray-600 text-sm'>
                  Get TopWindow for your Mac
                </p>
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
