"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ERROR_MESSAGES: Record<string, string> = {
  org: "Access is restricted to organisation members. Please contact your admin.",
  token: "GitHub authorisation failed. Please try again.",
  profile: "Could not load your GitHub profile. Please try again.",
  server: "Something went wrong on our end. Please try again.",
};

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? "An unexpected error occurred.") : null;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">InternSync</h1>
        <p className="text-sm text-gray-400 mb-8">Discover what your team is building</p>

        {errorMessage && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-500">
            {errorMessage}
          </div>
        )}

        <a
          href={`${BACKEND_URL}/api/auth/github`}
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Login with GitHub
        </a>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
