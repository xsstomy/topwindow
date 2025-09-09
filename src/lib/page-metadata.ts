import { Metadata } from 'next';
import { siteConfig } from './metadata';

export const pageMetadata = {
  pricing: {
    title:
      'TopWindow Pricing – Always on Top for macOS | Lifetime License',
    description:
      'Simple pricing for TopWindow, the macOS always-on-top utility. One-time purchase for a lifetime license. Try free for 7 days, then unlock all professional features.',
    keywords: [
      ...siteConfig.keywords,
      'TopWindow pricing',
      'buy TopWindow',
      'TopWindow license',
      'macOS utility price',
      'always on top mac price',
      'keep window on top mac pricing',
      'pin window on top mac cost',
    ] as string[],
    openGraph: {
      title: 'TopWindow Pricing – Lifetime License for macOS',
      description:
        'Always on Top for macOS. One-time purchase, lifetime usage. Free 7-day trial, then upgrade to unlock professional features.',
      url: `${siteConfig.url}/pricing`,
    },
  },
  download: {
    title: 'Download TopWindow - Free macOS Window Management Tool',
    description:
      'Download TopWindow for macOS. Keep any window always on top with one click or ⌥⌘P shortcut. Free download with instant setup.',
    keywords: [
      ...siteConfig.keywords,
      'download TopWindow',
      'mac window always on top download',
      'topmost window mac download',
      'macOS window utility download',
      'free macOS app',
    ] as string[],
    openGraph: {
      title: 'Download TopWindow - Free macOS Window Management',
      description:
        'Get TopWindow for macOS now. Professional window management with one-click pinning and keyboard shortcuts.',
      url: `${siteConfig.url}/download`,
    },
  },

  faq: {
    title: 'TopWindow FAQ - Common Questions About macOS Window Management',
    description:
      'Find answers to common questions about TopWindow. Learn how to use window pinning, keyboard shortcuts, and troubleshooting tips.',
    keywords: [
      ...siteConfig.keywords,
      'TopWindow FAQ',
      'window management help',
      'macOS help',
      'troubleshooting',
    ] as string[],
    openGraph: {
      title: 'TopWindow FAQ - Get Help with Window Management',
      description:
        'Common questions and answers about TopWindow window management for macOS.',
      url: `${siteConfig.url}/faq`,
    },
  },

  docs: {
    title: 'TopWindow Documentation - Complete User Guide for macOS',
    description:
      'Complete documentation for TopWindow. Learn all features, keyboard shortcuts, preferences, and advanced window management techniques.',
    keywords: [
      ...siteConfig.keywords,
      'TopWindow documentation',
      'user guide',
      'macOS window management guide',
      'how to use',
    ] as string[],
    openGraph: {
      title: 'TopWindow Documentation - Complete User Guide',
      description:
        'Learn everything about TopWindow window management for macOS with our complete documentation.',
      url: `${siteConfig.url}/docs`,
    },
  },

  releases: {
    title: 'TopWindow Release Notes - Latest Updates and Features',
    description:
      'View all TopWindow releases and updates. See new features, bug fixes, and improvements for macOS window management.',
    keywords: [
      ...siteConfig.keywords,
      'TopWindow updates',
      'release notes',
      'changelog',
      'new features',
    ] as string[],
    openGraph: {
      title: 'TopWindow Release Notes - Latest Updates',
      description:
        'Stay updated with the latest TopWindow features and improvements for macOS.',
      url: `${siteConfig.url}/releases`,
    },
  },

  requirements: {
    title: 'TopWindow System Requirements - macOS Compatibility',
    description:
      'Check TopWindow system requirements for macOS. Compatible with macOS 13.0+ on Intel and Apple Silicon Macs.',
    keywords: [
      ...siteConfig.keywords,
      'system requirements',
      'macOS compatibility',
      'Apple Silicon',
      'Intel Mac',
    ] as string[],
    openGraph: {
      title: 'TopWindow System Requirements',
      description:
        'System requirements and compatibility information for TopWindow on macOS.',
      url: `${siteConfig.url}/requirements`,
    },
  },

  privacy: {
    title: 'Privacy Policy - TopWindow macOS App',
    description:
      'TopWindow privacy policy. We prioritize your privacy with no data collection or tracking in our macOS window management app.',
    keywords: [
      ...siteConfig.keywords,
      'privacy policy',
      'no tracking',
      'data protection',
      'macOS privacy',
    ] as string[],
    openGraph: {
      title: 'TopWindow Privacy Policy',
      description:
        'Learn about our privacy-first approach. No data collection or tracking.',
      url: `${siteConfig.url}/privacy`,
    },
  },

  terms: {
    title: 'Terms of Service - TopWindow macOS App',
    description:
      'Terms of service for TopWindow macOS window management application. Free to use with clear usage guidelines.',
    keywords: [
      ...siteConfig.keywords,
      'terms of service',
      'license agreement',
      'usage terms',
    ] as string[],
    openGraph: {
      title: 'TopWindow Terms of Service',
      description: 'Terms of service and usage guidelines for TopWindow.',
      url: `${siteConfig.url}/terms`,
    },
  },

  refunds: {
    title: 'Refund Policy - TopWindow Support',
    description:
      'TopWindow refund policy and support information. Get help with billing questions and refund requests.',
    keywords: [
      ...siteConfig.keywords,
      'refund policy',
      'billing support',
      'customer service',
    ] as string[],
    openGraph: {
      title: 'TopWindow Refund Policy',
      description: 'Refund policy and billing support for TopWindow users.',
      url: `${siteConfig.url}/refunds`,
    },
  },
} as const;

export function generatePageMetadata(
  page: keyof typeof pageMetadata
): Metadata {
  const pageData = pageMetadata[page];

  return {
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords,
    alternates: {
      canonical: pageData.openGraph.url,
    },
    openGraph: {
      ...pageData.openGraph,
      type: 'website',
      locale: 'en_US',
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImagePng,
          width: 1200,
          height: 630,
          alt: pageData.openGraph.title,
        },
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: pageData.openGraph.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.openGraph.title,
      description: pageData.openGraph.description,
      images: [siteConfig.ogImagePng, siteConfig.ogImage],
    },
  };
}
