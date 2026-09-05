"use client";

import React from "react";
import { Wand2, ExternalLink } from "lucide-react";

interface SlugInputProps {
  value: string;
  onChange: (val: string) => void;
  titleValue?: string;
  pathPrefix: string; // e.g. "/services/" or "/products/"
  label?: string;
  isExisting?: boolean;
}

export function SlugInput({
  value,
  onChange,
  titleValue = "",
  pathPrefix,
  label = "URL Slug",
  isExisting = false,
}: SlugInputProps) {
  const generateSlug = () => {
    if (!titleValue) return;
    const clean = titleValue
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    onChange(clean);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = raw.toLowerCase().replace(/[^a-z0-9-]/g, "");
    onChange(formatted);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
          {label} *
        </label>
        <div className="flex items-center gap-2">
          {titleValue && (
            <button
              type="button"
              onClick={generateSlug}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-accent-dark)] hover:underline cursor-pointer"
              title="Generate clean slug from title"
            >
              <Wand2 size={12} />
              <span>Regenerate</span>
            </button>
          )}
          {isExisting && value && (
            <a
              href={`${pathPrefix}${value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted hover:text-text-primary transition-colors"
              title="View on live site"
            >
              <ExternalLink size={11} />
              <span>View live</span>
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center rounded-lg bg-surface-2 border border-[var(--color-border)] focus-within:border-[var(--color-accent)] overflow-hidden">
        <span className="px-2.5 py-2 text-xs font-mono text-text-muted bg-surface-3/50 select-none border-r border-[var(--color-border)]">
          {pathPrefix}
        </span>
        <input
          type="text"
          required
          value={value}
          onChange={handleInputChange}
          placeholder="your-custom-slug"
          className="flex-1 px-3 py-2 text-xs bg-transparent text-text-primary font-mono focus:outline-none"
        />
      </div>
      <p className="text-[11px] text-text-muted">
        Clean URL identifier for search engines and direct links.
      </p>
    </div>
  );
}
