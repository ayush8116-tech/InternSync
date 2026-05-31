"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const OAUTH_ERRORS: Record<string, string> = {
  org: "Access is restricted to organisation members.",
  token: "GitHub authorisation failed. Please try again.",
  profile: "Could not load your GitHub profile. Please try again.",
  server: "Something went wrong. Please try again.",
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [tab, setTab] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const oauthError = searchParams.get("error");
  const oauthMsg = oauthError ? (OAUTH_ERRORS[oauthError] ?? "An unexpected error occurred.") : null;

  function switchTab(t: "login" | "signup") {
    setTab(t);
    setError("");
    setUsername("");
    setPassword("");
    setConfirm("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (tab === "signup" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = tab === "login"
        ? `${BACKEND_URL}/api/auth/login`
        : `${BACKEND_URL}/api/auth/register`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      login(data);
      router.push("/");
    } catch {
      setError("Network error — make sure the backend is running.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#F4F7F9" }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <h1
          className="text-3xl font-extrabold text-center mb-2 bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)" }}
        >
          InternSync
        </h1>
        <p className="text-sm text-slate-400 text-center mb-8">Discover what your team is building</p>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                  tab === t
                    ? "text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/40"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {t === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* OAuth error */}
            {oauthMsg && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-500">
                {oauthMsg}
              </div>
            )}

            {/* Form error */}
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your-username"
                  required
                  autoComplete="username"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              {tab === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}
              >
                {submitting
                  ? tab === "login" ? "Logging in…" : "Creating account…"
                  : tab === "login" ? "Login" : "Create Account"}
              </button>
            </form>

            {/* GitHub OAuth divider — only on Login tab */}
            {tab === "login" && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-xs text-slate-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                <a
                  href={`${BACKEND_URL}/api/auth/github`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Continue with GitHub
                </a>
              </>
            )}
          </div>
        </div>
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
