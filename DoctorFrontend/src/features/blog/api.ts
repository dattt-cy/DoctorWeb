import { apiRequest } from "@/shared/api/client";

export async function uploadBlogImage(file: File): Promise<string> {
  const data = new FormData();
  data.append("file", file);
  const result = await apiRequest<{ url: string }>("/api/admin/upload", {
    method: "POST",
    body: data,
  });
  return result.url;
}
