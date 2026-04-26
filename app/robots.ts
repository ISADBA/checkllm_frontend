import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/results/"],
        disallow: ["/q/", "/submit/success/"]
      }
    ],
    sitemap: "https://checkllm.local/sitemap.xml"
  };
}
