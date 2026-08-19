import type { NextConfig } from 'next'

/** Popup Google cần COOP cho phép cửa sổ con. */
const authHeaders = [
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin-allow-popups',
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['firebase-admin', 'jose', 'jwks-rsa'],
  async redirects() {
    const legacy = ['practice', 'exam', 'history'] as const
    return [
      ...legacy.map((segment) => ({
        source: `/do-dac-ban-do/${segment}`,
        destination: `/do-dac-ban-do/official-2020/${segment}`,
        permanent: false,
      })),
      {
        source: '/do-dac-ban-do/result/:attemptId',
        destination: '/do-dac-ban-do/official-2020/result/:attemptId',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: authHeaders,
      },
    ]
  },
}

export default nextConfig
