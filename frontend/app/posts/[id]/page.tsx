import Link from "next/link";
import Image from "next/image";
import { Post } from "@/app/components/PostCard";
import PostDetailActions from "./PostDetailActions";
import LikeButton from "@/app/components/LikeButton";
import CommentSection from "@/app/components/CommentSection";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getPost(id: string): Promise<Post | null> {
  const res = await fetch(`${BACKEND_URL}/api/posts/${id}`);
  if (!res.ok) return null;
  return res.json();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function BackLink() {
  return (
    <Link href="/" className="text-sm text-indigo-500 hover:text-indigo-700 font-medium">
      ← Back to feed
    </Link>
  );
}

function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <BackLink />
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-gray-400 text-sm">Post not found.</p>
      </div>
    </main>
  );
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) return <NotFound />;

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <BackLink />
          <PostDetailActions postId={post._id} authorId={post.authorId} />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

          {/* Author + date */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <span className="font-medium text-gray-500">{post.authorId}</span>
            <span>·</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-4">
            {post.title}
          </h1>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap mb-8">
            {post.description}
          </p>

          {/* Links */}
          {(post.githubLink || post.demoLink) && (
            <div className="flex gap-4 mb-8">
              {post.githubLink && (
                <a
                  href={post.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                >
                  GitHub →
                </a>
              )}
              {post.demoLink && (
                <a
                  href={post.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Live Demo →
                </a>
              )}
            </div>
          )}

          {/* Screenshots */}
          {post.screenshots.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {post.screenshots.map((url) => (
                <div
                  key={url}
                  className="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
                >
                  <Image
                    src={url}
                    alt={`Screenshot of ${post.title}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Like button */}
          <div className="pt-6 border-t border-gray-100">
            <LikeButton postId={post._id} initialLikes={post.likes ?? []} />
          </div>

          {/* Comments */}
          <CommentSection
            postId={post._id}
            initialComments={post.comments ?? []}
          />
        </div>
      </div>
    </main>
  );
}
