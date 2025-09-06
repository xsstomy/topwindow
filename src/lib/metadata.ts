import { Metadata } from 'next';

export const siteConfig = {
  name: 'TopWindow',
  title:
    'TopWindow – Keep Windows Always on Top for macOS | Lightweight Productivity Tool',
  description:
    'TopWindow is a macOS utility that keeps any window always on top. Lightweight, fast, and customizable with hotkeys and ScreenCaptureKit support. Download now to boost productivity.',
  url: 'https://topwindow.app',
  ogImage: '/images/og-image.svg',
  creator: 'TopWindow',
  keywords: [
    // Enhanced keyword strategy
    'mac window always on top',
    'macOS fix window on top',
    'TopWindow',
    'ScreenCaptureKit window pinning',
    'macOS window utility hotkey',
    'always on top keyboard shortcut',
    'topmost window mac productivity',
    'mac multitasking tool',
    'macOS window manager lightweight',
    'pin window on top mac',
    // Original keywords
    'topmost window mac',
    'mac window utility',
    'macOS window management',
    'always on top',
    'window pinning',
    'macOS utility',
    'Mac app',
    'desktop tool',
    'productivity',
    'multitasking',
  ],
};

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@topwindow',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
      },
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification-token-here',
  },
};

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TopWindow - Keep Any Window Always on Top for macOS',
  operatingSystem: 'macOS',
  applicationCategory: 'UtilityApplication',
  description:
    'TopWindow helps you keep any window always on top on macOS. Lightweight, fast, and customizable with hotkey support and ScreenCaptureKit integration.',
  url: siteConfig.url,
  image: '/images/logo.png',
  screenshot: ['/images/screenshot-hero.png', '/images/features-preview.png'],
  video: '/multipin.mp4',
  installUrl:
    'https://downloads.topwindow.app/releases/latest/topwindow-setup.dmg',
  fileSize: '4.3MB',
  author: {
    '@type': 'Organization',
    name: 'TopWindow Team',
  },
  offers: {
    '@type': 'Offer',
    price: '4.99',
    priceCurrency: 'USD',
    description: 'Pro version with full features and updates',
    availability: 'https://schema.org/InStock',
    url: `${siteConfig.url}/pricing`,
  },
  downloadUrl: `${siteConfig.url}/download`,
  softwareVersion: '1.2.0',
  featureList: [
    'Keep windows always on top',
    'Hotkey support for quick toggle',
    'ScreenCaptureKit-based window pinning',
    'Lightweight and fast performance',
    'Minimal and modern UI for macOS',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150',
  },
};

export const videoStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'TopWindow Multi-Pin Demo',
  description:
    'See how TopWindow pins multiple windows on top simultaneously for enhanced macOS productivity',
  thumbnailUrl: '/images/video-thumbnail.jpg',
  contentUrl: '/multipin.mp4',
  duration: 'PT2M30S',
  uploadDate: '2024-01-01',
};
