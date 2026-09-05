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
  Package,
  ExternalLink,
  Layers,
  FileText,
  Blocks,
  Globe,
  Check,
} from "lucide-react";

const categories = ["ERP", "CRM", "HRMS", "POS", "School", "Hospital", "Inventory", "Custom"];

interface ProductModuleState {
  name: string;
  description: string;
  icon: string;
  capabilities: string[];
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { success, error: toastError } = useToast();

  const totalCount = products.length;
  const activeCount = products.filter((p) => p.isActive).length;
  const hiddenCount = totalCount - activeCount;

  const filteredProducts = products.filter((p) => {
    if (statusFilter === "active") return p.isActive;
    if (statusFilter === "hidden") return !p.isActive;
    return true;
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "ERP",
    heroBadge: "ENTERPRISE PLATFORM",
    tagline: "",
    description: "",
    fullDescription: "",
    demoUrl: "",
    coverImage: "",
    modules: [] as ProductModuleState[],
    specifications: [] as KeyValueItem[],
    integrations: [] as string[],
    targetIndustries: [] as string[],
    deploymentOptions: [] as string[],
    securityCompliance: [] as string[],
    faqs: [] as KeyValueItem[],
    metaTitle: "",
    metaDescription: "",
    keywords: [] as string[],
    order: 0,
    isActive: true,
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (res.ok) setProducts(data.products || []);
    } catch (err) {
      console.error("Error fetching products", err);
      toastError("Failed to load products list");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setActiveTab("general");
    setFormData({
      name: "",
      slug: "",
      category: "ERP",
      heroBadge: "ENTERPRISE PLATFORM",
      tagline: "",
      description: "",
      fullDescription: "",
      demoUrl: "",
      coverImage: "",
      modules: [
        {
          name: "Core Workflow Automation",
          description: "End-to-end task execution and approval routing.",
          icon: "Blocks",
          capabilities: ["Role-based routing", "Audit logging"],
        },
      ],
      specifications: [
        { key: "Supported Runtimes", value: "Node.js, Docker, Kubernetes" },
        { key: "Database Compatibility", value: "PostgreSQL, MongoDB, Redis" },
      ],
      integrations: ["Slack", "Stripe", "Zapier", "GitHub"],
      targetIndustries: ["Fintech", "Logistics", "Healthcare", "E-Commerce"],
      deploymentOptions: ["Private Cloud VPC", "On-Premise Docker", "Managed SaaS"],
      securityCompliance: ["SOC2 Type II", "GDPR", "HIPAA Ready"],
      faqs: [
        { key: "Can we self-host this platform?", value: "Yes, we support private deployment inside your AWS, GCP, or on-premise Kubernetes cluster." },
      ],
      metaTitle: "",
      metaDescription: "",
      keywords: ["enterprise software", "custom erp", "automation platform"],
      order: products.length + 1,
      isActive: true,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setActiveTab("general");

    // Parse modules
    const parsedModules: ProductModuleState[] = Array.isArray(product.modules)
      ? product.modules.map((m: any) => ({
          name: m.name || "",
          description: m.description || "",
          icon: m.icon || "Blocks",
          capabilities: Array.isArray(m.capabilities) ? m.capabilities : [],
        }))
      : [];

    // Parse specifications
    const parsedSpecs: KeyValueItem[] = Array.isArray(product.specifications)
      ? product.specifications.map((s: any) => ({
          key: s.label || "",
          value: s.value || "",
        }))
      : [];

    // Parse FAQs
    const parsedFaqs: KeyValueItem[] = Array.isArray(product.faqs)
      ? product.faqs.map((f: any) => ({
          key: f.question || "",
          value: f.answer || "",
        }))
      : [];

    setFormData({
      name: product.name || "",
      slug: product.slug || "",
      category: product.category || "ERP",
      heroBadge: product.heroBadge || "ENTERPRISE PLATFORM",
      tagline: product.tagline || "",
      description: product.description || "",
      fullDescription: product.fullDescription || "",
      demoUrl: product.demoUrl || "",
      coverImage: product.images && product.images.length > 0 ? product.images[0] : "",
      modules: parsedModules,
      specifications: parsedSpecs,
      integrations: Array.isArray(product.integrations) ? product.integrations : [],
      targetIndustries: Array.isArray(product.targetIndustries) ? product.targetIndustries : [],
      deploymentOptions: Array.isArray(product.deploymentOptions) ? product.deploymentOptions : [],
      securityCompliance: Array.isArray(product.securityCompliance) ? product.securityCompliance : [],
      faqs: parsedFaqs,
      metaTitle: product.metaTitle || "",
      metaDescription: product.metaDescription || "",
      keywords: Array.isArray(product.keywords) ? product.keywords : [],
      order: product.order || 0,
      isActive: product.isActive ?? true,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  };

  const handleToggleActive = async (product: any) => {
    const newStatus = !product.isActive;
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, isActive: newStatus } : p))
        );
        success(`Product marked as ${newStatus ? "Active" : "Disabled"}`);
      } else {
        toastError("Failed to update status");
      }
    } catch (err) {
      toastError("Error updating product status");
    }
  };

  const handleModuleChange = (index: number, field: keyof ProductModuleState, val: any) => {
    const updated = [...formData.modules];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, modules: updated });
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [
        ...formData.modules,
        { name: "", description: "", icon: "Blocks", capabilities: [] },
      ],
    });
  };

  const removeModule = (index: number) => {
    setFormData({
      ...formData,
      modules: formData.modules.filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    const payload = {
      ...formData,
      images: formData.coverImage ? [formData.coverImage] : [],
      modules: formData.modules.filter((m) => m.name.trim() !== ""),
      specifications: formData.specifications
        .filter((s) => s.key.trim() !== "")
        .map((s) => ({ label: s.key, value: s.value })),
      faqs: formData.faqs
        .filter((f) => f.key.trim() !== "")
        .map((f) => ({ question: f.key, answer: f.value })),
    };

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct._id}`
        : `/api/admin/products`;
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      setIsModalOpen(false);
      fetchProducts();
      success(editingProduct ? "Product updated successfully!" : "Product created successfully!");
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
      const res = await fetch(`/api/admin/products/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        fetchProducts();
        success("Product deleted successfully");
      } else {
        toastError("Failed to delete product");
      }
    } catch (err) {
      toastError("Failed to delete product");
    }
  };

  const tabs: FormTabItem[] = [
    { id: "general", label: "General", icon: Layers },
    { id: "content", label: "Descriptions & Media", icon: FileText },
    { id: "modules", label: "Modules & Specs", icon: Blocks, badge: formData.modules.length },
    { id: "ecosystem", label: "Ecosystem & SEO", icon: Globe },
  ];

  const columns: Column<any>[] = [
    {
      header: "Order",
      accessorKey: "order",
      className: "w-16 font-mono text-center",
    },
    {
      header: "Product",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] flex items-center justify-center font-bold text-xs">
            {row.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-text-primary text-xs">{row.name}</div>
            <div className="text-[11px] text-text-muted font-mono">/{row.slug}</div>
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
      header: "Tagline",
      cell: (row) => (
        <p className="line-clamp-1 text-xs text-text-secondary max-w-xs font-light">
          {row.tagline}
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
            href={`/products/${row.slug}`}
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
            title="Edit Product"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-600 transition-colors cursor-pointer"
            title="Delete Product"
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
        title="Software Platform Catalog"
        description="Add, configure, and curate turnkey software products, ERP engines, and micro-platforms"
        actionButton={{
          label: "Add Product",
          onClick: openCreateModal,
          icon: Plus,
        }}
        onRefresh={fetchProducts}
        isLoading={isLoading}
      />

      <div className="p-6 sm:p-8 max-w-7xl">
        <StatusBreakdownBar
          items={[
            { id: "all", label: "All Platforms", count: totalCount },
            { id: "active", label: "Active", count: activeCount },
            { id: "hidden", label: "Hidden", count: hiddenCount },
          ]}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        <DataTable
          columns={columns}
          data={filteredProducts}
          searchPlaceholder="Search products by title, category, or features..."
          searchKey="name"
          isLoading={isLoading}
          emptyMessage="No products found matching this filter."
        />
      </div>

      {/* Modal with Pinned Footer and Tabs */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Edit Product: ${editingProduct.name}` : "Create Software Platform"}
        description="Configure platform modules, technical specifications, and enterprise integration options."
        maxWidth="4xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <div>
              {editingProduct && formData.slug && (
                <a
                  href={`/products/${formData.slug}`}
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
                    <span>{editingProduct ? "Update Product" : "Publish Product"}</span>
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
                  label="Product Platform Name"
                  required
                  tooltip="Title of the platform (e.g. MARK Enterprise ERP). Appears across the products directory and hero section."
                  charCount={{ current: formData.name.length, max: 80, optimal: { min: 8, max: 50 } }}
                  helperText="Use a distinctive, marketable product name."
                >
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. MARK Enterprise ERP"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <FormField
                  label="URL Slug"
                  required
                  tooltip="Direct URL path for the platform page: /products/[slug]. Auto-generated from title."
                >
                  <SlugInput
                    value={formData.slug}
                    onChange={(slug) => setFormData({ ...formData, slug })}
                    titleValue={formData.name}
                    pathPrefix="/products/"
                    isExisting={Boolean(editingProduct)}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <FormField
                  label="Domain Category"
                  tooltip="Industry system classification (e.g. ERP, CRM, POS, School, Hospital)."
                >
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat} System
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Hero Badge Label"
                  tooltip="Uppercase badge above the title on the product landing page."
                  helperText="e.g. ENTERPRISE PLATFORM, MODULAR SAAS"
                >
                  <input
                    type="text"
                    value={formData.heroBadge}
                    onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                    placeholder="e.g. ENTERPRISE PLATFORM"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary uppercase font-mono focus:outline-none focus:border-[var(--color-accent)]"
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
                    Uncheck to temporarily unpublish this platform.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Value Proposition Tagline"
                  required
                  tooltip="Key value headline communicating the competitive differentiator."
                  charCount={{ current: formData.tagline.length, max: 100, optimal: { min: 15, max: 70 } }}
                  helperText="e.g. Real-Time Resource Planning for Global Operations"
                >
                  <input
                    type="text"
                    required
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Real-Time Resource Planning for Global Operations"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <FormField
                  label="Interactive Demo URL"
                  tooltip="External link or staging sandbox where enterprise prospects can preview the live system."
                  helperText="e.g. https://demo.mark2.in/erp"
                >
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://demo.mark2.in/erp"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none focus:border-[var(--color-accent)]"
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
                tooltip="Concise summary rendered in cards across /products and homepage."
                charCount={{ current: formData.description.length, max: 280, optimal: { min: 60, max: 180 } }}
                helperText="Optimal length: 60 - 180 characters."
              >
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Concise overview summarizing platform ROI for cards."
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </FormField>

              <FormField
                label="Full Platform Description (Dedicated Landing Page)"
                tooltip="Comprehensive explanation of capabilities, compliance, security, and migration pathways."
                charCount={{ current: formData.fullDescription.length }}
                helperText="Detailed paragraphs explaining technical approach, architecture, and standards."
              >
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="In-depth explanation of system capabilities, compliance, architectural throughput, and migration pathways."
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)] leading-relaxed"
                />
              </FormField>

              <FormField
                label="Platform Cover Graphic / UI Preview"
                recommendedDimension="1600 × 1000px"
                tooltip="Primary dashboard interface mockup rendered in the product showcase."
              >
                <ImageUploadInput
                  label=""
                  value={formData.coverImage}
                  onChange={(coverImage) => setFormData({ ...formData, coverImage })}
                  helperText="Upload crisp WebP/PNG screenshot of platform interface."
                />
              </FormField>
            </div>
          )}

          {/* TAB 3: MODULES & SPECS */}
          {activeTab === "modules" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Modular Workspace Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                      Platform Modules & Components
                    </label>
                    <p className="text-[11px] text-text-muted">
                      Individual modules rendered in the Modular Enterprise Workspace grid.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addModule}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[var(--color-accent-dark)] bg-[var(--color-accent-glow)] rounded-md cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Module</span>
                  </button>
                </div>

                {formData.modules.length === 0 ? (
                  <div className="text-center py-5 border border-dashed border-[var(--color-border)] rounded-xl bg-surface-2/30">
                    <p className="text-xs text-text-muted">No modules configured yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {formData.modules.map((mod, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-surface-2/60 border border-[var(--color-border)] rounded-xl space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-text-muted px-2 py-0.5 rounded bg-surface-1 border border-[var(--color-border)]">
                            Module #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeModule(idx)}
                            className="p-1 text-text-muted hover:text-red-500 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                          <div className="sm:col-span-4">
                            <VisualIconPicker
                              label="Module Icon"
                              value={mod.icon}
                              onChange={(ic) => handleModuleChange(idx, "icon", ic)}
                            />
                          </div>
                          <div className="sm:col-span-8">
                            <label className="block text-[11px] font-semibold text-text-primary mb-1">
                              Module Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={mod.name}
                              onChange={(e) => handleModuleChange(idx, "name", e.target.value)}
                              placeholder="e.g. Financial Ledger & Reconciliation"
                              className="w-full px-3 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-text-primary mb-1">
                            Module Capabilities Summary *
                          </label>
                          <textarea
                            rows={2}
                            required
                            value={mod.description}
                            onChange={(e) => handleModuleChange(idx, "description", e.target.value)}
                            placeholder="Explain what this module automates for users."
                            className="w-full px-3 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Technical Specifications */}
              <KeyValueListBuilder
                label="Technical Specifications & Benchmarks"
                items={formData.specifications}
                onChange={(specifications) => setFormData({ ...formData, specifications })}
                keyLabel="Specification"
                keyPlaceholder="e.g. Max Concurrency / Latency"
                valueLabel="Value"
                valuePlaceholder="e.g. 50,000 req/sec / <15ms"
                helperText="Displayed in the technical specs table on the product page."
              />
            </div>
          )}

          {/* TAB 4: ECOSYSTEM & SEO */}
          {activeTab === "ecosystem" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ArrayInput
                  label="Direct Integrations & Connectors"
                  items={formData.integrations}
                  onChange={(integrations) => setFormData({ ...formData, integrations })}
                  placeholder="e.g. Stripe, Salesforce, AWS S3..."
                  helperText="Enterprise third-party tools this platform connects with."
                />

                <ArrayInput
                  label="Target Industry Verticals"
                  items={formData.targetIndustries}
                  onChange={(targetIndustries) => setFormData({ ...formData, targetIndustries })}
                  placeholder="e.g. Healthcare, Retail..."
                  helperText="Sectors where this solution has demonstrated proven ROI."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ArrayInput
                  label="Deployment Infrastructures"
                  items={formData.deploymentOptions}
                  onChange={(deploymentOptions) => setFormData({ ...formData, deploymentOptions })}
                  placeholder="e.g. AWS VPC, GCP, Private On-Prem..."
                />

                <ArrayInput
                  label="Security & Regulatory Compliance"
                  items={formData.securityCompliance}
                  onChange={(securityCompliance) => setFormData({ ...formData, securityCompliance })}
                  placeholder="e.g. SOC2, HIPAA, ISO 27001..."
                />
              </div>

              <KeyValueListBuilder
                label="Product FAQs"
                items={formData.faqs}
                onChange={(faqs) => setFormData({ ...formData, faqs })}
                keyLabel="Question"
                keyPlaceholder="e.g. Can we customize the UI schema?"
                valueLabel="Answer"
                valuePlaceholder="e.g. Yes, every module exposes customizable React components..."
                helperText="Frequently asked licensing and architectural questions."
              />

              <SeoHelperInputs
                metaTitle={formData.metaTitle}
                onChangeMetaTitle={(metaTitle) => setFormData({ ...formData, metaTitle })}
                metaDescription={formData.metaDescription}
                onChangeMetaDescription={(metaDescription) => setFormData({ ...formData, metaDescription })}
                keywords={formData.keywords}
                onChangeKeywords={(keywords) => setFormData({ ...formData, keywords })}
                canonicalPath={`/products/${formData.slug}`}
                fallbackTitle={formData.name}
                fallbackDescription={formData.description}
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
        title="Delete Software Platform"
        description="Are you sure you want to permanently delete this product? All configured modules, specifications, and screenshots will be permanently erased."
        confirmText="Delete Product"
      />
    </div>
  );
}
