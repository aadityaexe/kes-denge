"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

export interface KeyValueItem {
  key: string;
  value: string;
  extra?: string;
}

interface KeyValueListBuilderProps {
  label: string;
  items: KeyValueItem[];
  onChange: (items: KeyValueItem[]) => void;
  keyLabel?: string;
  keyPlaceholder?: string;
  valueLabel?: string;
  valuePlaceholder?: string;
  hasExtra?: boolean;
  extraLabel?: string;
  extraPlaceholder?: string;
  helperText?: string;
  emptyPrompt?: string;
}

export function KeyValueListBuilder({
  label,
  items,
  onChange,
  keyLabel = "Key",
  keyPlaceholder = "Label / Question / Metric",
  valueLabel = "Value",
  valuePlaceholder = "Description / Answer",
  hasExtra = false,
  extraLabel = "Extra",
  extraPlaceholder = "Additional context",
  helperText,
  emptyPrompt = "No items added yet. Click '+ Add Row' to start.",
}: KeyValueListBuilderProps) {
  const handleItemChange = (index: number, field: keyof KeyValueItem, val: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const addRow = () => {
    onChange([...items, { key: "", value: "", ...(hasExtra ? { extra: "" } : {}) }]);
  };

  const removeRow = (index: number) => {
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
          onClick={addRow}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[var(--color-accent-dark)] hover:text-[var(--color-accent)] bg-[var(--color-accent-glow)] hover:bg-[var(--color-accent-glow)]/80 rounded-md transition-colors cursor-pointer"
        >
          <Plus size={13} />
          <span>Add Row</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-5 border border-dashed border-[var(--color-border)] rounded-xl bg-surface-2/30">
          <p className="text-xs text-text-muted">{emptyPrompt}</p>
          <button
            type="button"
            onClick={addRow}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent-dark)] hover:underline cursor-pointer"
          >
            <Plus size={12} /> Add first row
          </button>
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 bg-surface-2/60 border border-[var(--color-border)] rounded-xl space-y-2 relative group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-text-muted px-1.5 py-0.5 rounded bg-surface-1 border border-[var(--color-border)]">
                  #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeRow(idx)}
                  className="p-1 text-text-muted hover:text-red-500 rounded transition-colors cursor-pointer"
                  title="Delete row"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className={`grid ${hasExtra ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"} gap-2`}>
                <div>
                  <input
                    type="text"
                    value={item.key}
                    onChange={(e) => handleItemChange(idx, "key", e.target.value)}
                    placeholder={keyPlaceholder}
                    aria-label={keyLabel}
                    className="w-full px-2.5 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => handleItemChange(idx, "value", e.target.value)}
                    placeholder={valuePlaceholder}
                    aria-label={valueLabel}
                    className="w-full px-2.5 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
                {hasExtra && (
                  <div>
                    <input
                      type="text"
                      value={item.extra || ""}
                      onChange={(e) => handleItemChange(idx, "extra", e.target.value)}
                      placeholder={extraPlaceholder}
                      aria-label={extraLabel}
                      className="w-full px-2.5 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
