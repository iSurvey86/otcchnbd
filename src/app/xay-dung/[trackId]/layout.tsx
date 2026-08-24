import type { Metadata } from 'next'
import { xdTrackMeta } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackId: string }>
}): Promise<Metadata> {
  const { trackId } = await params
  return xdTrackMeta(trackId)
}

export default function XdTrackLayout({ children }: { children: React.ReactNode }) {
  return children
}
