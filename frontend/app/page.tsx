"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PostCard, { Post } from "./components/PostCard";
import UndoToast from "./components/UndoToast";
import { useAuth } from "./components/AuthProvider";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const UNDO_WINDOW_MS = 10_000;

interface PendingDelete {
  post: Post;
  originalIndex: number;
  toastKey: number;
}

export default function HomePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastKeyRef = useRef(0);

  async function fetchPosts(pageNum: number, append = false) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/posts?page=${pageNum}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load posts");
      const data = await res.json();
      setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
      setHasMore(data.hasMore);
    } catch {
      setError("Could not load posts. Make sure the backend is running.");
    }
  }

  useEffect(() => {
    fetchPosts(1).finally(() => setLoading(false));
  }, []);

  // Commit the pending delete to the backend when timer fires
  function scheduleDelete(post: Post) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      await fetch(`${BACKEND_URL}/api/posts/${post._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setPendingDelete(null);
    }, UNDO_WINDOW_MS);
  }

  function handleDeletePost(post: Post) {
    // If there's already a pending delete, commit it immediately before starting a new one
    if (pendingDelete && timerRef.current) {
      clearTimeout(timerRef.current);
      fetch(`${BACKEND_URL}/api/posts/${pendingDelete.post._id}`, {
        method: "DELETE",
        credentials: "include",
      });
    }

    const originalIndex = posts.findIndex((p) => p._id === post._id);
    setPosts((prev) => prev.filter((p) => p._id !== post._id));

    toastKeyRef.current += 1;
    setPendingDelete({ post, originalIndex, toastKey: toastKeyRef.current });
    scheduleDelete(post);
  }

  function handleUndo() {
    if (!pendingDelete || !timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
    setPosts((prev) => {
      const next = [...prev];
      const at = Math.min(pendingDelete.originalIndex, next.length);
      next.splice(at, 0, pendingDelete.post);
      return next;
    });
    setPendingDelete(null);
  }

  async function handleLoadMore() {
    const nextPage = page + 1;
    setLoadingMore(true);
    await fetchPosts(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  }

  return (
    <main className="min-h-screen" style={{ background: "#F4F7F9" }}>

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <div className="mx-auto max-w-[680px] px-4 py-4 flex items-center justify-between">
          <h1
            className="text-2xl font-extrabold bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)" }}
          >
            InternSync
          </h1>

          <div className="flex items-center gap-4">
            {!authLoading && user ? (
              <>
                <Link
                  href="/create-post"
                  className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
                    boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
                  }}
                >
                  ✨ Share Project
                </Link>
                <div className="flex items-center gap-2.5">
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={34}
                    height={34}
                    className="rounded-full ring-2 ring-indigo-100"
                  />
                  <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                    {user.login}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm font-semibold text-slate-400 hover:text-red-500 transition-colors ml-1"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : !authLoading ? (
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-500 border border-slate-200 px-4 py-2 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Feed */}
      <div className="mx-auto max-w-[680px] px-4 py-8">

        {/* Undo toast — top of feed, no overlay */}
        {pendingDelete && (
          <div className="mb-5">
            <UndoToast
              title={pendingDelete.post.title}
              toastKey={pendingDelete.toastKey}
              onUndo={handleUndo}
            />
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100" />
                  <div className="h-3 bg-slate-100 rounded w-24" />
                </div>
                <div className="h-5 bg-slate-200 rounded w-2/3 mb-3" />
                <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded w-4/5" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl bg-red-50 border border-red-100 p-6 text-center">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && posts.length === 0 && !pendingDelete && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-slate-400 text-sm mb-4">No projects shared yet. Be the first!</p>
            {user && (
              <Link
                href="/create-post"
                className="inline-block text-sm font-semibold text-white px-5 py-2.5 rounded-lg"
                style={{ background: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)" }}
              >
                Share your project
              </Link>
            )}
          </div>
        )}

        {/* Posts */}
        {!loading && !error && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={user?.login ?? ""}
                onDelete={() => handleDeletePost(post)}
              />
            ))}

            <div className="flex justify-center pt-2">
              {hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="text-sm font-semibold text-slate-500 border border-slate-200 bg-white px-6 py-2.5 rounded-lg hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 transition-colors"
                >
                  {loadingMore ? "Loading…" : "Load More"}
                </button>
              ) : (
                <p className="text-xs text-slate-400">You&apos;ve seen all projects</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
