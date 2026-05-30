"use client";

import { useRouter } from "next/navigation";
import PostForm, { PostFormValues } from "@/app/components/PostForm";
import { Post } from "@/app/components/PostCard";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function EditPostForm({ post }: { post: Post }) {
  const router = useRouter();

  async function handleSubmit(data: PostFormValues) {
    const res = await fetch(`${BACKEND_URL}/api/posts/${post._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Something went wrong");
    }

    router.push(`/posts/${post._id}`);
  }

  return (
    <PostForm
      initialValues={{
        title: post.title,
        description: post.description,
        githubLink: post.githubLink ?? "",
        demoLink: post.demoLink ?? "",
        screenshots: post.screenshots,
        tags: post.tags,
      }}
      onSubmit={handleSubmit}
      submitLabel="Save Changes"
    />
  );
}
