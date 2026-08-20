import type { MetadataRoute } from 'next'
import { DD_BANKS } from '@/data/dd/banks'
import { XD_TRACKS } from '@/data/xd/tracks'

const SITE = 'https://onthicchn.org'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const hubs: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${SITE}/do-dac-ban-do`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE}/dau-thau`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE}/xay-dung`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  const ddBanks = DD_BANKS.filter((b) => b.ready).map((bank) => ({
    url: `${SITE}/do-dac-ban-do/${bank.id}`,
    lastModified: bank.publishedAt ? new Date(bank.publishedAt) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const xdTracks = XD_TRACKS.filter((t) => t.open).map((track) => ({
    url: `${SITE}/xay-dung/${track.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...hubs, ...ddBanks, ...xdTracks]
}
