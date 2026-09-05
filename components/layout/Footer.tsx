"use client";

import Link from "next/link";
import { ArrowUpRight, Globe, MessageSquare, Link as LinkIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;
    let ctx = gsap.context(() => {
      // Simple GSAP infinite marquee
      const marqueeContent = marqueeRef.current!.firstElementChild as HTMLElement;
      if (!marqueeContent) return;

      // Clone for seamless loop
      const clone = marqueeContent.cloneNode(true);
      marqueeRef.current!.appendChild(clone);

      gsap.to(marqueeRef.current!.children, {
        xPercent: -100,
        repeat: -1,
        duration: 20,
        ease: "linear",
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] pt-14 md:pt-16 pb-8 overflow-hidden relative">
      <div className="container-site mb-12 md:mb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand & Availability */}
          <div className="lg:col-span-2 space-y-8">
            <div className="text-center md:text-left">
              <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                <h2 className="text-[clamp(3rem,8vw,8rem)] font-display text-text-primary leading-none tracking-tight">
                  Kas<span className="text-[var(--color-accent)] italic">Denge</span>
                </h2>
              </Link>
            </div>
            <p className="text-text-secondary max-w-sm text-[15px] leading-relaxed">
              We build digital products that scale. A product-engineering agency for startups and growing businesses.
            </p>
            
            <div className="flex items-center gap-3 inline-flex px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-text-primary">Available for new projects</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-text-primary font-medium mb-6">Navigation</h4>
            <ul className="space-y-4">
              {['Services', 'Products', 'Portfolio', 'Pricing'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 group">
                    {item} <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-text-primary font-medium mb-6">Connect</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 group">
                  <MessageSquare size={16} /> Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 group">
                  <LinkIcon size={16} /> LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 group">
                  <Globe size={16} /> GitHub
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* GSAP Marquee */}
      <div className="w-full border-y border-[var(--color-border)] py-4 mb-8 relative flex overflow-hidden whitespace-nowrap bg-surface-2">
        <div ref={marqueeRef} className="flex">
          <div className="flex items-center gap-12 px-6">
            <span className="text-display-md font-display italic text-text-primary/20">DIGITAL EXCELLENCE</span>
            <span className="text-xl text-text-primary/10">✦</span>
            <span className="text-display-md font-display italic text-text-primary/20">SCALABLE ARCHITECTURE</span>
            <span className="text-xl text-text-primary/10">✦</span>
            <span className="text-display-md font-display italic text-text-primary/20">PREMIUM DESIGN</span>
            <span className="text-xl text-text-primary/10">✦</span>
            <span className="text-display-md font-display italic text-text-primary/20">AI AUTOMATION</span>
            <span className="text-xl text-text-primary/10">✦</span>
          </div>
        </div>
      </div>

      <div className="container-site flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        <p>© {new Date().getFullYear()} Kas Denge Technologies. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-text-primary transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
