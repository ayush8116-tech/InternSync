import CreatePostForm from "./CreatePostForm";

export default function CreatePostPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Share Your Project</h1>
          <p className="mt-1 text-sm text-gray-500">
            Show the team what you&apos;ve been building.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <CreatePostForm />
        </div>
      </div>
    </main>
  );
}
