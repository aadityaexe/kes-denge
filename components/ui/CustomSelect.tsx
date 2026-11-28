"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Search, X } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id?: string;
  name?: string;
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  size?: "sm" | "md";
  ariaLabel?: string;
  className?: string;
}

export function CustomSelect({
  id,
  name,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchable = false,
  searchPlaceholder = "Search...",
  size = "md",
  ariaLabel,
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!searchable || !q) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
    if (!isOpen && query) {
      setQuery("");
    }
  }, [isOpen, searchable, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const triggerClasses =
    size === "sm"
      ? "px-3.5 py-2.5 rounded-xl text-xs sm:text-sm min-h-[40px]"
      : "px-5 py-4 rounded-[16px] text-[var(--text-body-md)]";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {name && <input type="hidden" name={name} value={value} id={id ? `${id}-input` : undefined} />}

      <button
        type="button"
        id={id}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={`w-full bg-surface-2/60 hover:bg-surface-2 border text-left flex items-center justify-between gap-2.5 text-text-primary transition-all duration-200 focus:outline-none cursor-pointer ${triggerClasses} ${
          isOpen
            ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/20 bg-surface-1"
            : "border-[var(--color-border)] hover:border-[var(--color-accent)]/40"
        }`}
      >
        <span className="font-medium truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={size === "sm" ? 15 : 18}
          className={`text-text-muted transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[var(--color-accent-dark)]" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 left-0 right-0 min-w-[210px] top-[calc(100%+6px)] bg-surface-1/98 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden"
          >
            {searchable && (
              <div className="p-2 border-b border-[var(--color-border)] bg-surface-2/50">
                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-8 pr-7 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-accent)]"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear dropdown search"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-text-muted hover:text-text-primary cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="p-1.5 max-h-60 overflow-y-auto overscroll-contain space-y-0.5" role="listbox">
              {filteredOptions.length === 0 ? (
                <p className="px-3 py-4 text-center text-xs text-text-muted">
                  No matching options
                </p>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between gap-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[var(--color-accent)]/12 text-[var(--color-accent-dark)] font-semibold"
                          : "text-text-primary hover:bg-surface-2 hover:text-[var(--color-accent-dark)]"
                      }`}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && (
                        <Check size={14} className="text-[var(--color-accent-dark)] shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
