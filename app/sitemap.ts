import type { MetadataRoute } from "next"
import { getAllSlugs } from "@/lib/calculadoras"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://divisas.globalmanager.online"
  const lastModified = new Date()

  const home: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
  ]

  const divisas: MetadataRoute.Sitemap = getAllSlugs().map(({ par }) => ({
    url: `${baseUrl}/${par}`,
    lastModified,
    changeFrequency: "daily",
    priority: 0.8,
  }))

  return [...home, ...divisas]
}
