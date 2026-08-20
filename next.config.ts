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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  async redirects() {
    const legacyDd = ['practice', 'exam', 'history'] as const
    const legacyDt = ['practice', 'exam', 'history'] as const
    return [
      ...legacyDd.map((segment) => ({
        source: `/do-dac-ban-do/${segment}`,
        destination: `/do-dac-ban-do/official-2020/${segment}`,
        permanent: false,
      })),
      {
        source: '/do-dac-ban-do/result/:attemptId',
        destination: '/do-dac-ban-do/official-2020/result/:attemptId',
        permanent: false,
      },
      // URL lô Đấu thầu cũ (/dau-thau/dt-lo-…)
      {
        source: '/dau-thau/:trackId/result/:attemptId',
        destination: '/dau-thau/result/:attemptId',
        permanent: false,
      },
      ...legacyDt.map((segment) => ({
        source: `/dau-thau/:trackId/${segment}`,
        destination: `/dau-thau/${segment}`,
        permanent: false,
      })),
      {
        source: '/dau-thau/:trackId',
        destination: '/dau-thau',
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
