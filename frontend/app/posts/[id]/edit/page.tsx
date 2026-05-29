import Link from "next/link";
import { Post } from "@/app/components/PostCard";
import EditPostForm from "./EditPostForm";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getPost(id: string): Promise<Post | null> {
  const res = await fetch(`${BACKEND_URL}/api/posts/${id}`);
  if (!res.ok) return null;
  return res.json();
}

function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <Link href="/" className="text-sm text-indigo-500 hover:text-indigo-700 font-medium">
            ← Back to feed
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-gray-400 text-sm">Post not found.</p>
      </div>
    </main>
  );
}

export default async function EditPostPage({
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
        <div className="mx-auto max-w-2xl px-4 py-4">
          <Link
            href={`/posts/${id}`}
            className="text-sm text-indigo-500 hover:text-indigo-700 font-medium"
          >
            ← Back to post
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
          <p className="mt-1 text-sm text-gray-500">Update your project details below.</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <EditPostForm post={post} />
        </div>
      </div>
    </main>
  );
}
