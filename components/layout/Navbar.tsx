"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import type { NavItem } from "@/lib/types";
import { motion } from "framer-motion";

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Clients", href: "/clients" },
  { label: "Team", href: "/team" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-2 sm:top-4 md:top-6 left-0 right-0 z-[var(--z-sticky)] flex justify-center pointer-events-none px-2 sm:px-4">
        <nav
          className={`
            pointer-events-auto flex items-center justify-between
            transition-all duration-500
            rounded-full border border-[var(--color-border)]
            backdrop-blur-xl bg-surface-1/70
            ${scrolled ? "py-1.5 sm:py-2 px-3 sm:px-4 shadow-lg w-full max-w-6xl" : "py-2 sm:py-3 px-3.5 sm:px-6 w-full max-w-7xl"}
          `}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-text-primary hover:text-accent-dark transition-colors z-10 py-1"
          >
            <span className="text-lg sm:text-xl font-bold tracking-tight font-display">
              M<span className="text-[var(--color-accent-light)]">ARK</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-0.5 xl:gap-1 relative">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href} className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-surface-2 border border-[var(--color-border)] rounded-full shadow-sm"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Link
                    href={item.href}
                    className={`
                      relative z-10 px-3 xl:px-4 py-2 rounded-full text-[13px] font-medium tracking-wide
                      transition-colors duration-200
                      ${isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}
                    `}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:block z-10">
            <Link
              href="/contact"
              className="
                relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden
                text-[13px] font-medium text-surface-1 rounded-full
                group bg-text-primary border border-transparent hover:border-accent transition-all duration-300 min-h-[40px]
              "
            >
              <span className="relative z-10">Start a Project</span>
            </Link>
          </div>

          {/* Mobile Menu Button - min 44x44px touch target */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors z-10 rounded-full focus:outline-none"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={navItems}
        currentPath={pathname}
      />
    </>
  );
}
