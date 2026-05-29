import Link from "next/link";

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

function LikeCount({ count }: { count: number }) {
  return (
    <span className="text-xs text-gray-400 flex items-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {count}
    </span>
  );
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">

      {/* Clickable area → post detail */}
      <Link
        href={`/posts/${post._id}`}
        className="flex flex-col gap-3 p-6 flex-1 group"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-gray-500">{post.authorId}</span>
          <span className="text-gray-400">{formatDate(post.createdAt)}</span>
        </div>

        <h2 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug">
          {post.title}
        </h2>

        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {post.description}
        </p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* Footer — external links + like count (outside Link to avoid nested <a>) */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <div className="flex gap-3">
          {post.githubLink && (
            <a
              href={post.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
            >
              GitHub →
            </a>
          )}
          {post.demoLink && (
            <a
              href={post.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
            >
              Demo →
            </a>
          )}
        </div>
        <LikeCount count={post.likes?.length ?? 0} />
      </div>
    </div>
  );
}
