import type { MetadataRoute } from "next";
import { SITE } from "@/constants/personal";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
