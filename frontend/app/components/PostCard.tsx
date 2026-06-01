import Link from "next/link";
import Image from "next/image";
import PostCardActions from "./PostCardActions";
import LikeButton from "./LikeButton";

export interface Comment {
  _id: string;
  text: string;
  authorId: string;
  authorAvatar?: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  title: string;
  description: string;
  githubLink?: string;
  demoLink?: string;
  screenshots: string[];
  tags: string[];
  authorId: string;
  authorAvatar?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function AuthorAvatar({ login }: { login: string }) {
  return (
    <Image
      src={`https://github.com/${login}.png?size=64`}
      alt={login}
      width={32}
      height={32}
      className="rounded-full flex-shrink-0"
    />
  );
}

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onDelete?: () => void;
}

export default function PostCard({ post, currentUserId, onDelete }: PostCardProps) {
  const isOwner = !!currentUserId && currentUserId === post.authorId;

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col overflow-hidden">

      <Link href={`/posts/${post._id}`} className="flex flex-col gap-4 p-6 flex-1 group">

        {/* Author row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AuthorAvatar login={post.authorId} />
            <span className="text-sm font-bold text-slate-800">{post.authorId}</span>
          </div>
          <span className="text-xs text-slate-400">{formatDate(post.createdAt)}</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-extrabold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
          {post.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {post.description}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <LikeButton postId={post._id} initialLikes={post.likes ?? []} />
          <Link
            href={`/posts/${post._id}`}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.comments?.length ?? 0}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {post.githubLink && (
            <a
              href={post.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              GitHub →
            </a>
          )}
          {post.demoLink && (
            <a
              href={post.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Demo →
            </a>
          )}
          {isOwner && onDelete && (
            <PostCardActions postId={post._id} onDelete={onDelete} />
          )}
        </div>
      </div>
    </article>
  );
}
