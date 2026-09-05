"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FormTabs, FormTabItem } from "@/components/admin/FormTabs";
import { SlugInput } from "@/components/admin/SlugInput";
import { ArrayInput } from "@/components/admin/ArrayInput";
import { KeyValueListBuilder, KeyValueItem } from "@/components/admin/KeyValueListBuilder";
import { FeatureListBuilder, FeatureItem } from "@/components/admin/FeatureListBuilder";
import { SeoHelperInputs } from "@/components/admin/SeoHelperInputs";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";
import { FormField } from "@/components/admin/FormField";
import { StatusBreakdownBar } from "@/components/admin/StatusBreakdownBar";
import { useToast } from "@/components/admin/Toast";
import {
  Edit2,
  Trash2,
  Plus,
  Star,
  ExternalLink,
  Layers,
  FileText,
  TrendingUp,
  MessageSquare,
  Check,
  Building2,
} from "lucide-react";

const categories = ["Website", "App", "ERP", "Dashboard", "Branding"];
const statuses = ["completed", "ongoing", "maintenance"];

export default function PortfolioAdminPage() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Website",
    clientName: "",
    clientLogo: "",
    coverImage: "",
    industry: "Fintech",
    oneLiner: "",
    problem: "",
    solution: "",
    results: [] as string[],
    techStack: [] as string[],
    keyFeatures: [] as FeatureItem[],
    impactMetrics: [] as KeyValueItem[],
    testimonialQuote: "",
    testimonialAuthor: "",
    testimonialRole: "",
    testimonialCompany: "",
    startDate: "2024-01",
    launchDate: "2024-06",
    durationLabel: "6 Months",
    status: "completed",
    liveUrl: "",
    githubUrl: "",
    isFeatured: false,
    isActive: true,
    order: 0,
    metaTitle: "",
    metaDescription: "",
    keywords: [] as string[],
  });

  const fetchPortfolio = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/portfolio");
      const data = await res.json();
      if (res.ok) setPortfolio(data.portfolio || []);
    } catch (err) {
      console.error("Error fetching portfolio", err);
      toastError("Failed to load portfolio items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setActiveTab("general");
    setFormData({
      title: "",
      slug: "",
      category: "Website",
      clientName: "",
      clientLogo: "",
      coverImage: "",
      industry: "Fintech",
      oneLiner: "",
      problem: "",
      solution: "",
      results: ["10x throughput improvement", "Zero downtime deployment", "100,000+ active users"],
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Docker"],
      keyFeatures: [
        { title: "Real-Time State Synchronization", description: "Distributed WebSocket channels keeping views synced in milliseconds." },
        { title: "Enterprise Role Security", description: "Cryptographically signed logs and granular permission controls." },
      ],
      impactMetrics: [
        { key: "99.99%", value: "Uptime SLA", extra: "Continuous zero-downtime execution" },
        { key: "<25ms", value: "P99 Latency", extra: "Edge compute distribution" },
      ],
      testimonialQuote: "",
      testimonialAuthor: "",
      testimonialRole: "",
      testimonialCompany: "",
      startDate: "2024-01",
      launchDate: "2024-06",
      durationLabel: "6 Months",
      status: "completed",
      liveUrl: "",
      githubUrl: "",
      isFeatured: false,
      isActive: true,
      order: portfolio.length + 1,
      metaTitle: "",
      metaDescription: "",
      keywords: ["case study", "production architecture", "engineering"],
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setActiveTab("general");

    // Parse impact metrics
    const parsedMetrics: KeyValueItem[] = Array.isArray(item.impactMetrics)
      ? item.impactMetrics.map((m: any) => ({
          key: m.metric || "",
          value: m.label || "",
          extra: m.description || "",
        }))
      : [];

    // Parse key features
    const parsedFeatures: FeatureItem[] = Array.isArray(item.keyFeatures)
      ? item.keyFeatures.map((f: any) => ({
          title: f.title || "",
          description: f.description || "",
          icon: f.icon || "Layers",
        }))
      : [];

    setFormData({
      title: item.title || "",
      slug: item.slug || "",
      category: item.category || "Website",
      clientName: item.clientName || "",
      clientLogo: item.clientLogo || "",
      coverImage: item.coverImage || item.heroImage || "",
      industry: item.industry || "Technology",
      oneLiner: item.oneLiner || "",
      problem: item.problem || "",
      solution: item.solution || "",
      results: Array.isArray(item.results) ? item.results : [],
      techStack: Array.isArray(item.techStack) ? item.techStack : [],
      keyFeatures: parsedFeatures,
      impactMetrics: parsedMetrics,
      testimonialQuote: item.testimonial?.quote || "",
      testimonialAuthor: item.testimonial?.authorName || "",
      testimonialRole: item.testimonial?.authorRole || "",
      testimonialCompany: item.testimonial?.company || "",
      startDate: item.startDate || "2024-01",
      launchDate: item.launchDate || "2024-06",
      durationLabel: item.durationLabel || "6 Months",
      status: item.status || "completed",
      liveUrl: item.liveUrl || "",
      githubUrl: item.githubUrl || "",
      isFeatured: item.isFeatured ?? false,
      isActive: item.isActive ?? true,
      order: item.order || 0,
      metaTitle: item.metaTitle || "",
      metaDescription: item.metaDescription || "",
      keywords: Array.isArray(item.keywords) ? item.keywords : [],
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

  const handleToggleActive = async (item: any) => {
    const newStatus = !item.isActive;
    try {
      const res = await fetch(`/api/admin/portfolio/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (res.ok) {
        setPortfolio((prev) =>
          prev.map((p) => (p._id === item._id ? { ...p, isActive: newStatus } : p))
        );
        success(`Project marked as ${newStatus ? "Active" : "Disabled"}`);
      } else {
        toastError("Failed to update status");
      }
    } catch (err) {
      toastError("Error updating project status");
    }
  };

  const handleToggleFeatured = async (item: any) => {
    const newFeatured = !item.isFeatured;
    try {
      const res = await fetch(`/api/admin/portfolio/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: newFeatured }),
      });
      if (res.ok) {
        setPortfolio((prev) =>
          prev.map((p) => (p._id === item._id ? { ...p, isFeatured: newFeatured } : p))
        );
        success(`Project ${newFeatured ? "featured on homepage" : "unfeatured"}`);
      } else {
        toastError("Failed to update featured status");
      }
    } catch (err) {
      toastError("Error updating featured status");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    const payload = {
      ...formData,
      impactMetrics: formData.impactMetrics
        .filter((m) => m.key.trim() !== "" && m.value.trim() !== "")
        .map((m) => ({ metric: m.key, label: m.value, description: m.extra || "" })),
      keyFeatures: formData.keyFeatures.filter((f) => f.title.trim() !== ""),
      testimonial: formData.testimonialQuote
        ? {
            quote: formData.testimonialQuote,
            authorName: formData.testimonialAuthor || "Client Executive",
            authorRole: formData.testimonialRole || "Director",
            company: formData.testimonialCompany || formData.clientName,
          }
        : undefined,
    };

    try {
      const url = editingItem
        ? `/api/admin/portfolio/${editingItem._id}`
        : `/api/admin/portfolio`;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save portfolio project");
      }

      setIsModalOpen(false);
      fetchPortfolio();
      success(editingItem ? "Case study updated successfully!" : "Case study created successfully!");
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred");
      toastError(err.message || "An unexpected error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/portfolio/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        fetchPortfolio();
        success("Project deleted successfully");
      } else {
        toastError("Failed to delete project");
      }
    } catch (err) {
      toastError("Failed to delete project");
    }
  };

  const tabs: FormTabItem[] = [
    { id: "general", label: "General", icon: Layers },
    { id: "overview", label: "Overview & Media", icon: FileText },
    { id: "metrics", label: "Impact & Tech Stack", icon: TrendingUp, badge: formData.impactMetrics.length },
    { id: "endorsement", label: "Client Quote & SEO", icon: MessageSquare },
  ];

  const filteredPortfolio = portfolio.filter((item) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "featured") return Boolean(item.isFeatured);
    if (statusFilter === "active") return Boolean(item.isActive);
    if (statusFilter === "completed") return item.status === "completed";
    if (statusFilter === "ongoing") return item.status === "ongoing";
    if (statusFilter === "hidden") return !item.isActive;
    return true;
  });

  const columns: Column<any>[] = [
    {
      header: "Project",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.coverImage ? (
            <img src={row.coverImage} alt={row.title} className="w-10 h-10 rounded-lg object-cover border border-[var(--color-border)]" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] flex items-center justify-center font-bold text-xs">
              {row.title.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-semibold text-text-primary text-xs flex items-center gap-1.5">
              <span>{row.title}</span>
              {row.isFeatured && (
                <Star size={11} className="fill-[var(--color-accent)] text-[var(--color-accent)]" />
              )}
            </div>
            <div className="text-[11px] text-text-muted font-mono">
              {row.clientName} • /{row.slug}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      cell: (row) => (
        <span className="px-2 py-0.5 rounded-full bg-surface-2 border border-[var(--color-border)] text-text-secondary text-[10px] font-mono">
          {row.category}
        </span>
      ),
    },
    {
      header: "Featured",
      cell: (row) => (
        <button
          type="button"
          onClick={() => handleToggleFeatured(row)}
          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold cursor-pointer transition-all flex items-center gap-1 ${
            row.isFeatured
              ? "bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] border border-[var(--color-accent)]/30"
              : "bg-surface-2 text-text-muted hover:text-text-primary"
          }`}
          title="Toggle homepage featured status"
        >
          <Star size={10} className={row.isFeatured ? "fill-current" : ""} />
          <span>{row.isFeatured ? "Featured" : "Standard"}</span>
        </button>
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
            href={`/portfolio/${row.slug}`}
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
            title="Edit Project"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-600 transition-colors cursor-pointer"
            title="Delete Project"
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
        title="Portfolio & Case Studies"
        description="Add, edit, and curate client engineering case studies, verified telemetry, and architectural impact"
        actionButton={{
          label: "Add Case Study",
          onClick: openCreateModal,
          icon: Plus,
        }}
        onRefresh={fetchPortfolio}
        isLoading={isLoading}
      />

      <div className="p-6 sm:p-8 max-w-7xl space-y-4">
        <StatusBreakdownBar
          items={[
            { id: "all", label: "All Projects", count: portfolio.length },
            { id: "featured", label: "Featured", count: portfolio.filter((p) => p.isFeatured).length, color: "amber" },
            { id: "completed", label: "Completed", count: portfolio.filter((p) => p.status === "completed").length, color: "emerald" },
            { id: "ongoing", label: "Ongoing", count: portfolio.filter((p) => p.status === "ongoing").length, color: "blue" },
            { id: "hidden", label: "Hidden", count: portfolio.filter((p) => !p.isActive).length, color: "zinc" },
          ]}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        <DataTable
          columns={columns}
          data={filteredPortfolio}
          searchPlaceholder="Search case studies by title, client, or category..."
          searchKey="title"
          isLoading={isLoading}
          emptyMessage="No portfolio projects found for this filter. Click 'Add Case Study' to showcase your production engineering."
        />
      </div>

      {/* Modal with Pinned Footer and Tabs */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit Case Study: ${editingItem.title}` : "Create Portfolio Case Study"}
        description="Configure client details, problem & solution architecture, impact telemetry, and tech stack."
        maxWidth="4xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <div>
              {editingItem && formData.slug && (
                <a
                  href={`/portfolio/${formData.slug}`}
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
                    <span>{editingItem ? "Update Case Study" : "Publish Case Study"}</span>
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
                  label="Project Title"
                  required
                  tooltip="Main headline displayed in the case study hero, header, and showcase grids."
                  charCount={{ current: formData.title.length, optimal: { min: 20, max: 60 }, max: 100 }}
                >
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Apex Wealth — Multi-Asset Trading Engine"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <div>
                  <SlugInput
                    value={formData.slug}
                    onChange={(slug) => setFormData({ ...formData, slug })}
                    titleValue={formData.title}
                    pathPrefix="/portfolio/"
                    isExisting={Boolean(editingItem)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  label="Category"
                  required
                  tooltip="Groups the project into filter tabs on the public /portfolio showcase page."
                >
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat} Project
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Client / Organization"
                  required
                  tooltip="Rendered in the project metadata sidebar, telemetry header, and client testimonials."
                >
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. Apex Financial Technologies"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <FormField
                  label="Domain / Sector"
                  tooltip="Industry vertical badge displayed on the case study overview (e.g. Fintech, Healthcare)."
                >
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g. Fintech / Asset Management"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  label="Project Status"
                  tooltip="Indicates lifecycle state: Completed (production), Ongoing (in development), or Maintenance."
                >
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Sprint Timeline / Duration"
                  tooltip="Rendered next to delivery milestones (e.g. '6 Months', '12 Sprints')."
                >
                  <input
                    type="text"
                    value={formData.durationLabel}
                    onChange={(e) => setFormData({ ...formData, durationLabel: e.target.value })}
                    placeholder="e.g. 6 Months"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <FormField
                  label="Sort Order"
                  tooltip="Ascending display order on the /portfolio catalog (1 appears first)."
                >
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Production Live URL"
                  tooltip="External link button in the case study hero allowing prospective clients to visit the live system."
                >
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://client-production-system.com"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-[var(--color-accent)] accent-[var(--color-accent)]"
                    />
                    <span>Featured on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-[var(--color-accent)] accent-[var(--color-accent)]"
                    />
                    <span>Active & Public</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW & MEDIA */}
          {activeTab === "overview" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploadInput
                  label="Cover / Showcase Graphic"
                  value={formData.coverImage}
                  onChange={(coverImage) => setFormData({ ...formData, coverImage })}
                  helperText="Primary high-resolution mockup or interface screenshot."
                  recommendedDimension="1920x1080px (16:9)"
                />

                <ImageUploadInput
                  label="Client Brand Logo"
                  value={formData.clientLogo}
                  onChange={(clientLogo) => setFormData({ ...formData, clientLogo })}
                  helperText="Client mark displayed in the header and accreditation bar."
                  recommendedDimension="400x160px (SVG or Transparent PNG)"
                />
              </div>

              <FormField
                label="One-Liner Headline"
                required
                tooltip="Appears on portfolio listing cards and immediately below the case study title."
                charCount={{ current: formData.oneLiner.length, optimal: { min: 60, max: 140 }, max: 180 }}
              >
                <input
                  type="text"
                  required
                  value={formData.oneLiner}
                  onChange={(e) => setFormData({ ...formData, oneLiner: e.target.value })}
                  placeholder="e.g. Distributed high-frequency order book processing $50M+ daily volume."
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="The Technical Challenge & Bottlenecks"
                  required
                  tooltip="Details legacy latency, architectural constraints, scale blockers, or security requirements."
                  charCount={{ current: formData.problem.length, optimal: { min: 120, max: 400 } }}
                >
                  <textarea
                    rows={4}
                    required
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    placeholder="Describe legacy latency bottlenecks, scaling issues, or architectural complexity."
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <FormField
                  label="The Kas Denge Solution"
                  required
                  tooltip="Describes the architecture, microservices, databases, and UX delivered by Kas Denge."
                  charCount={{ current: formData.solution.length, optimal: { min: 120, max: 500 } }}
                >
                  <textarea
                    rows={4}
                    required
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="Describe microservices, caching layers, WebSockets, or UI engine built."
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* TAB 3: METRICS & IMPACT */}
          {activeTab === "metrics" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <KeyValueListBuilder
                label="Measurable Impact Metrics (Counter Cards)"
                items={formData.impactMetrics}
                onChange={(impactMetrics) => setFormData({ ...formData, impactMetrics })}
                keyLabel="Metric"
                keyPlaceholder="e.g. +340% or <15ms"
                valueLabel="Label"
                valuePlaceholder="e.g. Throughput Velocity"
                hasExtra={true}
                extraLabel="Description"
                extraPlaceholder="e.g. Edge compute cache hit rate"
                helperText="Rendered in the verified outcomes counters on the case study page."
              />

              <FeatureListBuilder
                label="Key Architecture Capabilities Delivered"
                items={formData.keyFeatures}
                onChange={(keyFeatures) => setFormData({ ...formData, keyFeatures })}
                showIcon={true}
                helperText="Specific high-impact features built for this engagement."
              />

              <ArrayInput
                label="Technologies & Frameworks Deployed"
                items={formData.techStack}
                onChange={(techStack) => setFormData({ ...formData, techStack })}
                placeholder="e.g. Next.js 15, Go, PostgreSQL, Redis..."
                helperText="Rendered in the technology stack grid."
              />

              <ArrayInput
                label="Key Production Milestones & Deliverables"
                items={formData.results}
                onChange={(results) => setFormData({ ...formData, results })}
                placeholder="e.g. SOC2 Type II Certified..."
                helperText="Verified milestones and outcomes achieved."
              />
            </div>
          )}

          {/* TAB 4: ENDORSEMENT & SEO */}
          {activeTab === "endorsement" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-surface-2/60 border border-[var(--color-border)] space-y-3">
                <FormField
                  label="Client Endorsement Quote (Optional)"
                  tooltip="Direct praise or ROI verification quote displayed in a featured callout block on /portfolio/[slug]."
                  charCount={{ current: formData.testimonialQuote.length, optimal: { min: 80, max: 240 } }}
                >
                  <textarea
                    rows={2}
                    value={formData.testimonialQuote}
                    onChange={(e) => setFormData({ ...formData, testimonialQuote: e.target.value })}
                    placeholder="&ldquo;Kas Denge delivered our core architecture 2 months ahead of schedule with zero production regressions.&rdquo;"
                    className="w-full px-3 py-2 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary italic focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-text-primary mb-1">Author Name</label>
                    <input
                      type="text"
                      value={formData.testimonialAuthor}
                      onChange={(e) => setFormData({ ...formData, testimonialAuthor: e.target.value })}
                      placeholder="e.g. David Sterling"
                      className="w-full px-2.5 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-text-primary mb-1">Author Title / Role</label>
                    <input
                      type="text"
                      value={formData.testimonialRole}
                      onChange={(e) => setFormData({ ...formData, testimonialRole: e.target.value })}
                      placeholder="e.g. Chief Technology Officer"
                      className="w-full px-2.5 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-text-primary mb-1">Company</label>
                    <input
                      type="text"
                      value={formData.testimonialCompany}
                      onChange={(e) => setFormData({ ...formData, testimonialCompany: e.target.value })}
                      placeholder="e.g. Apex Wealth"
                      className="w-full px-2.5 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary"
                    />
                  </div>
                </div>
              </div>

              <SeoHelperInputs
                metaTitle={formData.metaTitle}
                onChangeMetaTitle={(metaTitle) => setFormData({ ...formData, metaTitle })}
                metaDescription={formData.metaDescription}
                onChangeMetaDescription={(metaDescription) => setFormData({ ...formData, metaDescription })}
                keywords={formData.keywords}
                onChangeKeywords={(keywords) => setFormData({ ...formData, keywords })}
                canonicalPath={`/portfolio/${formData.slug}`}
                fallbackTitle={formData.title}
                fallbackDescription={formData.oneLiner}
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
        title="Delete Portfolio Project"
        description="Are you sure you want to delete this case study? All associated metrics, telemetry, and quotes will be removed."
        confirmText="Delete Project"
      />
    </div>
  );
}
