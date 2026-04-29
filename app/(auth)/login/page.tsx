// app/login/page.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      console.log("LoginPage: Checking existing session...");
      const { data, error } = await supabaseClient.auth.getSession();
      console.log("LoginPage: Session data:", data);
      console.log("LoginPage: Session error:", error);

      setSessionInfo(data);
      setLoadingSession(false);
    };
    checkSession();
  }, []);

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    setEmail("");
    setPassword("");
    setError(null);
    setSessionInfo(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = isSignUp
      ? await supabaseClient.auth.signUp({ email, password })
      : await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.replace("/create");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-6">
          {isSignUp ? "Create Account" : "Sign In"}
        </h1>

        {loadingSession ? (
          <div className="space-y-2">
            <p className="text-slate-400">Checking your session…</p>
          </div>
        ) : sessionInfo?.session ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-200">
              <p className="font-semibold text-white mb-2">You are already signed in</p>
              <p className="truncate">Email: {sessionInfo.session.user.email ?? "Unknown"}</p>
              <p>Status: Authenticated</p>
            </div>

            <button
              onClick={() => router.replace("/create")}
              className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
            >
              Continue to Create
            </button>

            <button
              onClick={handleSignOut}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 text-slate-200 hover:bg-slate-800"
            >
              Sign Out and Use Different Account
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
              />

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
              >
                {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>

            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="mt-4 w-full text-sm text-slate-400 hover:text-slate-200"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </button>

            <button
              onClick={() => setShowDebug(!showDebug)}
              className="mt-2 w-full text-xs text-slate-600 hover:text-slate-500"
            >
              {showDebug ? "Hide" : "Show"} debug info
            </button>
          </>
        )}

        {showDebug && (
          <div className="mt-4 p-3 bg-slate-800 rounded-lg text-xs">
            <p className="text-slate-400 mb-2">Debug Info:</p>
            <p className="text-slate-300">Check browser console for auth logs</p>
            <p className="text-slate-300 mb-2">Session Status: {sessionInfo?.session ? "Authenticated" : "Not authenticated"}</p>
            {sessionInfo?.session && (
              <p className="text-slate-300">User ID: {sessionInfo.session.user.id}</p>
            )}
            <p className="text-slate-300">Clear localStorage/cookies if needed</p>
          </div>
        )}
      </div>
    </main>
  );
}