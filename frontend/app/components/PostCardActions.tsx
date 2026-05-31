"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface Props {
  postId: string;
  onDelete: () => void;
}

export default function PostCardActions({ postId, onDelete }: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Link
        href={`/posts/${postId}/edit`}
        className="text-sm font-semibold text-slate-500 border border-slate-200 rounded-md px-3 py-1.5 hover:bg-slate-50 hover:border-slate-300 transition-colors"
      >
        Edit
      </Link>
      <button
        onClick={() => setShowModal(true)}
        className="text-sm font-semibold text-red-400 border border-red-200 rounded-md px-3 py-1.5 hover:bg-red-50 hover:border-red-300 transition-colors"
      >
        Delete
      </button>

      <DeleteConfirmModal
        isOpen={showModal}
        onConfirm={() => { setShowModal(false); onDelete(); }}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}
