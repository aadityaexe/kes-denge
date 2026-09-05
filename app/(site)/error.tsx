"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service or console
    console.error("Site render error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="container-site text-center max-w-lg">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-red-400">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-semibold text-text-primary mb-3">
          Something went wrong
        </h2>

        <p className="text-text-secondary mb-8 text-sm sm:text-base">
          We encountered an unexpected error while loading this page. Our team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-medium transition-colors text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] inline-flex items-center justify-center"
          >
            Try again
          </button>
          <Button href="/" variant="secondary" size="md" className="w-full sm:w-auto justify-center">
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
