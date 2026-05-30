"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Props {
  postId: string;
}

export default function PostDetailActions({ postId }: Props) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This cannot be undone."
    );
    if (!confirmed) return;

    const res = await fetch(`${BACKEND_URL}/api/posts/${postId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/posts/${postId}/edit`}
        className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        className="rounded-lg border border-red-200 px-4 py-1.5 text-sm font-medium text-red-500 hover:border-red-400 hover:text-red-700 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
