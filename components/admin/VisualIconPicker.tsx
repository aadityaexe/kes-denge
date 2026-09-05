"use client";

import { useState, useRef, useEffect } from "react";
import {
  Globe,
  Smartphone,
  Building2,
  Code2,
  Database,
  Cpu,
  Shield,
  Zap,
  Target,
  Layers,
  Blocks,
  Server,
  TrendingUp,
  Terminal,
  Cloud,
  Lock,
  Package,
  ShoppingCart,
  BarChart3,
  CheckCircle2,
  Activity,
  Briefcase,
  ChevronDown,
  Search,
  X,
} from "lucide-react";

export const AVAILABLE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe,
  Smartphone,
  Building2,
  Code2,
  Database,
  Cpu,
  Shield,
  Zap,
  Target,
  Layers,
  Blocks,
  Server,
  TrendingUp,
  Terminal,
  Cloud,
  Lock,
  Package,
  ShoppingCart,
  BarChart3,
  CheckCircle2,
  Activity,
  Briefcase,
};

interface VisualIconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
  helperText?: string;
}

export function VisualIconPicker({
  value,
  onChange,
  label = "Icon Identifier",
  helperText,
}: VisualIconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const CurrentIcon = AVAILABLE_ICONS[value] || Globe;

  const filteredIcons = Object.keys(AVAILABLE_ICONS).filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary hover:border-[var(--color-accent)]/60 transition-all cursor-pointer shadow-2xs"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] flex items-center justify-center">
            <CurrentIcon size={14} />
          </div>
          <span className="font-medium text-xs text-text-primary">{value || "Globe"}</span>
        </div>
        <ChevronDown size={14} className={`text-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {helperText && <p className="text-[11px] text-text-muted">{helperText}</p>}

      {/* Popover Grid */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1.5 w-72 bg-surface-1 border border-[var(--color-border)] rounded-xl shadow-2xl p-3 animate-in fade-in zoom-in-95 duration-150">
          {/* Search Input */}
          <div className="relative mb-2.5">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons..."
              className="w-full pl-7 pr-7 py-1.5 text-xs bg-surface-2 border border-[var(--color-border)] rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-accent)]"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Icons Grid */}
          <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto overscroll-contain pr-1">
            {filteredIcons.map((iconName) => {
              const IconComp = AVAILABLE_ICONS[iconName];
              const isSelected = value === iconName;

              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    onChange(iconName);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  title={iconName}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[var(--color-accent)] text-surface-1 shadow-sm"
                      : "bg-surface-2/60 text-text-primary hover:bg-[var(--color-accent-glow)] hover:text-[var(--color-accent-dark)]"
                  }`}
                >
                  <IconComp size={18} />
                  <span className="text-[9px] font-mono mt-1 truncate max-w-[50px]">{iconName}</span>
                </button>
              );
            })}
          </div>

          {filteredIcons.length === 0 && (
            <p className="text-[11px] text-center text-text-muted py-3">No matching icons</p>
          )}
        </div>
      )}
    </div>
  );
}
