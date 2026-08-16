import type { Metadata } from 'next'
import { Suspense, type ReactNode } from 'react'
import { Providers } from '@/components/Providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ôn thi sát hạch Chứng chỉ hành nghề',
  description:
    'Ôn thi trắc nghiệm sát hạch chứng chỉ hành nghề - Đo đạc và Bản đồ, Xây dựng...',
  openGraph: {
    title: 'Ôn thi sát hạch Chứng chỉ hành nghề',
    description:
      'Ôn thi trắc nghiệm sát hạch chứng chỉ hành nghề - Đo đạc và Bản đồ, Xây dựng...',
  },
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
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,650;9..144,720&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  )
}
