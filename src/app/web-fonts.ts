import localFont from 'next/font/local'

/**
 * Monospace is only used by the website, so it is declared here instead of the
 * root layout. That keeps `/print/` free of an unused font preload.
 */
export const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff2',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
})
