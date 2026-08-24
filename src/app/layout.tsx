import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Suspense, type ReactNode } from 'react'
import { Providers } from '@/components/Providers'
import './globals.css'

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()

export const metadata: Metadata = {
  metadataBase: new URL('https://www.onthicchn.org'),
  title: {
    default: 'Ôn thi sát hạch Chứng chỉ hành nghề | ONTHICCHN',
    template: '%s | ONTHICCHN',
  },
  description:
    'Luyện trắc nghiệm sát hạch cấp chứng chỉ hành nghề: Đo đạc và Bản đồ, Xây dựng, Đấu thầu. Ôn tập, thi thử có chấm điểm trên onthicchn.org.',
  keywords: [
    'ôn thi chứng chỉ hành nghề',
    'sát hạch CCHN',
    'đo đạc và bản đồ',
    'chứng chỉ hành nghề xây dựng',
    'ôn thi đấu thầu',
  ],
  authors: [{ name: 'ONTHICCHN', url: 'https://www.onthicchn.org' }],
  openGraph: {
    title: 'Ôn thi sát hạch Chứng chỉ hành nghề | ONTHICCHN',
    description:
      'Luyện trắc nghiệm sát hạch cấp chứng chỉ hành nghề: Đo đạc và Bản đồ, Xây dựng, Đấu thầu.',
    url: 'https://www.onthicchn.org',
    siteName: 'ONTHICCHN',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Ôn thi sát hạch Chứng chỉ hành nghề | ONTHICCHN',
    description:
      'Luyện trắc nghiệm sát hạch CCHN: Đo đạc và Bản đồ, Xây dựng, Đấu thầu.',
  },
  alternates: { canonical: 'https://www.onthicchn.org' },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Fraunces:opsz,wght@9..144,500;9..144,650;9..144,720&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  )
}
