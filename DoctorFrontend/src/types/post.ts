export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  coverImageAlt?: string;
  coverPositionX?: number;
  coverPositionY?: number;
  publishedAt: string;
  readingTime: number;
  featured?: boolean;
  tags?: string;
  viewCount?: number;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}
