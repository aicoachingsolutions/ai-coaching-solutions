import type { MetadataRoute } from "next";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://www.aicoachingsolutions.net";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/free-breakdown`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/post`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },

    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms-conditions`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/howitworks`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  const postRoutes: MetadataRoute.Sitemap = getAllPostSlugs().map((slug) => {
    const post = getPostBySlug(slug);
    return {
      url: `${siteUrl}/post/${slug}`,
      lastModified: post?.date ? new Date(post.date) : new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...postRoutes];
}
