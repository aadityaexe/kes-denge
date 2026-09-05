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
  Building2,
  ExternalLink,
  CheckCircle2,
  EyeOff,
  Star,
} from "lucide-react";

interface ClientFormData {
  name: string;
  slug: string;
  logoUrl: string;
  industry: string;
  website: string;
  tagline: string;
  description: string;
  aboutPartnership: string;
  servicesProvided: string;
  partnershipYear: string;
  companySize: string;
  location: string;
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialRole: string;
  keyAchievements: string;
  technologies: string;
  caseStudySlug: string;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
}

const DEFAULT_FORM: ClientFormData = {
  name: "",
  slug: "",
  logoUrl: "",
  industry: "Enterprise SaaS",
  website: "",
  tagline: "",
  description: "",
  aboutPartnership: "",
  servicesProvided: "Cloud Architecture, Full-Stack Engineering, UI/UX Design",
  partnershipYear: "2024 - Present",
  companySize: "50-250 Employees",
  location: "San Francisco, CA",
  testimonialQuote: "",
  testimonialAuthor: "",
  testimonialRole: "",
  keyAchievements: "",
  technologies: "Next.js, TypeScript, PostgreSQL, AWS",
  caseStudySlug: "",
  isFeatured: true,
  isActive: true,
  order: 1,
};

export default function ClientsAdminPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const { addToast } = useToast();

  const [formData, setFormData] = useState<ClientFormData>(DEFAULT_FORM);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/clients");
      const data = await res.json();
      if (res.ok) setClients(data.clients || []);
    } catch (err) {
      console.error("Error fetching clients", err);
      addToast("Failed to fetch clients", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openCreateModal = () => {
    setEditingClient(null);
    setFormData({
      ...DEFAULT_FORM,
      order: clients.length + 1,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (client: any) => {
    setEditingClient(client);
    setFormData({
      name: client.name || "",
      slug: client.slug || "",
      logoUrl: client.logoUrl || "",
      industry: client.industry || "Enterprise SaaS",
      website: client.website || "",
      tagline: client.tagline || "",
      description: client.description || "",
      aboutPartnership: client.aboutPartnership || "",
      servicesProvided: Array.isArray(client.servicesProvided)
        ? client.servicesProvided.join(", ")
        : client.servicesProvided || "",
      partnershipYear: client.partnershipYear || "",
      companySize: client.companySize || "",
      location: client.location || "",
      testimonialQuote: client.testimonialQuote || client.testimonial?.quote || "",
      testimonialAuthor: client.testimonialAuthor || client.testimonial?.authorName || "",
      testimonialRole: client.testimonialRole || client.testimonial?.authorRole || "",
      keyAchievements: Array.isArray(client.keyAchievements)
        ? client.keyAchievements.join("\n")
        : client.keyAchievements || "",
      technologies: Array.isArray(client.technologies)
        ? client.technologies.join(", ")
        : client.technologies || "",
      caseStudySlug: client.caseStudySlug || "",
      isFeatured: client.isFeatured ?? true,
      isActive: client.isActive ?? true,
      order: client.order ?? 0,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const payload = {
        ...formData,
        servicesProvided: formData.servicesProvided
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        technologies: formData.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        keyAchievements: formData.keyAchievements
          .split("\n")
          .map((k) => k.trim())
          .filter(Boolean),
      };

      const url = editingClient
        ? `/api/admin/clients/${editingClient._id}`
        : "/api/admin/clients";
      const method = editingClient ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        addToast(
          editingClient ? "Client updated successfully" : "New client brand added",
          "success"
        );
        fetchClients();
      } else {
        setFormError(data.error || "Failed to save client");
        addToast(data.error || "Failed to save client", "error");
      }
    } catch (err: any) {
      setFormError("An unexpected error occurred");
      addToast("An unexpected error occurred", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const toggleFeatured = async (client: any) => {
    const nextFeatured = !client.isFeatured;
    setClients((prev) =>
      prev.map((c) => (c._id === client._id ? { ...c, isFeatured: nextFeatured } : c))
    );
    try {
      const res = await fetch(`/api/admin/clients/${client._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: nextFeatured }),
      });
      if (!res.ok) throw new Error("Update failed");
      addToast(
        nextFeatured
          ? `Added "${client.name}" to logo marquee`
          : `Removed "${client.name}" from logo marquee`,
        "success"
      );
    } catch (e) {
      setClients((prev) =>
        prev.map((c) => (c._id === client._id ? { ...c, isFeatured: client.isFeatured } : c))
      );
      addToast("Failed to update marquee status", "error");
    }
  };

  const toggleActive = async (client: any) => {
    const nextActive = !client.isActive;
    setClients((prev) =>
      prev.map((c) => (c._id === client._id ? { ...c, isActive: nextActive } : c))
    );
    try {
      const res = await fetch(`/api/admin/clients/${client._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextActive }),
      });
      if (!res.ok) throw new Error("Update failed");
      addToast(
        nextActive ? `"${client.name}" is now active` : `"${client.name}" is now hidden`,
        "success"
      );
    } catch (e) {
      setClients((prev) =>
        prev.map((c) => (c._id === client._id ? { ...c, isActive: client.isActive } : c))
      );
      addToast("Failed to update active status", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/clients/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        addToast("Client deleted successfully", "success");
        fetchClients();
      } else {
        addToast("Failed to delete client", "error");
      }
    } catch (err) {
      console.error("Failed to delete client", err);
      addToast("Failed to delete client", "error");
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Order",
      accessorKey: "order",
      className: "w-14 font-mono text-center text-xs text-text-muted",
    },
    {
      header: "Client & Logo",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-2 border border-[var(--color-border)] p-1.5 flex items-center justify-center text-text-muted shrink-0">
            {row.logoUrl ? (
              <img src={row.logoUrl} alt={row.name} className="w-full h-full object-contain" />
            ) : (
              <Building2 size={18} className="text-text-muted" />
            )}
          </div>
          <div>
            <div className="font-semibold text-text-primary text-xs">{row.name}</div>
            <div className="text-[11px] text-text-muted">{row.industry}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Marquee",
      cell: (row) => (
        <button
          type="button"
          onClick={() => toggleFeatured(row)}
          title={row.isFeatured ? "Click to remove from Marquee" : "Click to show in Marquee"}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
            row.isFeatured
              ? "bg-purple-500/10 border-purple-500/30 text-purple-600 hover:bg-purple-500/20"
              : "bg-surface-2 border-transparent text-text-muted hover:border-[var(--color-border)]"
          }`}
        >
          <Star size={11} className={row.isFeatured ? "fill-purple-600 text-purple-600" : ""} />
          {row.isFeatured ? "In Marquee" : "Standard"}
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
      cell: (row) => {
        const clientSlug = row.slug || (row.name || "client").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        return (
          <div className="flex items-center justify-end gap-1.5">
            <a
              href={`/clients/${clientSlug}`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-md hover:bg-surface-3 text-text-muted hover:text-[var(--color-accent-dark)]"
              title="View Live Profile Page"
            >
              <ExternalLink size={14} />
            </a>
            {row.website && (
              <a
                href={row.website}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-md hover:bg-surface-3 text-text-muted hover:text-text-primary"
                title="Visit Company Website"
              >
                <Building2 size={14} />
              </a>
            )}
            <button
              onClick={() => openEditModal(row)}
              className="p-1.5 rounded-md hover:bg-surface-3 text-text-secondary hover:text-text-primary transition-colors"
              title="Edit"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => setDeleteId(row._id)}
              className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Client Brands & Partners"
        description="Add and manage client logos displayed in homepage marquees and social proof"
        actionButton={{
          label: "Add Client",
          onClick: openCreateModal,
          icon: Plus,
        }}
        onRefresh={fetchClients}
        isLoading={isLoading}
      />

      <div className="p-6 sm:p-8 max-w-7xl">
        <DataTable
          columns={columns}
          data={clients}
          searchPlaceholder="Search clients by name..."
          searchKey="name"
          isLoading={isLoading}
          emptyMessage="No clients added yet."
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? "Edit Client" : "Add New Client"}
        description="Provide client brand identity, logo, and marquee presence"
        maxWidth="lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-[var(--color-border)] text-text-secondary hover:bg-surface-2 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              form="client-modal-form"
              size="sm"
              disabled={formLoading}
              className="text-xs font-semibold shadow-sm"
            >
              {formLoading ? "Saving..." : editingClient ? "Update Client" : "Create Client"}
            </Button>
          </div>
        }
      >
        {formError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs rounded-lg">
            {formError}
          </div>
        )}

        <form id="client-modal-form" onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
              Client / Brand Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Fintech Ventures"
              className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)] font-medium"
            />
          </div>

          <ImageUploadInput
            label="Client Logo"
            value={formData.logoUrl}
            onChange={(url) => setFormData({ ...formData, logoUrl: url })}
            helperText="Upload transparent PNG or SVG logo for crisp display"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                Industry
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g. HealthTech, AI Infrastructure"
                className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                URL Slug (Optional)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. finflow-labs (auto-generated if empty)"
                className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                Website URL
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                Location & HQ
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. San Francisco, CA"
                className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                Partnership Year / Timeline
              </label>
              <input
                type="text"
                value={formData.partnershipYear}
                onChange={(e) => setFormData({ ...formData, partnershipYear: e.target.value })}
                placeholder="e.g. 2023 - Present"
                className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                Company Size
              </label>
              <input
                type="text"
                value={formData.companySize}
                onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                placeholder="e.g. 150+ Employees"
                className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
              Tagline / Value Proposition
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. Autonomous financial reconciliation and real-time ledger intelligence."
              className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
              About Client Organization
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Overview of the client company..."
              className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
              The Engineering Partnership & Scope
            </label>
            <textarea
              rows={3}
              value={formData.aboutPartnership}
              onChange={(e) => setFormData({ ...formData, aboutPartnership: e.target.value })}
              placeholder="What MARK engineered, designed, and deployed for this client..."
              className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                Services Delivered (comma-separated)
              </label>
              <input
                type="text"
                value={formData.servicesProvided}
                onChange={(e) => setFormData({ ...formData, servicesProvided: e.target.value })}
                placeholder="Cloud Architecture, Web App, APIs"
                className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="Next.js, TypeScript, PostgreSQL, AWS"
                className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                Key Achievements (one per line)
              </label>
              <textarea
                rows={3}
                value={formData.keyAchievements}
                onChange={(e) => setFormData({ ...formData, keyAchievements: e.target.value })}
                placeholder="Scaled to 2.5M daily ops&#10;Sub-10ms ledger SLA&#10;SOC2 Type II compliance"
                className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                Associated Case Study Slug (Optional)
              </label>
              <input
                type="text"
                value={formData.caseStudySlug}
                onChange={(e) => setFormData({ ...formData, caseStudySlug: e.target.value })}
                placeholder="e.g. finflow-core"
                className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none focus:border-[var(--color-accent)] mb-3"
              />
              <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Testimonial Section */}
          <div className="p-4 rounded-xl bg-surface-2/60 border border-[var(--color-border)] space-y-3">
            <p className="text-xs font-semibold text-[var(--color-accent-dark)] uppercase tracking-wider">
              Executive Testimonial (Optional)
            </p>
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">
                Quote
              </label>
              <textarea
                rows={2}
                value={formData.testimonialQuote}
                onChange={(e) => setFormData({ ...formData, testimonialQuote: e.target.value })}
                placeholder="MARK engineered our core platform with outstanding precision..."
                className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-text-secondary mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={formData.testimonialAuthor}
                  onChange={(e) => setFormData({ ...formData, testimonialAuthor: e.target.value })}
                  placeholder="e.g. David Vance"
                  className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-text-secondary mb-1">
                  Author Title & Role
                </label>
                <input
                  type="text"
                  value={formData.testimonialRole}
                  onChange={(e) => setFormData({ ...formData, testimonialRole: e.target.value })}
                  placeholder="e.g. Chief Technology Officer"
                  className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2 border-t border-[var(--color-border)]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-[var(--color-accent)] accent-[var(--color-accent)]"
              />
              <span className="flex items-center gap-1.5">
                <Star size={12} className="text-purple-500 fill-purple-500" />
                Feature in Logo Marquee
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
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this client brand?"
      />
    </div>
  );
}
