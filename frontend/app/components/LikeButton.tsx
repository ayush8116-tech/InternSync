"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Props {
  postId: string;
  initialLikes: string[];
}

export default function LikeButton({ postId, initialLikes }: Props) {
  const { user } = useAuth();
  const [likes, setLikes] = useState<string[]>(initialLikes);
  const [pending, setPending] = useState(false);

  const isLiked = !!user && likes.includes(user.login);

  async function handleClick() {
    if (!user || pending) return;

    // Optimistic update
    const next = isLiked
      ? likes.filter((l) => l !== user.login)
      : [...likes, user.login];
    setLikes(next);
    setPending(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/posts/${postId}/like`, {
        method: "PATCH",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
      } else {
        setLikes(likes); // revert
      }
    } catch {
      setLikes(likes); // revert on network error
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={!user || pending}
      className="flex items-center gap-1.5 text-sm font-semibold transition-colors disabled:cursor-default"
      style={
        isLiked
          ? { backgroundImage: "linear-gradient(135deg, #6366F1, #A855F7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }
          : { color: "#94a3b8" }
      }
      title={user ? (isLiked ? "Unlike" : "Like") : "Log in to like"}
    >
      <span style={isLiked ? { filter: "none" } : { opacity: 0.5 }}>👏</span>
      {likes.length} Applauds
    </button>
  );
}
