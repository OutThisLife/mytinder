const withPlugins = require('next-compose-plugins')

const {
  NODE_ENV = 'development',
  VERCEL_ENV = NODE_ENV,
  VERCEL_URL = 'localhost:3000',
  HOSTNAME = `http${/local/.test(VERCEL_URL) ? '' : 's'}://${VERCEL_URL}`,
  NON_PROD = VERCEL_ENV !== 'production'
} = process.env

const nonProd = `${NON_PROD}` === 'true'
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = withPlugins(
  [[require('next-offline'), ['!', PHASE_DEVELOPMENT_SERVER]]],
  {
    compiler: { styledComponents: true },
    devIndicators: { buildActivity: false },
    env: { HOSTNAME },
    eslint: { ignoreDuringBuilds: true },
    experimental: {
      runtime: 'nodejs',
      serverComponents: true
    },

    async headers() {
      const baseHeaders = [
        {
          key: 'Cache-Control',
          value: 'max-age=31536000, immutable'
        },
        {
          key: 'X-Host',
          value: HOSTNAME
        },
        {
          key: 'X-Robots-Tag',
          value: 'none'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Strict-Transport-Policy',
          value: 'max-age=31536000; includeSubdomains; preload'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Download-Options',
          value: 'noopen'
        }
      ]

      if (!nonProd) {
        baseHeaders.push({
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self' data: https:",
            "font-src 'self' data: https:",
            "frame-src 'self' https:",
            "img-src 'self' data: https:",
            "manifest-src 'self'",
            "object-src 'none'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
            "style-src 'self' 'unsafe-inline' https:"
          ].join('; ')
        })
      }

      return [
        {
          headers: [
            ...baseHeaders,
            {
              key: 'X-Page',
              value: '/'
            }
          ],
          source: '/'
        },
        {
          headers: [
            {
              key: 'Service-Worker-Allowed',
              value: '/'
            }
          ],
          source: '/worker.js'
        }
      ]
    },

    images: {
      domains: ['images-ssl.gotinder.com'],
      formats: ['image/avif', 'image/webp']
    },
    poweredByHeader: false,
    reactStrictMode: true,
    typescript: { ignoreBuildErrors: true }
  }
)
