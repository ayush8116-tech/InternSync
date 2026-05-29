import Link from "next/link";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <Link
            href="/"
            className="text-sm text-indigo-500 hover:text-indigo-700 font-medium"
          >
            ← Back to feed
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 animate-pulse">

          {/* Author + date skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-100 rounded w-16" />
          </div>

          {/* Title skeleton */}
          <div className="h-7 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="h-7 bg-gray-100 rounded w-1/2 mb-6" />

          {/* Tags skeleton */}
          <div className="flex gap-2 mb-6">
            <div className="h-5 bg-gray-100 rounded-full w-16" />
            <div className="h-5 bg-gray-100 rounded-full w-20" />
            <div className="h-5 bg-gray-100 rounded-full w-14" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-2 mb-8">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
            <div className="h-3 bg-gray-100 rounded w-4/5" />
            <div className="h-3 bg-gray-100 rounded w-3/4" />
          </div>

          {/* Links skeleton */}
          <div className="flex gap-4 mb-8">
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="h-4 bg-gray-100 rounded w-20" />
          </div>

          {/* Screenshots skeleton */}
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-video bg-gray-100 rounded-xl" />
            <div className="aspect-video bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
