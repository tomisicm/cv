import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { cv } from '@/content/cv'
import './globals.css'

const geist = localFont({
  src: './fonts/GeistVF.woff2',
  variable: '--font-geist',
  weight: '100 900',
  display: 'swap',
})

export const metadata: Metadata = {
  title: `${cv.name} — ${cv.role}`,
  description: cv.summary,
  authors: [{ name: cv.name }],
  alternates: { canonical: 'https://cv.tomisic.dev' },
  openGraph: {
    type: 'profile',
    url: 'https://cv.tomisic.dev',
    title: `${cv.name} — ${cv.role}`,
    description: cv.summary,
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {/* Marks the document before first paint. All entrance animations are
            gated on this, so a JS failure leaves the page fully readable. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.dataset.js='1'",
          }}
        />
        {children}
      </body>
    </html>
  )
}
