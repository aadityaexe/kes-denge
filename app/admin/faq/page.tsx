"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/Button";
import {
  Edit2,
  Trash2,
  Plus,
  CheckCircle2,
  EyeOff,
  ChevronDown,
  Tag,
} from "lucide-react";

interface FAQFormData {
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

const COMMON_CATEGORIES = [
  "General",
  "Engineering & Tech",
  "Pricing & Engagement",
  "Security & IP",
  "Timeline & Process",
];

const DEFAULT_FORM: FAQFormData = {
  question: "",
  answer: "",
  category: "General",
  order: 1,
  isActive: true,
};

export default function FAQAdminPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(true);
  const { addToast } = useToast();

  const [formData, setFormData] = useState<FAQFormData>(DEFAULT_FORM);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/faq");
      const data = await res.json();
      if (res.ok) setFaqs(data.faqs || []);
    } catch (err) {
      console.error("Error fetching faqs", err);
      addToast("Failed to load FAQs", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingFaq(null);
    setFormData({
      ...DEFAULT_FORM,
      order: faqs.length + 1,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (faq: any) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question || "",
      answer: faq.answer || "",
      category: faq.category || "General",
      order: faq.order ?? 0,
      isActive: faq.isActive ?? true,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const url = editingFaq ? `/api/admin/faq/${editingFaq._id}` : "/api/admin/faq";
      const method = editingFaq ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        addToast(
          editingFaq ? "FAQ updated successfully" : "New FAQ added successfully",
          "success"
        );
        fetchFaqs();
      } else {
        setFormError(data.error || "Failed to save FAQ");
        addToast(data.error || "Failed to save FAQ", "error");
      }
    } catch (err: any) {
      setFormError("An unexpected error occurred");
      addToast("An unexpected error occurred", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const toggleActive = async (faq: any) => {
    const nextActive = !faq.isActive;
    setFaqs((prev) =>
      prev.map((f) => (f._id === faq._id ? { ...f, isActive: nextActive } : f))
    );
    try {
      const res = await fetch(`/api/admin/faq/${faq._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextActive }),
      });
      if (!res.ok) throw new Error("Update failed");
      addToast(
        nextActive ? "FAQ published to live site" : "FAQ hidden from live site",
        "success"
      );
    } catch (e) {
      setFaqs((prev) =>
        prev.map((f) => (f._id === faq._id ? { ...f, isActive: faq.isActive } : f))
      );
      addToast("Failed to update status", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/faq/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        addToast("FAQ item deleted", "success");
        fetchFaqs();
      } else {
        addToast("Failed to delete FAQ item", "error");
      }
    } catch (err) {
      console.error("Failed to delete faq", err);
      addToast("Failed to delete FAQ item", "error");
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Order",
      accessorKey: "order",
      className: "w-14 font-mono text-center text-xs text-text-muted",
    },
    {
      header: "Category",
      cell: (row) => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-surface-2 border border-[var(--color-border)] text-text-secondary">
          <Tag size={10} className="text-[var(--color-accent)]" />
          {row.category || "General"}
        </span>
      ),
    },
    {
      header: "Question",
      cell: (row) => (
        <div className="font-semibold text-text-primary text-xs max-w-sm">
          {row.question}
        </div>
      ),
    },
    {
      header: "Answer",
      cell: (row) => (
        <p className="line-clamp-2 text-xs text-text-secondary max-w-md font-light">
          {row.answer}
        </p>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <button
          type="button"
          onClick={() => toggleActive(row)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
            row.isActive
              ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20"
              : "bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 border border-zinc-500/20"
          }`}
          title="Click to toggle visibility"
        >
          {row.isActive ? <CheckCircle2 size={12} /> : <EyeOff size={12} />}
          {row.isActive ? "Active" : "Hidden"}
        </button>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 rounded-md hover:bg-surface-3 text-text-secondary hover:text-text-primary transition-colors"
            title="Edit FAQ"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-600 transition-colors"
            title="Delete FAQ"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="FAQ Management"
        description="Add, edit, categorise, and reorder Frequently Asked Questions displayed across the website"
        actionButton={{
          label: "Add FAQ",
          onClick: openCreateModal,
          icon: Plus,
        }}
        onRefresh={fetchFaqs}
        isLoading={isLoading}
      />

      <div className="p-6 sm:p-8 max-w-7xl">
        <DataTable
          columns={columns}
          data={faqs}
          searchPlaceholder="Search questions and answers..."
          searchKey="question"
          isLoading={isLoading}
          emptyMessage="No FAQs created yet."
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFaq ? "Edit FAQ" : "Add FAQ"}
        description="Provide a clear, client-oriented question and answer pair"
        maxWidth="2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] text-text-muted font-mono">
              {formData.answer.length} chars
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-[var(--color-border)] text-text-secondary hover:bg-surface-2 transition-colors"
              >
                Cancel
              </button>
              <Button
                type="submit"
                form="faq-modal-form"
                size="sm"
                disabled={formLoading}
                className="text-xs font-semibold"
              >
                {formLoading ? "Saving..." : editingFaq ? "Update FAQ" : "Create FAQ"}
              </Button>
            </div>
          </div>
        }
      >
        {formError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs rounded-lg">
            {formError}
          </div>
        )}

        <form id="faq-modal-form" onSubmit={handleSave} className="space-y-5">
          {/* Question */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
              Question *
            </label>
            <input
              type="text"
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="e.g. What is your typical development timeframe for an MVP?"
              className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)] font-medium"
            />
          </div>

          {/* Answer */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                Answer *
              </label>
              <span className="text-[10px] text-text-muted">
                Keep explanations concise and helpful
              </span>
            </div>
            <textarea
              required
              rows={4}
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Provide an authentic, straightforward answer addressing client concerns..."
              className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          {/* Category & Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. General, Engineering, Pricing"
                className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {COMMON_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                      formData.category === cat
                        ? "bg-[var(--color-accent)]/15 border-[var(--color-accent)] text-[var(--color-accent)] font-medium"
                        : "bg-surface-2 border-[var(--color-border)] text-text-muted hover:text-text-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none focus:border-[var(--color-accent)]"
              />
              <p className="text-[10px] text-text-muted mt-1.5">
                Lower numbers appear first in the accordion list
              </p>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-[var(--color-accent)] accent-[var(--color-accent)]"
              />
              <span>Published on live site</span>
            </label>
          </div>

          {/* Live Accordion Preview */}
          <div className="p-4 rounded-xl bg-surface-2 border border-[var(--color-border)]">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-2.5">
              Live Accordion Preview
            </span>
            <div className="rounded-xl border border-[var(--color-border)] bg-surface-1 overflow-hidden">
              <button
                type="button"
                onClick={() => setPreviewOpen(!previewOpen)}
                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-surface-2/40 transition-colors"
              >
                <span className="text-xs font-semibold text-text-primary">
                  {formData.question || "Your question will appear here..."}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-text-muted transition-transform ${
                    previewOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {previewOpen && (
                <div className="p-3.5 pt-0 text-xs text-text-secondary border-t border-[var(--color-border)]/50 leading-relaxed font-light">
                  {formData.answer || "Your detailed answer will expand here..."}
                </div>
              )}
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this FAQ item? This action cannot be undone."
      />
    </div>
  );
}
