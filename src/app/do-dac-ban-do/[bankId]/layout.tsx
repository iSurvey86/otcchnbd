import type { Metadata } from 'next'
import { ddBankMeta } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bankId: string }>
}): Promise<Metadata> {
  const { bankId } = await params
  return ddBankMeta(bankId)
}

export default function DdBankLayout({ children }: { children: React.ReactNode }) {
  return children
}
