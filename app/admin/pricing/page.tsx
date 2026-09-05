"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ArrayInput } from "@/components/admin/ArrayInput";
import { useToast } from "@/components/admin/Toast";
import { Button } from "@/components/ui/Button";
import {
  Edit2,
  Trash2,
  Plus,
  Star,
  ExternalLink,
  Check,
  CheckCircle2,
  EyeOff,
  Layers,
} from "lucide-react";
import Link from "next/link";

interface PricingTierForm {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
  ctaHref: string;
  order: number;
  isActive: boolean;
}

const DEFAULT_FORM: PricingTierForm = {
  name: "",
  price: "$15,000",
  period: "project",
  description: "",
  features: [
    "Complete system architecture",
    "Full-stack web or mobile app",
    "CI/CD automated pipeline",
    "30 days post-launch warranty",
  ],
  isPopular: false,
  ctaText: "Start a Project",
  ctaHref: "/contact",
  order: 1,
  isActive: true,
};

export default function PricingAdminPage() {
  const [pricing, setPricing] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const { addToast } = useToast();

  const [formData, setFormData] = useState<PricingTierForm>(DEFAULT_FORM);

  const fetchPricing = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/pricing");
      const data = await res.json();
      if (res.ok) setPricing(data.pricing || []);
    } catch (err) {
      console.error("Error fetching pricing", err);
      addToast("Failed to fetch pricing tiers", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const openCreateModal = () => {
    setEditingTier(null);
    setFormData({
      ...DEFAULT_FORM,
      order: pricing.length + 1,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (tier: any) => {
    setEditingTier(tier);
    const parsedFeatures = Array.isArray(tier.features)
      ? tier.features
          .map((f: any) => (typeof f === "string" ? f : f?.text || ""))
          .filter(Boolean)
      : [];

    setFormData({
      name: tier.name || "",
      price: tier.price || "$15,000",
      period: tier.period || "project",
      description: tier.description || "",
      features: parsedFeatures,
      isPopular: tier.isPopular ?? false,
      ctaText: tier.ctaText || "Get Started",
      ctaHref: tier.ctaHref || "/contact",
      order: tier.order ?? 0,
      isActive: tier.isActive ?? true,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    const payload = {
      ...formData,
      features: formData.features.map((text) => ({ text: text.trim(), included: true })),
    };

    try {
      const url = editingTier ? `/api/admin/pricing/${editingTier._id}` : "/api/admin/pricing";
      const method = editingTier ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        addToast(
          editingTier ? "Pricing tier updated successfully" : "New pricing tier created",
          "success"
        );
        fetchPricing();
      } else {
        setFormError(data.error || "Failed to save pricing tier");
        addToast(data.error || "Failed to save pricing tier", "error");
      }
    } catch (err: any) {
      setFormError("An unexpected error occurred");
      addToast("An unexpected error occurred", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const togglePopular = async (tier: any) => {
    const nextPopular = !tier.isPopular;
    setPricing((prev) =>
      prev.map((t) => (t._id === tier._id ? { ...t, isPopular: nextPopular } : t))
    );
    try {
      const res = await fetch(`/api/admin/pricing/${tier._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPopular: nextPopular }),
      });
      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      addToast(
        nextPopular
          ? `"${tier.name}" marked as Most Popular`
          : `Removed Most Popular badge from "${tier.name}"`,
        "success"
      );
    } catch (e) {
      setPricing((prev) =>
        prev.map((t) => (t._id === tier._id ? { ...t, isPopular: tier.isPopular } : t))
      );
      addToast("Failed to update popular status", "error");
    }
  };

  const toggleActive = async (tier: any) => {
    const nextActive = !tier.isActive;
    setPricing((prev) =>
      prev.map((t) => (t._id === tier._id ? { ...t, isActive: nextActive } : t))
    );
    try {
      const res = await fetch(`/api/admin/pricing/${tier._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextActive }),
      });
      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      addToast(
        nextActive ? `"${tier.name}" is now active` : `"${tier.name}" is now hidden`,
        "success"
      );
    } catch (e) {
      setPricing((prev) =>
        prev.map((t) => (t._id === tier._id ? { ...t, isActive: tier.isActive } : t))
      );
      addToast("Failed to update active status", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/pricing/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        addToast("Pricing tier deleted successfully", "success");
        fetchPricing();
      } else {
        addToast("Failed to delete pricing tier", "error");
      }
    } catch (err) {
      console.error("Failed to delete pricing tier", err);
      addToast("Failed to delete pricing tier", "error");
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Order",
      accessorKey: "order",
      className: "w-14 font-mono text-center text-xs text-text-muted",
    },
    {
      header: "Tier Name",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary text-xs">{row.name}</span>
          {row.isPopular && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1">
              <Star size={9} className="fill-amber-500 text-amber-500" />
              Popular
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Price",
      cell: (row) => (
        <div className="font-mono text-xs font-bold text-text-primary">
          {row.price} <span className="text-text-muted font-normal text-[11px]">/{row.period}</span>
        </div>
      ),
    },
    {
      header: "Features",
      cell: (row) => {
        const count = Array.isArray(row.features) ? row.features.length : 0;
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-surface-2 border border-[var(--color-border)] text-text-secondary">
            <Layers size={11} className="text-[var(--color-accent)]" />
            {count} items
          </span>
        );
      },
    },
    {
      header: "Description",
      cell: (row) => (
        <p className="line-clamp-2 text-xs text-text-secondary max-w-xs font-light">
          {row.description}
        </p>
      ),
    },
    {
      header: "Popular",
      cell: (row) => (
        <button
          type="button"
          onClick={() => togglePopular(row)}
          title={row.isPopular ? "Click to unmark as popular" : "Click to mark as popular"}
          className={`p-1.5 rounded-lg border transition-all ${
            row.isPopular
              ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
              : "bg-surface-2 border-transparent text-text-muted hover:text-amber-500 hover:border-amber-500/30"
          }`}
        >
          <Star size={13} className={row.isPopular ? "fill-amber-500" : ""} />
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
            title="Edit tier"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-600 transition-colors"
            title="Delete tier"
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
        title="Pricing Packages"
        description="Manage engagement tiers, pricing models, deliverables, and CTA buttons"
        actionButton={{
          label: "Add Tier",
          onClick: openCreateModal,
          icon: Plus,
        }}
        onRefresh={fetchPricing}
        isLoading={isLoading}
      />

      <div className="p-6 sm:p-8 max-w-7xl">
        {/* Quick link banner */}
        <div className="mb-6 p-4 rounded-xl bg-surface-2 border border-[var(--color-border)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center">
              <Layers size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary">
                Live Pricing Page Overview
              </p>
              <p className="text-[11px] text-text-muted">
                Tiers marked as Active appear automatically in the public comparison grid.
              </p>
            </div>
          </div>
          <Link
            href="/pricing"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--color-border)] text-text-secondary hover:text-text-primary hover:bg-surface-3 transition-colors shrink-0"
          >
            <ExternalLink size={12} />
            View /pricing
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={pricing}
          searchPlaceholder="Search tiers..."
          searchKey="name"
          isLoading={isLoading}
          emptyMessage="No pricing packages found."
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTier ? "Edit Pricing Tier" : "Add Pricing Tier"}
        description="Configure deliverables, cost structure, highlight styling, and conversion CTA"
        maxWidth="2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <Link
              href="/pricing"
              target="_blank"
              className="inline-flex items-center gap-1 text-[11px] text-text-muted hover:text-[var(--color-accent)] transition-colors"
            >
              <ExternalLink size={11} />
              Preview /pricing
            </Link>
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
                form="pricing-tier-form"
                size="sm"
                disabled={formLoading}
                className="text-xs font-semibold shadow-sm"
              >
                {formLoading ? "Saving..." : editingTier ? "Update Tier" : "Create Tier"}
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

        <form id="pricing-tier-form" onSubmit={handleSave} className="space-y-6">
          {/* Main Info */}
          <div className="p-4 rounded-xl bg-surface-2/60 border border-[var(--color-border)] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                  Tier Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. MVP Sprint"
                  className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                  Price Label *
                </label>
                <input
                  type="text"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. $15,000"
                  className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                  Billing Period
                </label>
                <input
                  type="text"
                  required
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="e.g. project, month, sprint"
                  className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                Short Description *
              </label>
              <textarea
                required
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ideal for early-stage founders launching an initial product in 4 weeks."
                className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          {/* Features Tag/List Input */}
          <div className="p-4 rounded-xl bg-surface-2/60 border border-[var(--color-border)]">
            <ArrayInput
              label="Included Deliverables & Features"
              value={formData.features}
              onChange={(features) => setFormData({ ...formData, features })}
              placeholder="e.g. Dedicated Slack channel, CI/CD pipeline (Press Enter)"
              helperText="Press Enter or click Add to append deliverables. Click any badge '×' to remove."
            />
          </div>

          {/* CTA & Positioning */}
          <div className="p-4 rounded-xl bg-surface-2/60 border border-[var(--color-border)] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                  Button Text
                </label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                  Button Link
                </label>
                <input
                  type="text"
                  value={formData.ctaHref}
                  onChange={(e) => setFormData({ ...formData, ctaHref: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[var(--color-border)]">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  className="w-4 h-4 rounded text-[var(--color-accent)] accent-[var(--color-accent)]"
                />
                <span className="flex items-center gap-1.5">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  Highlight as "Most Popular"
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[var(--color-accent)] accent-[var(--color-accent)]"
                />
                <span>Active on live site</span>
              </label>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-4 rounded-xl bg-surface-2 border border-[var(--color-border)]">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-3">
              Live Preview
            </span>
            <div
              className={`rounded-2xl p-5 border transition-all ${
                formData.isPopular
                  ? "bg-surface-1 border-[var(--color-accent)] shadow-lg"
                  : "bg-surface-1 border-[var(--color-border)]"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-bold text-sm text-text-primary">
                  {formData.name || "Untitled Tier"}
                </h4>
                {formData.isPopular && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-accent)] text-white uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary mb-4 line-clamp-2">
                {formData.description || "Description preview will appear here..."}
              </p>
              <div className="mb-4">
                <span className="text-lg font-bold text-text-primary">{formData.price}</span>
                <span className="text-xs text-text-muted ml-1.5">/ {formData.period}</span>
              </div>
              <div className="space-y-1.5 pt-3 border-t border-[var(--color-border)]">
                {formData.features.slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                    <Check size={12} className="text-[var(--color-accent)] shrink-0" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
                {formData.features.length > 4 && (
                  <p className="text-[10px] text-text-muted italic">
                    +{formData.features.length - 4} more deliverables
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this pricing package? This will permanently remove it from the database."
      />
    </div>
  );
}
