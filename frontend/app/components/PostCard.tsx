import Link from "next/link";
import PostCardActions from "./PostCardActions";

export interface Post {
  _id: string;
  title: string;
  description: string;
  githubLink?: string;
  demoLink?: string;
  screenshots: string[];
  tags: string[];
  authorId: string;
  likes: string[];
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
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)" }}
    >
      {login[0]?.toUpperCase()}
    </div>
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

      {/* Clickable body → post detail */}
      <Link href={`/posts/${post._id}`} className="flex flex-col gap-4 p-6 flex-1 group">

        {/* Author row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AuthorAvatar login={post.authorId} />
            <span className="text-sm font-700 text-slate-800 font-bold">{post.authorId}</span>
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

        {/* Like count */}
        <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-indigo-500 transition-colors">
          👏 {post.likes?.length ?? 0} Applauds
        </button>

        {/* Right side: links + owner actions */}
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
