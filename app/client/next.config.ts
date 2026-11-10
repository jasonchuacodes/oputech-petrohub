import type { NextConfig } from 'next'

const nestApiUrl = getNestApiUrl()

function getNestApiUrl(): string {
  const value = process.env.NEST_API_URL?.trim() || 'http://localhost:3000'

  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error()
    return url.origin
  } catch {
    throw new Error('NEST_API_URL must be an absolute HTTP(S) URL, for example http://localhost:3000')
  }
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${nestApiUrl}/api/:path*`,
      },
      {
        source: '/graphql',
        destination: `${nestApiUrl}/graphql`,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
