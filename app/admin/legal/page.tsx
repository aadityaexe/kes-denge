"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/Toast";
import {
  ShieldCheck,
  Scale,
  Save,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Info,
  Calendar,
  Mail,
  Tag,
  FileText,
} from "lucide-react";

interface LegalSection {
  title: string;
  content: string;
  order?: number;
}

interface LegalDocState {
  _id?: string;
  type: "privacy" | "terms";
  title: string;
  subtitle: string;
  badge: string;
  lastUpdated: string;
  contactEmail: string;
  sections: LegalSection[];
}

export default function LegalAdminPage() {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedRoute, setCopiedRoute] = useState<string | null>(null);

  const [privacyDoc, setPrivacyDoc] = useState<LegalDocState>({
    type: "privacy",
    title: "Privacy Policy",
    subtitle: "",
    badge: "Legal & Security",
    lastUpdated: "September 2026",
    contactEmail: "hello@mark2.in",
    sections: [],
  });

  const [termsDoc, setTermsDoc] = useState<LegalDocState>({
    type: "terms",
    title: "Terms & Conditions",
    subtitle: "",
    badge: "Legal & Contracts",
    lastUpdated: "September 2026",
    contactEmail: "hello@mark2.in",
    sections: [],
  });

  const { success, error: toastError } = useToast();

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/legal");
      const data = await res.json();
      if (res.ok) {
        if (data.privacy) setPrivacyDoc(data.privacy);
        if (data.terms) setTermsDoc(data.terms);
      } else {
        toastError(data.error || "Failed to load legal documents");
      }
    } catch (err) {
      console.error("Error loading legal docs:", err);
      toastError("Failed to connect to database");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const currentDoc = activeTab === "privacy" ? privacyDoc : termsDoc;
  const setCurrentDoc = activeTab === "privacy" ? setPrivacyDoc : setTermsDoc;

  const handleFieldChange = (field: keyof LegalDocState, value: string) => {
    setCurrentDoc((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSectionChange = (index: number, field: "title" | "content", value: string) => {
    setCurrentDoc((prev) => {
      const updated = [...prev.sections];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, sections: updated };
    });
  };

  const handleAddSection = () => {
    setCurrentDoc((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: `${prev.sections.length + 1}. New Clause Title`,
          content: "Enter the detailed terms, guidelines, or policy commitments for this clause...",
          order: prev.sections.length + 1,
        },
      ],
    }));
  };

  const handleRemoveSection = (index: number) => {
    setCurrentDoc((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    setCurrentDoc((prev) => {
      const updated = [...prev.sections];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return { ...prev, sections: updated };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/legal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          data: currentDoc,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        success(`${activeTab === "privacy" ? "Privacy Policy" : "Terms & Conditions"} updated & published`);
      } else {
        toastError(data.error || "Failed to save document");
      }
    } catch (err) {
      console.error("Save error:", err);
      toastError("Network error while saving document");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyUrl = (route: string) => {
    const fullUrl = `${window.location.origin}${route}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedRoute(route);
    success(`Copied ${fullUrl} to clipboard`);
    setTimeout(() => setCopiedRoute(null), 2000);
  };

  const activeRoute = activeTab === "privacy" ? "/privacy" : "/terms";

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Policy & Terms"
        description="Edit and publish dynamic Privacy Policy and Terms & Conditions directly backed by database"
        actionButton={{
          label: isSaving ? "Saving..." : `Save ${activeTab === "privacy" ? "Policy" : "Terms"}`,
          onClick: handleSave,
          icon: Save,
        }}
        onRefresh={fetchDocuments}
        isLoading={isLoading}
      />

      <div className="p-4 sm:p-6 md:p-8 max-w-7xl space-y-6">
        {/* Document Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Privacy Policy Tab */}
          <div
            onClick={() => setActiveTab("privacy")}
            className={`p-5 sm:p-6 rounded-2xl bg-surface-1 border transition-all duration-200 cursor-pointer shadow-xs ${
              activeTab === "privacy"
                ? "border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30"
                : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-text-primary">
                    {privacyDoc.title || "Privacy Policy"}
                  </h2>
                  <span className="text-xs text-text-secondary">
                    {privacyDoc.sections.length} clauses configured
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live in DB
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 mb-4">
              {privacyDoc.subtitle || "Data protection, operational logs, encryption standards, and client NDA guarantees."}
            </p>

            <div className="pt-3.5 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-text-primary bg-surface-2 px-2 py-1 rounded-md border border-[var(--color-border)]">
                  /privacy
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl("/privacy");
                  }}
                  className="text-text-muted hover:text-text-primary p-1 rounded transition-colors"
                  title="Copy URL"
                >
                  {copiedRoute === "/privacy" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>

              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 font-medium text-[var(--color-accent-dark)] hover:underline"
              >
                <span>Live Preview</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Terms & Conditions Tab */}
          <div
            onClick={() => setActiveTab("terms")}
            className={`p-5 sm:p-6 rounded-2xl bg-surface-1 border transition-all duration-200 cursor-pointer shadow-xs ${
              activeTab === "terms"
                ? "border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30"
                : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Scale size={20} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-text-primary">
                    {termsDoc.title || "Terms & Conditions"}
                  </h2>
                  <span className="text-xs text-text-secondary">
                    {termsDoc.sections.length} clauses configured
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Live in DB
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 mb-4">
              {termsDoc.subtitle || "SOW milestones, code ownership assignment, client dependencies, and governing law."}
            </p>

            <div className="pt-3.5 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-text-primary bg-surface-2 px-2 py-1 rounded-md border border-[var(--color-border)]">
                  /terms
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl("/terms");
                  }}
                  className="text-text-muted hover:text-text-primary p-1 rounded transition-colors"
                  title="Copy URL"
                >
                  {copiedRoute === "/terms" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>

              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 font-medium text-[var(--color-accent-dark)] hover:underline"
              >
                <span>Live Preview</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Editor Form Card */}
        <div className="p-5 sm:p-7 rounded-2xl bg-surface-1 border border-[var(--color-border)] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[var(--color-border)]">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
                <FileText size={18} className="text-[var(--color-accent-dark)]" />
                <span>
                  Editing {activeTab === "privacy" ? "Privacy Policy" : "Terms & Conditions"}
                </span>
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Changes saved here update the live {activeRoute} route immediately
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={activeRoute}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-3.5 rounded-xl bg-surface-2 hover:bg-surface-3 border border-[var(--color-border)] text-text-primary text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open Live Page</span>
                <ExternalLink size={13} />
              </a>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="h-9 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium inline-flex items-center gap-1.5 shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Save size={13} />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>

          {/* Document Header Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1.5">
                Document Title
              </label>
              <input
                type="text"
                value={currentDoc.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-surface-2 border border-[var(--color-border)] text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="e.g. Privacy Policy"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1.5">
                Badge / Category
              </label>
              <input
                type="text"
                value={currentDoc.badge}
                onChange={(e) => handleFieldChange("badge", e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-surface-2 border border-[var(--color-border)] text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="e.g. Legal & Security"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1.5">
                Last Updated Date Text
              </label>
              <input
                type="text"
                value={currentDoc.lastUpdated}
                onChange={(e) => handleFieldChange("lastUpdated", e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-surface-2 border border-[var(--color-border)] text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="e.g. September 2026"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-primary block mb-1.5">
                Legal Contact Email
              </label>
              <input
                type="email"
                value={currentDoc.contactEmail}
                onChange={(e) => handleFieldChange("contactEmail", e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-surface-2 border border-[var(--color-border)] text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="hello@mark2.in"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <label className="text-xs font-semibold text-text-primary block mb-1.5">
                Document Subtitle / Headline Description
              </label>
              <input
                type="text"
                value={currentDoc.subtitle}
                onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-surface-2 border border-[var(--color-border)] text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                placeholder="Brief explanatory subtitle displayed beneath page title"
              />
            </div>
          </div>

          {/* Section Clauses Management */}
          <div className="pt-4 border-t border-[var(--color-border)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-text-primary">
                  Document Clauses &amp; Sections ({currentDoc.sections.length})
                </h4>
                <p className="text-xs text-text-secondary">
                  Add, edit, reorder, or delete specific legal sections
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSection}
                className="h-8 px-3 rounded-lg bg-[var(--color-accent)]/15 text-[var(--color-accent-dark)] hover:bg-[var(--color-accent)]/25 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Clause</span>
              </button>
            </div>

            {currentDoc.sections.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-surface-2 border border-dashed border-[var(--color-border)]">
                <p className="text-xs text-text-muted mb-2">No clauses created yet.</p>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-medium inline-flex items-center gap-1.5"
                >
                  <Plus size={13} />
                  <span>Add First Clause</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentDoc.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-xl bg-surface-2/60 border border-[var(--color-border)] space-y-3 hover:border-[var(--color-border-hover)] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-6 h-6 rounded-md bg-surface-1 border border-[var(--color-border)] flex items-center justify-center text-[11px] font-mono font-bold text-text-muted shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => handleSectionChange(idx, "title", e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-surface-1 border border-[var(--color-border)] text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                          placeholder="Clause Title (e.g. 1. Overview & Commitment)"
                        />
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveSection(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-1 disabled:opacity-30 transition-colors cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSection(idx, "down")}
                          disabled={idx === currentDoc.sections.length - 1}
                          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-1 disabled:opacity-30 transition-colors cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(idx)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete Clause"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <textarea
                        rows={4}
                        value={section.content}
                        onChange={(e) => handleSectionChange(idx, "content", e.target.value)}
                        className="w-full p-3 text-xs sm:text-sm leading-relaxed rounded-lg bg-surface-1 border border-[var(--color-border)] text-text-secondary focus:outline-none focus:border-[var(--color-accent)] focus:text-text-primary transition-colors resize-y"
                        placeholder="Clause description, contractual details, and regulatory statements..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Add & Save buttons */}
            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={handleAddSection}
                className="h-9 px-3.5 rounded-xl bg-surface-2 hover:bg-surface-3 border border-[var(--color-border)] text-text-primary text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Another Clause</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="h-9 px-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium inline-flex items-center gap-1.5 shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Save size={14} />
                <span>{isSaving ? "Saving..." : `Save ${activeTab === "privacy" ? "Privacy Policy" : "Terms & Conditions"}`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
