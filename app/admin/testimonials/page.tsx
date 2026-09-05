"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";
import { useToast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/Button";
import {
  Edit2,
  Trash2,
  Plus,
  Star,
  User,
  CheckCircle2,
  EyeOff,
  Award,
  Quote,
} from "lucide-react";

interface TestimonialFormData {
  clientName: string;
  company: string;
  role: string;
  photo: string;
  review: string;
  rating: number;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
}

const DEFAULT_FORM: TestimonialFormData = {
  clientName: "",
  company: "",
  role: "Founder & CEO",
  photo: "",
  review: "",
  rating: 5,
  isFeatured: true,
  isActive: true,
  order: 1,
};

const RATING_LABELS: Record<number, string> = {
  5: "5 Stars — Exceptional / Highly Recommended",
  4: "4 Stars — Very Good / Exceeded Expectations",
  3: "3 Stars — Satisfactory Delivery",
  2: "2 Stars — Fair",
  1: "1 Star — Poor",
};

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState<TestimonialFormData>(DEFAULT_FORM);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (res.ok) setTestimonials(data.testimonials || []);
    } catch (err) {
      console.error("Error fetching testimonials", err);
      addToast("Failed to load testimonials", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      ...DEFAULT_FORM,
      order: testimonials.length + 1,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      clientName: item.clientName || "",
      company: item.company || "",
      role: item.role || "Founder & CEO",
      photo: item.photo || "",
      review: item.review || "",
      rating: item.rating || 5,
      isFeatured: item.isFeatured ?? true,
      isActive: item.isActive ?? true,
      order: item.order ?? 0,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const url = editingItem
        ? `/api/admin/testimonials/${editingItem._id}`
        : "/api/admin/testimonials";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        addToast(
          editingItem ? "Testimonial updated successfully" : "New testimonial created",
          "success"
        );
        fetchTestimonials();
      } else {
        setFormError(data.error || "Failed to save testimonial");
        addToast(data.error || "Failed to save testimonial", "error");
      }
    } catch (err: any) {
      setFormError("An unexpected error occurred");
      addToast("An unexpected error occurred", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const toggleFeatured = async (item: any) => {
    const nextFeatured = !item.isFeatured;
    setTestimonials((prev) =>
      prev.map((t) => (t._id === item._id ? { ...t, isFeatured: nextFeatured } : t))
    );
    try {
      const res = await fetch(`/api/admin/testimonials/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: nextFeatured }),
      });
      if (!res.ok) throw new Error("Update failed");
      addToast(
        nextFeatured
          ? `Marked "${item.clientName}" as featured on homepage`
          : `Removed "${item.clientName}" from homepage featured`,
        "success"
      );
    } catch (e) {
      setTestimonials((prev) =>
        prev.map((t) => (t._id === item._id ? { ...t, isFeatured: item.isFeatured } : t))
      );
      addToast("Failed to update featured status", "error");
    }
  };

  const toggleActive = async (item: any) => {
    const nextActive = !item.isActive;
    setTestimonials((prev) =>
      prev.map((t) => (t._id === item._id ? { ...t, isActive: nextActive } : t))
    );
    try {
      const res = await fetch(`/api/admin/testimonials/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextActive }),
      });
      if (!res.ok) throw new Error("Update failed");
      addToast(
        nextActive
          ? `Published review by "${item.clientName}"`
          : `Hidden review by "${item.clientName}"`,
        "success"
      );
    } catch (e) {
      setTestimonials((prev) =>
        prev.map((t) => (t._id === item._id ? { ...t, isActive: item.isActive } : t))
      );
      addToast("Failed to update active status", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        addToast("Testimonial deleted successfully", "success");
        fetchTestimonials();
      } else {
        addToast("Failed to delete testimonial", "error");
      }
    } catch (err) {
      console.error("Failed to delete testimonial", err);
      addToast("Failed to delete testimonial", "error");
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Author",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-surface-3 border border-[var(--color-border)] overflow-hidden flex items-center justify-center text-text-muted shrink-0">
            {row.photo ? (
              <img src={row.photo} alt={row.clientName} className="w-full h-full object-cover" />
            ) : (
              <User size={15} />
            )}
          </div>
          <div>
            <div className="font-semibold text-text-primary text-xs flex items-center gap-1.5">
              {row.clientName}
              {row.isFeatured && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                  Featured
                </span>
              )}
            </div>
            <div className="text-[11px] text-text-muted">
              {row.role}, <span className="text-text-secondary font-medium">{row.company}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Review",
      cell: (row) => (
        <p className="line-clamp-2 text-xs text-text-secondary max-w-sm font-light italic">
          "{row.review}"
        </p>
      ),
    },
    {
      header: "Rating",
      cell: (row) => (
        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: row.rating || 5 }).map((_, i) => (
            <Star key={i} size={11} className="fill-amber-500" />
          ))}
          <span className="text-[10px] text-text-muted ml-1">({row.rating || 5})</span>
        </div>
      ),
    },
    {
      header: "Featured",
      cell: (row) => (
        <button
          type="button"
          onClick={() => toggleFeatured(row)}
          title={row.isFeatured ? "Click to unfeature" : "Click to feature on homepage"}
          className={`p-1.5 rounded-lg border transition-all ${
            row.isFeatured
              ? "bg-[var(--color-accent)]/15 border-[var(--color-accent)]/40 text-[var(--color-accent)]"
              : "bg-surface-2 border-transparent text-text-muted hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30"
          }`}
        >
          <Award size={13} className={row.isFeatured ? "fill-[var(--color-accent)]" : ""} />
        </button>
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
            title="Edit Testimonial"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-600 transition-colors"
            title="Delete Testimonial"
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
        title="Testimonials & Reviews"
        description="Manage client endorsements, ratings, avatar photos, and homepage social proof"
        actionButton={{
          label: "Add Testimonial",
          onClick: openCreateModal,
          icon: Plus,
        }}
        onRefresh={fetchTestimonials}
        isLoading={isLoading}
      />

      <div className="p-6 sm:p-8 max-w-7xl">
        <DataTable
          columns={columns}
          data={testimonials}
          searchPlaceholder="Search reviews by client or company..."
          searchKey="clientName"
          isLoading={isLoading}
          emptyMessage="No testimonials found."
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Testimonial" : "Add New Testimonial"}
        description="Enter authentic client review details, role credentials, and star rating"
        maxWidth="2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5 text-amber-500">
              {Array.from({ length: formData.rating }).map((_, i) => (
                <Star key={i} size={13} className="fill-amber-500" />
              ))}
              <span className="text-xs text-text-muted ml-1 font-mono">
                ({formData.rating} of 5)
              </span>
            </div>
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
                form="testimonial-modal-form"
                size="sm"
                disabled={formLoading}
                className="text-xs font-semibold shadow-sm"
              >
                {formLoading ? "Saving..." : editingItem ? "Update Testimonial" : "Create Testimonial"}
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

        <form id="testimonial-modal-form" onSubmit={handleSave} className="space-y-5">
          {/* Author Details */}
          <div className="p-4 rounded-xl bg-surface-2/60 border border-[var(--color-border)] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Nexa Health"
                  className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                  Role / Position
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Chief Technology Officer"
                  className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none"
                />
              </div>
            </div>

            <ImageUploadInput
              label="Client Avatar / Photo"
              value={formData.photo}
              onChange={(url) => setFormData({ ...formData, photo: url })}
              helperText="Upload or enter URL of client headshot"
            />
          </div>

          {/* Star Rating Interactive Picker */}
          <div className="p-4 rounded-xl bg-surface-2/60 border border-[var(--color-border)]">
            <label className="block text-xs font-semibold text-text-primary mb-2 uppercase tracking-wider">
              Star Rating *
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-surface-1 border border-[var(--color-border)]">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating ?? formData.rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 text-amber-500 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        size={20}
                        className={isFilled ? "fill-amber-500 text-amber-500" : "text-zinc-600"}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs text-text-secondary font-medium ml-2">
                {RATING_LABELS[hoverRating ?? formData.rating] || `${formData.rating} Stars`}
              </span>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="p-4 rounded-xl bg-surface-2/60 border border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                Review / Testimonial Text *
              </label>
              <span className="text-[10px] text-text-muted font-mono">
                {formData.review.length} chars
              </span>
            </div>
            <textarea
              required
              rows={4}
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              placeholder="Detail their satisfaction with software engineering, speed, architecture, or reliability..."
              className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)] leading-relaxed"
            />
          </div>

          {/* Status Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-[var(--color-accent)] accent-[var(--color-accent)]"
              />
              <span className="flex items-center gap-1.5">
                <Award size={12} className="text-[var(--color-accent)]" />
                Featured on Homepage
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-[var(--color-accent)] accent-[var(--color-accent)]"
              />
              <span>Active</span>
            </label>
          </div>

          {/* Live Preview Card */}
          <div className="p-4 rounded-xl bg-surface-2 border border-[var(--color-border)]">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-3">
              Live Card Preview
            </span>
            <div className="p-5 rounded-2xl bg-surface-1 border border-[var(--color-border)] relative">
              <Quote className="absolute top-4 right-4 text-[var(--color-accent)]/20" size={28} />
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {Array.from({ length: formData.rating }).map((_, i) => (
                  <Star key={i} size={12} className="fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-text-secondary italic mb-4 font-light leading-relaxed">
                "{formData.review || "Client endorsement text will appear here..."}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-border)]">
                <div className="w-8 h-8 rounded-full bg-surface-3 border border-[var(--color-border)] overflow-hidden flex items-center justify-center text-text-muted shrink-0">
                  {formData.photo ? (
                    <img
                      src={formData.photo}
                      alt={formData.clientName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={14} />
                  )}
                </div>
                <div>
                  <h5 className="font-semibold text-xs text-text-primary">
                    {formData.clientName || "Client Name"}
                  </h5>
                  <p className="text-[11px] text-text-muted">
                    {formData.role || "Role"}, {formData.company || "Company"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
      />
    </div>
  );
}
