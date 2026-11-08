import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Fully static output: no server needed to host the CV.
  output: 'export',
  // Emits `out/print/index.html` instead of `out/print.html`, which keeps the
  // static file server and the PDF job trivially predictable.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
