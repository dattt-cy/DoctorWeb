export type BlogStatus = "DRAFT" | "PUBLISHED";

export type BlogPostPayload = {
  title: string;
  category: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  coverPositionX: number;
  coverPositionY: number;
  content: string;
  status: BlogStatus;
  seoTitle: string;
  seoDescription: string;
  primaryKeyword: string;
  tags: string;
};

export type AdminBlogPost = BlogPostPayload & {
  id: number;
  slug: string;
  publishedAt?: string | null;
  updatedAt?: string | null;
  viewCount?: number;
};

export type BlogPage = {
  content: AdminBlogPost[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type BlogRevision = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  createdAt: string;
};
