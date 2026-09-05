"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id?: string;
  name?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomSelect({
  id,
  name,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {name && <input type="hidden" name={name} value={value} id={id ? `${id}-input` : undefined} />}
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full px-5 py-4 bg-surface-2/50 hover:bg-surface-2 border rounded-[16px] text-left flex items-center justify-between gap-3 text-text-primary transition-all duration-300 shadow-inner focus:outline-none ${
          isOpen
            ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/20 bg-surface-2"
            : "border-[var(--color-border)] hover:border-[var(--color-accent)]/40"
        }`}
      >
        <span className="text-[var(--text-body-md)] font-medium truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-text-muted transition-transform duration-300 shrink-0 ${
            isOpen ? "rotate-180 text-[var(--color-accent)]" : ""
          }`}
        />
      </button>

      {/* Luxury Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 left-0 right-0 top-[calc(100%+8px)] bg-surface-1/95 backdrop-blur-2xl border border-[var(--color-border)] rounded-[20px] shadow-2xl p-2 max-h-64 overflow-y-auto overflow-x-hidden"
          >
            <div className="space-y-1" role="listbox">
              {options.map((option) => {
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
                    className={`w-full px-4 py-3 rounded-[12px] text-left flex items-center justify-between gap-3 text-sm font-medium transition-all duration-200 group ${
                      isSelected
                        ? "bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] font-semibold"
                        : "text-text-primary hover:bg-surface-2 hover:text-[var(--color-accent)]"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <Check size={16} className="text-[var(--color-accent)] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
