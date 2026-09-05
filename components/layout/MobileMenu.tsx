"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { NavItem } from "@/lib/types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  currentPath: string;
}

export function MobileMenu({
  isOpen,
  onClose,
  items,
  currentPath,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)", transition: { delay: 0.2 } }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[var(--z-overlay)] lg:hidden bg-base/95 backdrop-blur-2xl flex flex-col pt-18 sm:pt-22 pb-6 px-4 sm:px-6 overflow-y-auto overscroll-contain pb-safe"
        >
          {/* Menu Items */}
          <nav className="flex-1 flex flex-col justify-center my-auto py-4">
            <ul className="flex flex-col gap-1 sm:gap-2">
              {items.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{
                    delay: i * 0.04,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`
                      block text-[clamp(1.35rem,3.8vh,2.5rem)] font-display font-bold leading-tight tracking-tight
                      py-1.5 sm:py-2 min-h-[44px] flex items-center transition-colors
                      ${
                        currentPath === item.href
                          ? "text-[var(--color-accent-dark)] italic"
                          : "text-text-primary hover:text-text-secondary"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Bottom CTA & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col gap-4 sm:gap-5 pt-4 mt-auto border-t border-[var(--color-border)]/60 shrink-0"
          >
            <Link
              href="/contact"
              onClick={onClose}
              className="
                relative inline-flex items-center justify-center w-full py-3.5 sm:py-4 overflow-hidden
                text-base sm:text-lg font-medium text-text-primary rounded-full min-h-[48px]
                group bg-black/5 border border-black/10 hover:text-white transition-colors
              "
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[var(--gradient-accent)] rounded-full group-active:w-full group-active:h-56 -z-10"></span>
              <span className="relative z-10">Start a Project</span>
            </Link>

            <div className="flex justify-between items-center text-xs sm:text-sm text-text-muted">
              <a href="mailto:hello@mark2.in" className="hover:text-text-primary transition-colors">
                hello@mark2.in
              </a>
              <div className="flex gap-4">
                <a href="https://x.com/mark2_in" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors p-1">TW</a>
                <a href="https://www.linkedin.com/company/mark2-technologies" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors p-1">IN</a>
                <a href="https://github.com/aadityaexe/mark" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors p-1">GH</a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
