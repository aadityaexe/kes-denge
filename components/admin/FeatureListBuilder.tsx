"use client";

import React from "react";
import { Plus, Trash2, Layers } from "lucide-react";
import { VisualIconPicker } from "./VisualIconPicker";

export interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

interface FeatureListBuilderProps {
  label: string;
  items: FeatureItem[];
  onChange: (items: FeatureItem[]) => void;
  showIcon?: boolean;
  helperText?: string;
  emptyPrompt?: string;
}

export function FeatureListBuilder({
  label,
  items,
  onChange,
  showIcon = false,
  helperText,
  emptyPrompt = "No features added yet. Click '+ Add Feature' to start.",
}: FeatureListBuilderProps) {
  const handleItemChange = (index: number, field: keyof FeatureItem, val: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const addFeature = () => {
    onChange([
      ...items,
      {
        title: "",
        description: "",
        ...(showIcon ? { icon: "Layers" } : {}),
      },
    ]);
  };

  const removeFeature = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
            {label}
          </label>
          {helperText && <p className="text-[11px] text-text-muted mt-0.5">{helperText}</p>}
        </div>
        <button
          type="button"
          onClick={addFeature}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[var(--color-accent-dark)] hover:text-[var(--color-accent)] bg-[var(--color-accent-glow)] hover:bg-[var(--color-accent-glow)]/80 rounded-md transition-colors cursor-pointer"
        >
          <Plus size={13} />
          <span>Add Feature</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-5 border border-dashed border-[var(--color-border)] rounded-xl bg-surface-2/30">
          <p className="text-xs text-text-muted">{emptyPrompt}</p>
          <button
            type="button"
            onClick={addFeature}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent-dark)] hover:underline cursor-pointer"
          >
            <Plus size={12} /> Add first feature
          </button>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-surface-2/60 border border-[var(--color-border)] rounded-xl space-y-2.5 relative group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-text-muted px-2 py-0.5 rounded bg-surface-1 border border-[var(--color-border)]">
                  Feature #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  className="p-1 text-text-muted hover:text-red-500 rounded transition-colors cursor-pointer"
                  title="Remove feature"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-start">
                {showIcon && (
                  <div className="sm:col-span-4">
                    <VisualIconPicker
                      label="Feature Icon"
                      value={item.icon || "Layers"}
                      onChange={(ic) => handleItemChange(idx, "icon", ic)}
                    />
                  </div>
                )}
                <div className={showIcon ? "sm:col-span-8" : "sm:col-span-12"}>
                  <label className="block text-[11px] font-semibold text-text-primary mb-1">
                    Feature Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={item.title}
                    onChange={(e) => handleItemChange(idx, "title", e.target.value)}
                    placeholder="e.g. Edge Compute & Streaming SSR"
                    className="w-full px-3 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-primary mb-1">
                  Feature Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={item.description}
                  onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                  placeholder="Explain the technical capabilities, architecture, and business value delivered."
                  className="w-full px-3 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
