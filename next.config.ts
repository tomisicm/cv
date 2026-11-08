import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Fully static output: no server needed to host the CV.
  output: 'export',
  // Lets verification builds write somewhere other than `.next`, so running a
  // build never clobbers a dev server that is using the same directory.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  // Emits `out/print/index.html` instead of `out/print.html`, which keeps the
  // static file server and the PDF job trivially predictable.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
