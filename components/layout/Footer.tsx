import Link from "next/link";
import { ArrowUpRight, Globe, MessageSquare, Link as LinkIcon } from "lucide-react";
import { FooterMarquee } from "./FooterMarquee";

export function Footer() {

  return (
    <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] pt-14 md:pt-16 pb-8 overflow-hidden relative">
      <div className="container-site mb-12 md:mb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand & Availability */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="text-center md:text-left">
              <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                <h2 className="text-[clamp(2.5rem,7vw,8rem)] font-display text-text-primary leading-none tracking-tight break-words">
                  M<span className="text-[var(--color-accent)] italic">ARK</span>
                </h2>
              </Link>
            </div>
            <p className="text-text-secondary max-w-sm text-[15px] leading-relaxed break-words">
              We build digital products that scale. A product-engineering agency for startups and growing businesses.
            </p>

            <div className="flex items-center gap-3 inline-flex px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] max-w-full flex-wrap">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-medium text-text-primary">Available for new projects</span>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="text-text-primary font-medium mb-6">Navigation</h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Products', href: '/products' },
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'Clients', href: '/clients' },
                { label: 'Team', href: '/team' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 group text-sm"
                >
                  {item.label}
                  <ArrowUpRight size={12} className="opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          </div>
          {/* Socials & Contact */}
          <div>
            <h4 className="text-text-primary font-medium mb-6">Connect</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://x.com/mark2_in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 group"
                >
                  <MessageSquare size={15} /> Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/mark2-technologies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 group"
                >
                  <LinkIcon size={15} /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/aadityaexe/kes-denge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 group"
                >
                  <Globe size={15} /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@mark2.in"
                  className="text-[var(--color-accent)] hover:underline flex items-center gap-2 pt-1 font-medium"
                >
                  hello@mark2.in
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* GSAP Marquee */}
      <FooterMarquee />

      <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted text-center sm:text-left">
        <p>© {new Date().getFullYear()} MARK Technologies. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-text-primary transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
