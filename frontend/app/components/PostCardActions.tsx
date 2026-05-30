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
    <>
      <Link
        href={`/posts/${postId}/edit`}
        className="text-sm font-semibold text-slate-500 border border-slate-200 rounded-md px-3 py-1.5 hover:bg-slate-50 hover:border-slate-300 transition-colors"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        className="text-sm font-semibold text-red-400 border border-red-200 rounded-md px-3 py-1.5 hover:bg-red-50 hover:border-red-300 transition-colors"
      >
        Delete
      </button>
    </>
  );
}
