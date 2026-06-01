"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "./AuthProvider";
import { Comment } from "./PostCard";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3 py-4 border-b border-gray-50 last:border-0">
      <Image
        src={comment.authorAvatar ?? `https://github.com/${comment.authorId}.png`}
        alt={comment.authorId}
        width={32}
        height={32}
        className="rounded-full flex-shrink-0 mt-0.5 w-8 h-8"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-800">{comment.authorId}</span>
          <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{comment.text}</p>
      </div>
    </div>
  );
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");
  const [validationError, setValidationError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");
    setSubmitError("");

    if (!text.trim()) {
      setValidationError("Comment cannot be empty");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!res.ok) {
        setSubmitError("Something went wrong. Please try again.");
        return;
      }

      const { comment } = await res.json();
      setComments((prev) => [...prev, comment]);
      setText("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {/* Comment input — logged-in users only */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <Image
              src={user.avatarUrl ?? `https://github.com/${user.login}.png`}
              alt={user.login}
              width={32}
              height={32}
              className="rounded-full flex-shrink-0 mt-1 w-8 h-8"
            />
            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => { setText(e.target.value); setValidationError(""); }}
                placeholder="Write a comment..."
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {validationError && (
                <p className="mt-1 text-xs text-red-500">{validationError}</p>
              )}
              {submitError && (
                <p className="mt-1 text-xs text-red-500">{submitError}</p>
              )}
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-400 mb-6">
          <a href="/login" className="text-indigo-500 hover:underline">Log in to comment</a>
        </p>
      )}

      {/* Comment list */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
      ) : (
        <div>
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
