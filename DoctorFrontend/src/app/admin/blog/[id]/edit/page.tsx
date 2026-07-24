import BlogPostEditor from "@/components/admin/BlogPostEditor";

export default async function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BlogPostEditor postId={id} />;
}
