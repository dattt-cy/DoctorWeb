import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { API_BASE_URL } from "@/shared/api/config";
import { SERVICES } from "@/constants/services";

type SitemapPost = { slug: string; publishedAt?: string; updatedAt?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1, lastModified: new Date() },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.8, lastModified: new Date() },
  ];

  let posts: SitemapPost[] = [];
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/blogs?size=1000&sort=updatedAt,desc`, {
      next: { revalidate: 3600 },
    });
    if (response.ok) posts = (await response.json()).content || [];
  } catch {
    // Vẫn trả sitemap trang tĩnh nếu backend tạm thời không khả dụng.
  }

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt || post.publishedAt || Date.now()),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: absoluteUrl(`/dich-vu/${service.id}`),
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
