import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The print route is a rendering surface for the PDF job, not a page.
        disallow: ['/print/'],
      },
    ],
    sitemap: 'https://cv.tomisic.dev/sitemap.xml',
    host: 'https://cv.tomisic.dev',
  }
}
