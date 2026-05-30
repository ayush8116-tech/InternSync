"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PostCard, { Post } from "./components/PostCard";
import { useAuth } from "./components/AuthProvider";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function HomePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

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

  async function handleLoadMore() {
    const nextPage = page + 1;
    setLoadingMore(true);
    await fetchPosts(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">InternSync</h1>
            <p className="text-xs text-gray-400">Discover what your team is building</p>
          </div>

          <div className="flex items-center gap-3">
            {!authLoading && user ? (
              <>
                <Link
                  href="/create-post"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  + Share Project
                </Link>
                <div className="flex items-center gap-2">
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-sm text-gray-600 font-medium hidden sm:block">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : !authLoading ? (
              <Link
                href="/login"
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
                <div className="h-3 bg-gray-100 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-2xl bg-red-50 border border-red-100 p-6 text-center">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && posts.length === 0 && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-gray-400 text-sm mb-4">No projects shared yet. Be the first!</p>
            {user && (
              <Link
                href="/create-post"
                className="inline-block rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                Share your project
              </Link>
            )}
          </div>
        )}

        {/* Posts grid */}
        {!loading && !error && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={user?.login ?? ""}
                  onDelete={() =>
                    setPosts((prev) => prev.filter((p) => p._id !== post._id))
                  }
                />
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 flex justify-center">
              {hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              ) : (
                <p className="text-xs text-gray-400">You&apos;ve seen all projects</p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
