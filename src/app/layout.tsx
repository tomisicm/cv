import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { geistMono } from './web-fonts'
import { cv } from '@/content/cv'
import './globals.css'

const geist = localFont({
  src: './fonts/GeistVF.woff2',
  variable: '--font-geist',
  weight: '100 900',
  display: 'swap',
})

const SITE_URL = 'https://cv.tomisic.dev'

/** Meta descriptions are truncated around 155 characters in search results. */
const DESCRIPTION =
  'Fullstack engineer with a backend focus: nine years across e-commerce, ' +
  'healthcare, scientific data and energy. Applied mathematics background.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${cv.name} — ${cv.role}`,
    template: `%s — ${cv.name}`,
  },
  description: DESCRIPTION,
  applicationName: `${cv.name} — CV`,
  authors: [{ name: cv.name, url: SITE_URL }],
  creator: cv.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: '/',
    siteName: `${cv.name} — CV`,
    locale: 'en_GB',
    title: `${cv.name} — ${cv.role}`,
    description: DESCRIPTION,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: `${cv.name} — ${cv.role}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${cv.name} — ${cv.role}`,
    description: DESCRIPTION,
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#090a0c',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
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
