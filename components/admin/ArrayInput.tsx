"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface ArrayInputProps {
  label: string;
  items?: string[];
  value?: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  helperText?: string;
}

export function ArrayInput({
  label,
  items: propsItems,
  value,
  onChange,
  placeholder = "Type item and press Enter...",
  helperText,
}: ArrayInputProps) {
  const items = value || propsItems || [];
  const [inputVal, setInputVal] = useState("");

  const addItem = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    
    // Check if user pasted comma or newline separated values
    if (trimmed.includes(",") || trimmed.includes("\n")) {
      const parts = trimmed
        .split(/[,\n]/)
        .map((p) => p.trim())
        .filter((p) => p && !items.includes(p));
      if (parts.length > 0) {
        onChange([...items, ...parts]);
        setInputVal("");
        return;
      }
    }

    if (!items.includes(trimmed)) {
      onChange([...items, trimmed]);
    }
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem(inputVal);
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
          {label}
        </label>
        <span className="text-[11px] font-mono text-text-muted">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-accent)]"
        />
        <button
          type="button"
          onClick={() => addItem(inputVal)}
          disabled={!inputVal.trim()}
          className="px-3 py-2 bg-surface-2 hover:bg-surface-3 text-text-primary border border-[var(--color-border)] rounded-lg text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <Plus size={14} />
          <span>Add</span>
        </button>
      </div>

      {helperText && <p className="text-[11px] text-text-muted">{helperText}</p>}

      {/* Tags Chips Display */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-surface-2/40 border border-[var(--color-border)] rounded-xl min-h-[42px] max-h-40 overflow-y-auto">
          {items.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-1 border border-[var(--color-border)] text-text-primary text-xs shadow-2xs group hover:border-[var(--color-accent)]/50 transition-colors"
            >
              <span className="max-w-[240px] truncate">{item}</span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-text-muted hover:text-red-500 rounded p-0.5 transition-colors cursor-pointer"
                title="Remove item"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
