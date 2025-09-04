import { siteConfig } from './metadata';

export function generateFAQStructuredData(faqData: any) {
  // 将所有FAQ收集到一个数组中
  const allFAQs = [
    ...faqData.general,
    ...faqData.installation,
    ...faqData.usage,
    ...faqData.troubleshooting,
    ...faqData.privacy,
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: 'TopWindow FAQ - Frequently Asked Questions',
    description:
      'Find answers to common questions about TopWindow for macOS window management',
    url: `${siteConfig.url}/faq`,
    mainEntity: allFAQs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
    about: {
      '@type': 'SoftwareApplication',
      name: 'TopWindow',
      description:
        'macOS window management application that keeps windows always on top',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'macOS',
      url: siteConfig.url,
    },
    provider: {
      '@type': 'Organization',
      name: siteConfig.creator,
      url: siteConfig.url,
    },
  };
}
