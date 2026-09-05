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
          className="fixed inset-0 z-[var(--z-overlay)] lg:hidden bg-base/80 flex flex-col pt-24 pb-8 px-6"
        >
          {/* Menu Items */}
          <nav className="flex-1 flex flex-col justify-center gap-6">
            <ul className="flex flex-col gap-4">
              {items.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`
                      block text-[3rem] font-display font-bold leading-none tracking-tight
                      transition-colors
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
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <Link
              href="/contact"
              onClick={onClose}
              className="
                relative inline-flex items-center justify-center w-full py-4 overflow-hidden
                text-lg font-medium text-text-primary rounded-full
                group bg-black/5 border border-black/10 hover:text-white transition-colors
              "
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[var(--gradient-accent)] rounded-full group-active:w-full group-active:h-56 -z-10"></span>
              <span className="relative z-10">Start a Project</span>
            </Link>

            <div className="flex justify-between items-center text-sm text-text-muted">
              <span>hello@mark.com</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-text-primary">TW</a>
                <a href="#" className="hover:text-text-primary">IN</a>
                <a href="#" className="hover:text-text-primary">GH</a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
