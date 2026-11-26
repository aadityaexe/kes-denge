"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter both your email address and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("An unexpected error occurred. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-surface-1">
      {/* Left Architectural Brand Panel (Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 relative flex-col justify-between bg-[#111111] text-white p-10 xl:p-14 overflow-hidden">
        {/* Ambient warm gold glow & subtle grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-[#C9A96E]/15 blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -right-24 w-[420px] h-[420px] rounded-full bg-[#C9A96E]/10 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:48px_48px]"
        />

        {/* Brand */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="text-2xl font-bold tracking-tight font-display">
              M<span className="text-[#C9A96E]">ARK</span>
            </span>
          </Link>
        </div>

        {/* Center Editorial Statement */}
        <div className="relative z-10 max-w-md my-auto">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#C9A96E] mb-4">
            Studio Operations
          </p>
          <h2 className="text-4xl xl:text-5xl font-display font-bold leading-[1.08] tracking-tight text-white mb-5">
            Build, ship, and manage{" "}
            <span className="italic font-normal text-[#C9A96E]">everything</span>{" "}
            in one place.
          </h2>
          <p className="text-sm text-white/60 leading-relaxed font-light">
            Centralized control for case studies, product releases, editorial posts, client inquiries, and site-wide configuration.
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-white/40 border-t border-white/10 pt-6">
          <span>mark2.in</span>
          <span>Encrypted Session Access</span>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-between bg-surface-2/60 lg:px-10 lg:py-10">
        {/* Mobile Dark Brand Header */}
        <div className="lg:hidden relative bg-[#111111] text-white px-5 pt-6 pb-8 rounded-b-3xl overflow-hidden shadow-lg">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full bg-[#C9A96E]/20 blur-[70px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:32px_32px]"
          />
          <div className="relative z-10 flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white/75 hover:text-white transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to mark2.in
            </Link>
            <span className="text-lg font-bold tracking-tight font-display text-white">
              M<span className="text-[#C9A96E]">ARK</span>
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#C9A96E] mb-1.5">
              Studio Operations
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-white/65 mt-1">
              Sign in with your administrator credentials to continue.
            </p>
          </div>
        </div>

        {/* Desktop Top bar */}
        <div className="hidden lg:flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to mark2.in
          </Link>
        </div>

        {/* Centered Form */}
        <div className="flex-1 flex flex-col justify-center w-full max-w-[400px] mx-auto px-5 lg:px-0 py-8">
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight font-display">
              Welcome back
            </h1>
            <p className="text-sm text-text-secondary mt-2">
              Sign in with your administrator credentials to continue.
            </p>
          </div>

          {error && (
            <div
              id="login-error"
              role="alert"
              className="mb-6 p-3.5 bg-red-500/8 border border-red-500/25 text-red-600 text-xs sm:text-sm rounded-xl flex items-start gap-2.5"
            >
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="admin-email"
                className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-describedby={error ? "login-error" : undefined}
                  className="w-full pl-10 pr-4 py-3 min-h-[48px] bg-surface-1 border border-[var(--color-border)] rounded-xl text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 text-sm transition-all shadow-xs"
                  placeholder="admin@mark2.in"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-describedby={error ? "login-error" : undefined}
                  className="w-full pl-10 pr-11 py-3 min-h-[48px] bg-surface-1 border border-[var(--color-border)] rounded-xl text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 text-sm transition-all shadow-xs"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full justify-center shadow-sm min-h-[48px]"
                size="lg"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>
            </div>
          </form>

          {/* Mobile inline note right below form (avoids bottom void & dev badge overlap) */}
          <p className="mt-6 text-center text-[11px] text-text-muted lg:hidden">
            Authorized personnel only. All sign-in attempts are rate-limited.
          </p>
        </div>

        {/* Desktop bottom note */}
        <p className="hidden lg:block text-left text-[11px] text-text-muted">
          Authorized personnel only. All sign-in attempts are rate-limited.
        </p>
      </div>
    </div>
  );
}
