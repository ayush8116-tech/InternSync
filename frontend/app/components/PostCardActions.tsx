"use client";

import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Props {
  postId: string;
  onDelete: () => void;
}

export default function PostCardActions({ postId, onDelete }: Props) {
  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This cannot be undone."
    );
    if (!confirmed) return;

    const res = await fetch(`${BACKEND_URL}/api/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      onDelete();
    }
  }

  return (
    <div className="flex items-center gap-2 px-6 py-3 border-t border-gray-100">
      <Link
        href={`/posts/${postId}/edit`}
        className="text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
