import type { Metadata } from 'next'

export const metadata: Metadata = {
  // 允许抓取，但不索引
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

