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
