"use client";

import React from "react";
import { Globe, Search } from "lucide-react";
import { ArrayInput } from "./ArrayInput";

interface SeoHelperInputsProps {
  metaTitle: string;
  onChangeMetaTitle: (val: string) => void;
  metaDescription: string;
  onChangeMetaDescription: (val: string) => void;
  keywords?: string[];
  onChangeKeywords?: (keywords: string[]) => void;
  canonicalPath: string; // e.g. "/services/custom-software"
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export function SeoHelperInputs({
  metaTitle,
  onChangeMetaTitle,
  metaDescription,
  onChangeMetaDescription,
  keywords,
  onChangeKeywords,
  canonicalPath,
  fallbackTitle = "MARK Technologies",
  fallbackDescription = "Enterprise digital engineering, scalable architecture, and AI automation.",
}: SeoHelperInputsProps) {
  const titleCount = metaTitle.length;
  const descCount = metaDescription.length;

  const displayTitle = metaTitle || fallbackTitle;
  const displayDesc = metaDescription || fallbackDescription;
  const siteUrl = "https://mark.com";

  return (
    <div className="space-y-4">
      {/* Live Google SERP Snippet Preview */}
      <div className="p-4 rounded-xl bg-surface-2/70 border border-[var(--color-border)] space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
          <Search size={13} className="text-[var(--color-accent-dark)]" />
          <span>Google Search SERP Preview</span>
        </div>

        <div className="p-3 bg-surface-1 rounded-lg border border-[var(--color-border)] text-left space-y-1 font-sans">
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <Globe size={11} />
            <span className="truncate">{siteUrl}{canonicalPath}</span>
          </div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
            {displayTitle} | MARK Technologies
          </p>
          <p className="text-xs text-text-secondary leading-snug line-clamp-2">
            {displayDesc}
          </p>
        </div>
      </div>

      {/* Meta Title Input with Counter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
            SEO Meta Title
          </label>
          <span
            className={`text-[11px] font-mono font-medium ${
              titleCount > 60
                ? "text-amber-500 font-bold"
                : titleCount >= 40
                ? "text-emerald-500"
                : "text-text-muted"
            }`}
          >
            {titleCount}/60 chars {titleCount > 60 && "(too long)"}
          </span>
        </div>
        <input
          type="text"
          value={metaTitle}
          onChange={(e) => onChangeMetaTitle(e.target.value)}
          placeholder={`e.g. ${fallbackTitle}`}
          className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
        />
        <p className="text-[11px] text-text-muted">
          Recommended length: 50-60 characters for optimal search engine display.
        </p>
      </div>

      {/* Meta Description Textarea with Counter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
            SEO Meta Description
          </label>
          <span
            className={`text-[11px] font-mono font-medium ${
              descCount > 160
                ? "text-amber-500 font-bold"
                : descCount >= 120
                ? "text-emerald-500"
                : "text-text-muted"
            }`}
          >
            {descCount}/160 chars {descCount > 160 && "(too long)"}
          </span>
        </div>
        <textarea
          rows={3}
          value={metaDescription}
          onChange={(e) => onChangeMetaDescription(e.target.value)}
          placeholder="Brief, persuasive summary that appears in search result snippets..."
          className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)] leading-relaxed"
        />
        <p className="text-[11px] text-text-muted">
          Recommended length: 120-160 characters for high click-through rates.
        </p>
      </div>

      {/* Keywords Chip Input */}
      {keywords && onChangeKeywords && (
        <ArrayInput
          label="Meta Keywords & Index Tags"
          items={keywords}
          onChange={onChangeKeywords}
          placeholder="Add keyword and press Enter..."
          helperText="Relevant search terms for internal search and indexing."
        />
      )}
    </div>
  );
}
