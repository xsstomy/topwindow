import type { Metadata } from 'next';
import Script from 'next/script';
import { defaultMetadata, structuredData } from '@/lib/metadata';
import { AuthProvider } from '@/lib/context/AuthContext';
import Header from '@/components/Header';
import DevNavigation from '@/components/DevNavigation';
import { GA_MEASUREMENT_ID } from '@/lib/analytics/google-analytics';
import './globals.css';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy='afterInteractive'
            />
            <Script id='google-analytics' strategy='afterInteractive'>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  send_page_view: true,
                  anonymize_ip: true,
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false,
                });
              `}
            </Script>
          </>
        )}

        {/* Structured Data */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className='min-h-screen bg-white text-gray-text'>
        <AuthProvider>
          {/* Development Navigation */}
          <DevNavigation />

          {/* Production Header */}
          <Header />

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
