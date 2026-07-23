import BlogPostEditor from "@/components/admin/BlogPostEditor";

export default function EditBlogPost({ params }: { params: { id: string } }) {
  return <BlogPostEditor postId={params.id} />;
}
