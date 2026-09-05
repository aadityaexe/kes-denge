"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin dashboard error:", error);
  }, [error]);
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5 text-red-400">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-2">Admin Portal Error</h2>
        <p className="text-neutral-400 text-sm mb-6">
          An error occurred in the administration panel. You can attempt to recover the state or navigate back to the overview.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-left text-xs font-mono text-red-400 mb-6 overflow-x-auto">
            {error.message}
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-colors"
          >
            Retry
          </button>
          <Link
            href="/admin"
            className="px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-sm transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
