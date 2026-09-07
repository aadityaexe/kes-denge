"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Plus,
  Check,
  Search,
  Layers,
  Sparkles,
  Loader2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/admin/Toast";

export interface CategoryItem {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  order?: number;
  isDefault?: boolean;
}

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: CategoryItem[];
  onCategoryCreated?: (newCategory: CategoryItem) => void;
  onCategoryDeleted?: (categoryId: string, name: string) => void;
  className?: string;
}

export function CategorySelect({
  value,
  onChange,
  categories = [],
  onCategoryCreated,
  onCategoryDeleted,
  className = "",
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);
  const { success, error: toastError } = useToast();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowAddForm(false);
        setCreateError("");
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setShowAddForm(false);
      setCreateError("");
      setSearchQuery("");
    }
  }, [isOpen]);

  // Focus add input when add form opens
  useEffect(() => {
    if (showAddForm) {
      setTimeout(() => {
        addInputRef.current?.focus();
      }, 50);
    }
  }, [showAddForm]);

  // Filter categories by search
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const selectedCategory = categories.find(
    (c) => c.name.toLowerCase() === (value || "").toLowerCase()
  );

  const handleSelect = (catName: string) => {
    onChange(catName);
    setIsOpen(false);
    setShowAddForm(false);
    setSearchQuery("");
  };

  const handleCreateCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) {
      setCreateError("Please enter a category name");
      return;
    }

    // Check if category already exists in current list
    const existing = categories.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) {
      onChange(existing.name);
      setIsOpen(false);
      setShowAddForm(false);
      setNewCatName("");
      success(`Selected existing category "${existing.name}"`);
      return;
    }

    setIsCreating(true);
    setCreateError("");

    try {
      const res = await fetch("/api/admin/products/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      const created: CategoryItem = data.category;
      if (onCategoryCreated) {
        onCategoryCreated(created);
      }

      // Automatically select newly created category
      onChange(created.name);
      setNewCatName("");
      setShowAddForm(false);
      setIsOpen(false);
      success(`Category "${created.name}" created and saved to database!`);
    } catch (err: any) {
      setCreateError(err.message || "Failed to create category");
      toastError(err.message || "Failed to create category");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCategory = async (e: React.MouseEvent, cat: CategoryItem) => {
    e.stopPropagation();
    if (!cat._id) return;

    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      return;
    }

    setDeletingId(cat._id);
    try {
      const res = await fetch(`/api/admin/products/categories?id=${cat._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      if (onCategoryDeleted) {
        onCategoryDeleted(cat._id, cat.name);
      }

      if (value.toLowerCase() === cat.name.toLowerCase()) {
        onChange("Custom");
      }
      success(data.message || `Category "${cat.name}" deleted`);
    } catch (err: any) {
      toastError(err.message || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Luxury Select Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs bg-surface-2 hover:bg-surface-1 border rounded-xl text-left transition-all duration-200 outline-none ${
          isOpen
            ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/15 shadow-sm"
            : "border-[var(--color-border)] hover:border-[var(--color-border)]/80"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-text-primary text-xs truncate">
              {value || "Select Category"}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface-1 border border-[var(--color-border)] text-text-muted font-mono tracking-wider uppercase">
              System
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 text-text-muted">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[var(--color-accent)]" : "group-hover:text-text-secondary"
            }`}
          />
        </div>
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-surface-1 border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-2 border-b border-[var(--color-border)] bg-surface-2/40">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3 text-text-muted pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or filter categories..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filtered.length === 1) {
                    e.preventDefault();
                    handleSelect(filtered[0].name);
                  }
                }}
              />
            </div>
          </div>

          {/* Categories List */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {filtered.length > 0 ? (
              filtered.map((cat) => {
                const isSelected =
                  (value || "").toLowerCase() === cat.name.toLowerCase();
                const isDeleting = deletingId === cat._id;

                return (
                  <div
                    key={cat._id || cat.name}
                    onClick={() => handleSelect(cat.name)}
                    className={`group/item flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] font-semibold border border-[var(--color-accent)]/20"
                        : "text-text-primary hover:bg-surface-2 hover:text-[var(--color-accent)]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          isSelected
                            ? "bg-[var(--color-accent)] scale-125"
                            : "bg-text-muted/30 group-hover/item:bg-[var(--color-accent)]/60"
                        }`}
                      />
                      <span className="truncate">{cat.name} System</span>
                      {cat.isDefault && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-2 text-text-muted font-mono">
                          core
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Delete option for non-default categories */}
                      {!cat.isDefault && cat._id && onCategoryDeleted && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCategory(e, cat)}
                          disabled={isDeleting}
                          title="Delete category"
                          className="opacity-0 group-hover/item:opacity-100 p-1 hover:text-red-500 rounded text-text-muted transition-opacity"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </button>
                      )}

                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[var(--color-accent)] flex-shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center">
                <p className="text-xs text-text-muted mb-2">
                  No category matching &ldquo;{searchQuery}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setNewCatName(searchQuery);
                    setShowAddForm(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--color-accent)] bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 rounded-lg transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Create &ldquo;{searchQuery}&rdquo;</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Action Footer: "+ Add New Category" */}
          <div className="p-2 border-t border-[var(--color-border)] bg-surface-2/30">
            {showAddForm ? (
              <form onSubmit={handleCreateCategory} className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-primary">
                  <Sparkles className="w-3 h-3 text-[var(--color-accent)]" />
                  <span>Create New Category in Database</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    ref={addInputRef}
                    type="text"
                    value={newCatName}
                    onChange={(e) => {
                      setNewCatName(e.target.value);
                      if (createError) setCreateError("");
                    }}
                    placeholder="e.g. Fintech, Logistics, EdTech..."
                    className="flex-1 px-2.5 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-accent)]"
                  />
                  <button
                    type="submit"
                    disabled={isCreating || !newCatName.trim()}
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-black transition-colors disabled:opacity-50"
                  >
                    {isCreating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setCreateError("");
                    }}
                    className="px-2 py-1.5 text-xs text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                {createError && (
                  <div className="flex items-center gap-1 text-[11px] text-red-500">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{createError}</span>
                  </div>
                )}
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(true);
                  setNewCatName(searchQuery || "");
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-[var(--color-accent)] hover:text-black bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)] rounded-xl border border-[var(--color-accent)]/20 transition-all duration-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Category</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
