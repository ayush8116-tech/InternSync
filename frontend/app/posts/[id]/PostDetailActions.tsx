"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Props {
  postId: string;
  authorId: string;
}

export default function PostDetailActions({ postId, authorId }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Only render buttons for the post owner
  if (!user || user.login !== authorId) return null;

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/");
      } else {
        setShowModal(false);
        alert("Failed to delete post. Please try again.");
      }
    } catch {
      setShowModal(false);
      alert("Network error — make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href={`/posts/${postId}/edit`}
          className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg border border-red-200 px-4 py-1.5 text-sm font-medium text-red-500 hover:border-red-400 hover:text-red-700 transition-colors"
        >
          Delete
        </button>
      </div>

      <DeleteConfirmModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
        loading={loading}
      />
    </>
  );
}
