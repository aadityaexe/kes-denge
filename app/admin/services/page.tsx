"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FormTabs, FormTabItem } from "@/components/admin/FormTabs";
import { VisualIconPicker } from "@/components/admin/VisualIconPicker";
import { SlugInput } from "@/components/admin/SlugInput";
import { ArrayInput } from "@/components/admin/ArrayInput";
import { FeatureListBuilder, FeatureItem } from "@/components/admin/FeatureListBuilder";
import { KeyValueListBuilder, KeyValueItem } from "@/components/admin/KeyValueListBuilder";
import { SeoHelperInputs } from "@/components/admin/SeoHelperInputs";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";
import { FormField } from "@/components/admin/FormField";
import { StatusBreakdownBar } from "@/components/admin/StatusBreakdownBar";
import { useToast } from "@/components/admin/Toast";
import {
  Edit2,
  Trash2,
  Plus,
  ExternalLink,
  Layers,
  FileText,
  CheckCircle2,
  Search,
  Check,
} from "lucide-react";

export default function ServicesAdminPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { success, error: toastError } = useToast();

  const totalCount = services.length;
  const activeCount = services.filter((s) => s.isActive).length;
  const hiddenCount = totalCount - activeCount;

  const filteredServices = services.filter((s) => {
    if (statusFilter === "active") return s.isActive;
    if (statusFilter === "hidden") return !s.isActive;
    return true;
  });

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    tagline: "",
    heroBadge: "ENGINEERING & DEVELOPMENT",
    icon: "Globe",
    shortDescription: "",
    fullDescription: "",
    featuredImage: "",
    targetAudience: [] as string[],
    features: [] as FeatureItem[],
    deliverables: [] as string[],
    faqs: [] as KeyValueItem[],
    metaTitle: "",
    metaDescription: "",
    keywords: [] as string[],
    order: 0,
    isActive: true,
  });

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (res.ok) setServices(data.services || []);
    } catch (err) {
      console.error("Error fetching services", err);
      toastError("Failed to load services list");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setActiveTab("general");
    setFormData({
      title: "",
      slug: "",
      tagline: "",
      heroBadge: "ENGINEERING & DEVELOPMENT",
      icon: "Globe",
      shortDescription: "",
      fullDescription: "",
      featuredImage: "",
      targetAudience: [
        "High-growth startups launching MVPs",
        "Mid-market enterprises modernizing legacy software",
      ],
      features: [
        { title: "End-to-End Architecture", description: "Edge-rendered, highly scalable system architecture." },
        { title: "Production Deployment", description: "Automated containerized pipelines with zero downtime." },
        { title: "24/7 SLA Support", description: "Continuous monitoring and rapid incident resolution." },
      ],
      deliverables: [
        "Fully typed TypeScript codebase",
        "Automated CI/CD deployment pipelines",
        "Interactive API documentation",
      ],
      faqs: [
        { key: "What is the typical sprint timeline?", value: "Most core engagements deliver initial production milestones within 4-6 weeks." },
        { key: "Do we retain complete IP ownership?", value: "Yes, you own 100% of all intellectual property, source code, and design files upon milestone completion." },
      ],
      metaTitle: "",
      metaDescription: "",
      keywords: ["custom software", "enterprise engineering", "cloud architecture"],
      order: services.length + 1,
      isActive: true,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (service: any) => {
    setEditingService(service);
    setActiveTab("general");

    // Parse features nicely
    let parsedFeatures: FeatureItem[] = [];
    if (Array.isArray(service.features)) {
      parsedFeatures = service.features.map((f: any) => {
        if (typeof f === "object" && f !== null) {
          return {
            title: f.title || "",
            description: f.description || "",
            icon: f.icon || "Layers",
          };
        }
        // If legacy string
        if (typeof f === "string") {
          const [t, ...d] = f.split(":");
          return { title: t.trim(), description: d.join(":").trim() || t.trim() };
        }
        return { title: "", description: "" };
      });
    }

    // Parse FAQs
    let parsedFaqs: KeyValueItem[] = [];
    if (Array.isArray(service.faqs)) {
      parsedFaqs = service.faqs.map((faq: any) => ({
        key: faq.question || "",
        value: faq.answer || "",
      }));
    }

    setFormData({
      title: service.title || "",
      slug: service.slug || "",
      tagline: service.tagline || "",
      heroBadge: service.heroBadge || "ENGINEERING & DEVELOPMENT",
      icon: service.icon || "Globe",
      shortDescription: service.shortDescription || "",
      fullDescription: service.fullDescription || "",
      featuredImage: service.featuredImage || "",
      targetAudience: Array.isArray(service.targetAudience) ? service.targetAudience : [],
      features: parsedFeatures,
      deliverables: Array.isArray(service.deliverables) ? service.deliverables : [],
      faqs: parsedFaqs,
      metaTitle: service.metaTitle || "",
      metaDescription: service.metaDescription || "",
      keywords: Array.isArray(service.keywords) ? service.keywords : [],
      order: service.order ?? 0,
      isActive: service.isActive ?? true,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  };

  const handleToggleActive = async (service: any) => {
    const newStatus = !service.isActive;
    try {
      const res = await fetch(`/api/admin/services/${service._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s._id === service._id ? { ...s, isActive: newStatus } : s))
        );
        success(`Service marked as ${newStatus ? "Active" : "Disabled"}`);
      } else {
        toastError("Failed to update status");
      }
    } catch (err) {
      toastError("Error updating service status");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    const payload = {
      ...formData,
      features: formData.features.filter((f) => f.title.trim() !== ""),
      faqs: formData.faqs
        .filter((f) => f.key.trim() !== "" && f.value.trim() !== "")
        .map((f) => ({ question: f.key, answer: f.value })),
    };

    try {
      const url = editingService
        ? `/api/admin/services/${editingService._id}`
        : "/api/admin/services";
      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        fetchServices();
        success(editingService ? "Service updated successfully!" : "Service created successfully!");
      } else {
        setFormError(data.error || "Failed to save service");
        toastError(data.error || "Failed to save service");
      }
    } catch (err: any) {
      setFormError("An unexpected error occurred");
      toastError("An unexpected error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/services/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        fetchServices();
        success("Service deleted successfully");
      } else {
        toastError("Failed to delete service");
      }
    } catch (err) {
      toastError("Error deleting service");
    }
  };

  const tabs: FormTabItem[] = [
    { id: "general", label: "General", icon: Layers },
    { id: "content", label: "Content & Media", icon: FileText },
    { id: "features", label: "Features & Scope", icon: CheckCircle2, badge: formData.features.length },
    { id: "seo", label: "SEO & Settings", icon: Search },
  ];

  const columns: Column<any>[] = [
    {
      header: "Order",
      accessorKey: "order",
      className: "w-16 font-mono text-center",
    },
    {
      header: "Service",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] flex items-center justify-center font-bold text-xs">
            {row.icon ? row.icon.slice(0, 2) : "S"}
          </div>
          <div>
            <div className="font-semibold text-text-primary text-xs">{row.title}</div>
            <div className="text-[11px] text-text-muted font-mono">/{row.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Description",
      cell: (row) => (
        <p className="line-clamp-2 text-xs text-text-secondary max-w-md font-light">
          {row.shortDescription}
        </p>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <button
          type="button"
          onClick={() => handleToggleActive(row)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
            row.isActive
              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
              : "bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20"
          }`}
          title="Click to toggle status"
        >
          {row.isActive ? "● Active" : "○ Disabled"}
        </button>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={`/services/${row.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-surface-3 text-text-muted hover:text-text-primary transition-colors"
            title="View on Live Site"
          >
            <ExternalLink size={14} />
          </a>
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 rounded-md hover:bg-surface-3 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title="Edit Service"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-600 transition-colors cursor-pointer"
            title="Delete Service"
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
        title="Service Management"
        description="Add, edit, reorder, and configure high-performance engineering service offerings"
        actionButton={{
          label: "Add Service",
          onClick: openCreateModal,
          icon: Plus,
        }}
        onRefresh={fetchServices}
        isLoading={isLoading}
      />

      <div className="p-6 sm:p-8 max-w-7xl">
        <DataTable
          columns={columns}
          data={filteredServices}
          searchPlaceholder="Search services by name or description..."
          searchKey="title"
          filterComponent={
            <StatusBreakdownBar
              items={[
                { id: "all", label: "All Services", count: totalCount },
                { id: "active", label: "Active", count: activeCount },
                { id: "hidden", label: "Hidden", count: hiddenCount },
              ]}
              activeFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />
          }
          isLoading={isLoading}
          emptyMessage="No services found matching this filter."
        />
      </div>

      {/* Create / Edit Modal with Pinned Footer and Tabs */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? `Edit Service: ${editingService.title}` : "Add New Engineering Service"}
        description="Configure service architecture, capabilities, deliverables, and public visibility."
        maxWidth="4xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <div>
              {editingService && formData.slug && (
                <a
                  href={`/services/${formData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--color-accent-dark)] hover:underline font-medium"
                >
                  <ExternalLink size={13} />
                  <span>View on Live Site</span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-surface-2 hover:bg-surface-3 text-text-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={formLoading}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-text-primary text-surface-1 hover:bg-text-secondary transition-all disabled:opacity-50 cursor-pointer shadow-md flex items-center gap-1.5"
              >
                {formLoading ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Check size={14} />
                    <span>{editingService ? "Update Service" : "Publish Service"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        }
      >
        {formError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs rounded-lg">
            {formError}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <FormTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Service Title"
                  required
                  tooltip="Primary name of this engineering service. Displayed on the homepage services section and in header cards."
                  charCount={{ current: formData.title.length, max: 80, optimal: { min: 10, max: 50 } }}
                  helperText="Keep titles punchy, professional, and descriptive."
                >
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Custom Software Development"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <FormField
                  label="URL Slug"
                  required
                  tooltip="Unique URL identifier for the service page: /services/[slug]. Auto-generated from title."
                >
                  <SlugInput
                    value={formData.slug}
                    onChange={(slug) => setFormData({ ...formData, slug })}
                    titleValue={formData.title}
                    pathPrefix="/services/"
                    isExisting={Boolean(editingService)}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div>
                  <VisualIconPicker
                    label="Visual Icon"
                    value={formData.icon}
                    onChange={(icon) => setFormData({ ...formData, icon })}
                  />
                </div>

                <FormField
                  label="Sort Order"
                  tooltip="Display sequence order on the homepage and index page. Lower numbers appear first."
                  helperText="Default sequence priority"
                >
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <div className="pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-[var(--color-accent)] accent-[var(--color-accent)]"
                    />
                    <span>Active & Publicly Visible</span>
                  </label>
                  <p className="text-[10px] text-text-muted mt-1 font-light">
                    When unchecked, this service is hidden from prospective clients.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Value Proposition Tagline"
                  tooltip="A high-impact summary line displayed beneath the title."
                  charCount={{ current: formData.tagline.length, max: 100, optimal: { min: 15, max: 70 } }}
                  helperText="One memorable line that communicates client ROI."
                >
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Scalable, Edge-Rendered Web Architectures"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <FormField
                  label="Hero Badge Label"
                  tooltip="Small uppercase pill badge displayed above the title on the service landing page."
                  helperText="e.g. FULL-STACK ENGINEERING, ENTERPRISE CLOUD"
                >
                  <input
                    type="text"
                    value={formData.heroBadge}
                    onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                    placeholder="e.g. FULL-STACK ENGINEERING"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary uppercase font-mono focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT & MEDIA */}
          {activeTab === "content" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <FormField
                label="Short Description (Card View)"
                required
                tooltip="Concise summary rendered in service cards across the homepage and services directory."
                charCount={{ current: formData.shortDescription.length, max: 280, optimal: { min: 60, max: 180 } }}
                helperText="Keep within 180 characters for optimal card height alignment."
              >
                <textarea
                  required
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="1-2 sentences summarizing this service for cards on the homepage and index page."
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </FormField>

              <FormField
                label="Full Narrative Description"
                required
                tooltip="In-depth explanation of technical methodology, tech stack, and engineering process."
                charCount={{ current: formData.fullDescription.length }}
                helperText="Detailed paragraphs explaining technical approach, architecture, and standards."
              >
                <textarea
                  required
                  rows={5}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="In-depth explanation of technologies, architectures, delivery velocity, and standards."
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)] leading-relaxed"
                />
              </FormField>

              <FormField
                label="Featured Graphic / Architectural Banner"
                recommendedDimension="1200 × 800px"
                tooltip="Cover graphic or architecture schematic shown in the hero section of the dedicated service page."
              >
                <ImageUploadInput
                  label=""
                  value={formData.featuredImage}
                  onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                  helperText="Upload 1200x800 WebP/PNG diagram or mockup."
                />
              </FormField>
            </div>
          )}

          {/* TAB 3: FEATURES & SCOPE */}
          {activeTab === "features" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <ArrayInput
                label="Target Audience / Who This Service Is For"
                items={formData.targetAudience}
                onChange={(items) => setFormData({ ...formData, targetAudience: items })}
                placeholder="Add profile (e.g. Series A Startups launching MVP) and press Enter..."
                helperText="Displays in the 'Who This Is For' highlight box on the public service page."
              />

              <FeatureListBuilder
                label="Included Capabilities & Architecture Features"
                items={formData.features}
                onChange={(features) => setFormData({ ...formData, features })}
                helperText="Core features with detailed architectural descriptions rendered in the bento grid."
              />

              <ArrayInput
                label="Production Deliverables & Hand-Off Assets"
                items={formData.deliverables}
                onChange={(items) => setFormData({ ...formData, deliverables: items })}
                placeholder="Add deliverable (e.g. Production Docker Images) and press Enter..."
                helperText="Listed in the deliverables banner as tangible engagement outcomes."
              />

              <KeyValueListBuilder
                label="Frequently Asked Questions"
                items={formData.faqs}
                onChange={(faqs) => setFormData({ ...formData, faqs })}
                keyLabel="Question"
                keyPlaceholder="e.g. What is your deployment SLA?"
                valueLabel="Answer"
                valuePlaceholder="e.g. We provide 99.99% uptime with 1-hour critical response..."
                helperText="Appears in the interactive FAQ accordion on the service page."
              />
            </div>
          )}

          {/* TAB 4: SEO & METADATA */}
          {activeTab === "seo" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <SeoHelperInputs
                metaTitle={formData.metaTitle}
                onChangeMetaTitle={(metaTitle) => setFormData({ ...formData, metaTitle })}
                metaDescription={formData.metaDescription}
                onChangeMetaDescription={(metaDescription) => setFormData({ ...formData, metaDescription })}
                keywords={formData.keywords}
                onChangeKeywords={(keywords) => setFormData({ ...formData, keywords })}
                canonicalPath={`/services/${formData.slug}`}
                fallbackTitle={formData.title}
                fallbackDescription={formData.shortDescription}
              />
            </div>
          )}
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Service Offering"
        description="Are you sure you want to permanently remove this service? Any case studies or navigation links referencing this slug may lose association."
        confirmText="Delete Service"
      />
    </div>
  );
}
