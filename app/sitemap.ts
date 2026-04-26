import type { MetadataRoute } from "next";

import { listPublicResults } from "@/lib/results";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const results = await listPublicResults();
  const baseUrl = "https://checkllm.local";

  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: "daily",
      priority: 1
    },
    ...results.map((result) => ({
      url: `${baseUrl}/results/${result.resultId}`,
      lastModified: result.runAt,
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}
