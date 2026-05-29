"use client";

import { useRouter } from "next/navigation";
import PostForm, { PostFormValues } from "@/app/components/PostForm";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function CreatePostForm() {
  const router = useRouter();

  async function handleSubmit(data: PostFormValues) {
    const res = await fetch(`${BACKEND_URL}/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, authorId: "placeholder_author" }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Something went wrong");
    }

    router.push("/");
  }

  return <PostForm onSubmit={handleSubmit} submitLabel="Publish Project" />;
}
