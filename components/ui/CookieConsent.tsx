"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already consented
    const consent = localStorage.getItem("mark_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("mark_cookie_consent", "all");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("mark_cookie_consent", "essential");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-4 sm:p-5 rounded-2xl bg-surface-1/95 backdrop-blur-md border border-[var(--color-border)] shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-text-primary font-medium text-sm">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)]/15 text-[var(--color-accent-dark)] flex items-center justify-center shrink-0">
            <ShieldCheck size={16} />
          </div>
          <span>Privacy &amp; Cookie Preferences</span>
        </div>
        <button
          type="button"
          onClick={handleDecline}
          aria-label="Dismiss cookie notice"
          className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-md cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed mt-2.5 mb-3.5">
        We use essential cookies and telemetry to guarantee security and optimize our engineering platforms. By continuing, you agree to our{" "}
        <Link href="/privacy" className="text-text-primary underline hover:text-[var(--color-accent-dark)] transition-colors">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="text-text-primary underline hover:text-[var(--color-accent-dark)] transition-colors">
          Terms &amp; Conditions
        </Link>.
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleAccept}
          className="flex-1 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium text-center shadow-xs active:scale-[0.98] transition-all cursor-pointer"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={handleDecline}
          className="py-2 px-3 rounded-xl bg-surface-2 hover:bg-surface-3 border border-[var(--color-border)] text-text-secondary hover:text-text-primary text-xs font-medium text-center active:scale-[0.98] transition-all cursor-pointer"
        >
          Essential Only
        </button>
      </div>
    </aside>
  );
}
