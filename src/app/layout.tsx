import type { Metadata } from 'next'
import { defaultMetadata, structuredData } from '@/lib/metadata'
import { AuthProvider } from '@/lib/context/AuthContext'
import DevNavigation from '@/components/DevNavigation'
import './globals.css'

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-gray-text">
        <AuthProvider>
          <DevNavigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}