export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

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

async function parseError(response: Response) {
  try {
    const body = await response.json();
    return body.message || "Yêu cầu không thành công.";
  } catch {
    return "Yêu cầu không thành công.";
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      if (typeof window !== "undefined" && !path.includes("/auth/login")) {
        window.location.assign("/admin/login");
      }
    }
    throw new Error(await parseError(response));
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function uploadBlogImage(file: File): Promise<string> {
  const data = new FormData();
  data.append("file", file);
  const result = await apiRequest<{ url: string }>("/api/admin/upload", {
    method: "POST",
    body: data,
  });
  return result.url;
}
