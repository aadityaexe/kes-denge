"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FormTabs, FormTabItem } from "@/components/admin/FormTabs";
import { SlugInput } from "@/components/admin/SlugInput";
import { ArrayInput } from "@/components/admin/ArrayInput";
import { SeoHelperInputs } from "@/components/admin/SeoHelperInputs";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";
import { FormField } from "@/components/admin/FormField";
import { StatusBreakdownBar } from "@/components/admin/StatusBreakdownBar";
import { useToast } from "@/components/admin/Toast";
import {
  Edit2,
  Trash2,
  Plus,
  BookOpen,
  ExternalLink,
  Layers,
  FileText,
  Search,
  Check,
} from "lucide-react";

const categories = ["Engineering", "Product", "Architecture", "Design", "AI & Automation"];
const statuses = ["published", "draft", "archived"];

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    category: "Engineering",
    tags: [] as string[],
    authorName: "MARK Team",
    authorRole: "Technical Architect",
    status: "published",
    metaTitle: "",
    metaDescription: "",
    readTime: "5 min read",
  });

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (res.ok) setPosts(data.posts || []);
    } catch (err) {
      console.error("Error fetching posts", err);
      toastError("Failed to load blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCreateModal = () => {
    setEditingPost(null);
    setActiveTab("general");
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      category: "Engineering",
      tags: ["Next.js", "Architecture", "TypeScript"],
      authorName: "MARK Team",
      authorRole: "Technical Architect",
      status: "published",
      metaTitle: "",
      metaDescription: "",
      readTime: "5 min read",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (post: any) => {
    setEditingPost(post);
    setActiveTab("general");
    setFormData({
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      featuredImage: post.featuredImage || "",
      category: post.category || "Engineering",
      tags: Array.isArray(post.tags) ? post.tags : [],
      authorName: post.author?.name || "MARK Team",
      authorRole: post.author?.role || "Technical Architect",
      status: post.status || "published",
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      readTime: post.readTime || "5 min read",
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

  const handleToggleStatus = async (post: any) => {
    const nextStatus = post.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/blog/${post._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p._id === post._id ? { ...p, status: nextStatus } : p))
        );
        success(`Post marked as ${nextStatus.toUpperCase()}`);
      } else {
        toastError("Failed to update status");
      }
    } catch (err) {
      toastError("Error updating post status");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    const payload = {
      ...formData,
      author: {
        name: formData.authorName,
        role: formData.authorRole,
      },
    };

    try {
      const url = editingPost
        ? `/api/admin/blog/${editingPost._id}`
        : `/api/admin/blog`;
      const method = editingPost ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save post");
      }

      setIsModalOpen(false);
      fetchPosts();
      success(editingPost ? "Article updated successfully!" : "Article published successfully!");
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
      const res = await fetch(`/api/admin/blog/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        fetchPosts();
        success("Article deleted successfully");
      } else {
        toastError("Failed to delete article");
      }
    } catch (err) {
      toastError("Error deleting article");
    }
  };

  const tabs: FormTabItem[] = [
    { id: "general", label: "General & Author", icon: Layers },
    { id: "content", label: "Article Content", icon: FileText },
    { id: "seo", label: "Tags & SEO", icon: Search },
  ];

  const wordCount = formData.content
    ? formData.content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const filteredPosts = posts.filter((post) => {
    if (statusFilter === "all") return true;
    return post.status === statusFilter;
  });

  const columns: Column<any>[] = [
    {
      header: "Article",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.featuredImage ? (
            <img src={row.featuredImage} alt={row.title} className="w-10 h-10 rounded-lg object-cover border border-[var(--color-border)]" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] flex items-center justify-center">
              <BookOpen size={16} />
            </div>
          )}
          <div>
            <div className="font-semibold text-text-primary text-xs">{row.title}</div>
            <div className="text-[11px] text-text-muted font-mono">
              {row.category} • {row.readTime || "5 min read"}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Author",
      cell: (row) => (
        <div className="text-xs">
          <p className="font-medium text-text-primary">{row.author?.name || "MARK Team"}</p>
          <p className="text-[10px] text-text-muted">{row.author?.role || "Architect"}</p>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <button
          type="button"
          onClick={() => handleToggleStatus(row)}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
            row.status === "published"
              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
              : row.status === "draft"
              ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
              : "bg-zinc-500/10 text-zinc-500"
          }`}
          title="Click to toggle published status"
        >
          {row.status === "published" ? "● Published" : "○ Draft"}
        </button>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={`/blog/${row.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-surface-3 text-text-muted hover:text-text-primary transition-colors"
            title="View Live Article"
          >
            <ExternalLink size={14} />
          </a>
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 rounded-md hover:bg-surface-3 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title="Edit Article"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-600 transition-colors cursor-pointer"
            title="Delete Article"
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
        title="Engineering Insights & Blog"
        description="Publish, edit, and organize architectural thought leadership, case studies, and engineering essays"
        actionButton={{
          label: "Add Article",
          onClick: openCreateModal,
          icon: Plus,
        }}
        onRefresh={fetchPosts}
        isLoading={isLoading}
      />

      <div className="p-6 sm:p-8 max-w-7xl space-y-4">
        <StatusBreakdownBar
          items={[
            { id: "all", label: "All Articles", count: posts.length },
            { id: "published", label: "Published", count: posts.filter((p) => p.status === "published").length, color: "emerald" },
            { id: "draft", label: "Drafts", count: posts.filter((p) => p.status === "draft").length, color: "amber" },
            { id: "archived", label: "Archived", count: posts.filter((p) => p.status === "archived").length, color: "zinc" },
          ]}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        <DataTable
          columns={columns}
          data={filteredPosts}
          searchPlaceholder="Search articles by headline or tag..."
          searchKey="title"
          isLoading={isLoading}
          emptyMessage="No articles found for this status. Click 'Add Article' to publish engineering insights."
        />
      </div>

      {/* Modal with Pinned Footer and Tabs */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPost ? `Edit Article: ${editingPost.title}` : "Create Engineering Article"}
        description="Draft, edit, and format thought leadership with live word counters and SEO optimization."
        maxWidth="4xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <div>
              {editingPost && formData.slug && (
                <a
                  href={`/blog/${formData.slug}`}
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
                    <span>{editingPost ? "Update Article" : "Publish Article"}</span>
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

          {/* TAB 1: GENERAL & AUTHOR */}
          {activeTab === "general" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Article Title"
                  required
                  tooltip="Headline displayed in the blog card, main banner, and social share links."
                  charCount={{ current: formData.title.length, optimal: { min: 30, max: 80 }, max: 120 }}
                >
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Distributed State Synchronization in Next.js 15"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <div>
                  <SlugInput
                    value={formData.slug}
                    onChange={(slug) => setFormData({ ...formData, slug })}
                    titleValue={formData.title}
                    pathPrefix="/blog/"
                    isExisting={Boolean(editingPost)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  label="Topic Category"
                  required
                  tooltip="Primary subject category used to filter articles on the public /blog index."
                >
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Publish Status"
                  tooltip="Controls public accessibility: Draft hides the post; Published exposes it on the live blog."
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
                  label="Estimated Read Time"
                  tooltip="Displayed on blog listing cards and the article header (e.g. '5 min read')."
                >
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g. 6 min read"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Author Name"
                  tooltip="Byline author credited on the article header and metadata."
                >
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="e.g. MARK Team"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <FormField
                  label="Author Role / Title"
                  tooltip="Professional engineering title displayed beside the author avatar (e.g. Principal System Architect)."
                >
                  <input
                    type="text"
                    value={formData.authorRole}
                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                    placeholder="e.g. Principal System Architect"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT & MEDIA */}
          {activeTab === "content" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <ImageUploadInput
                label="Featured Header Image"
                value={formData.featuredImage}
                onChange={(featuredImage) => setFormData({ ...formData, featuredImage })}
                helperText="Cover banner displayed at the top of the article and social share cards."
                recommendedDimension="1200x630px (16:9 / OG)"
              />

              <FormField
                label="Article Excerpt"
                required
                tooltip="Concise summary shown on blog feed cards, Google search snippets, and RSS previews."
                charCount={{ current: formData.excerpt.length, optimal: { min: 100, max: 160 }, max: 200 }}
              >
                <textarea
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Compelling 2-sentence hook displayed in article feed cards."
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </FormField>

              <FormField
                label="Article Body (Markdown Supported)"
                required
                tooltip="Full article content formatted in Markdown (supports ## headings, code blocks, bullet points, and links)."
                charCount={{ current: formData.content.length, optimal: { min: 500, max: 8000 } }}
                helperText={`${wordCount} words • Estimated ${Math.max(1, Math.ceil(wordCount / 200))} min read`}
              >
                <textarea
                  required
                  rows={10}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write in Markdown format (## Headings, code blocks, bullet points)..."
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none focus:border-[var(--color-accent)] leading-relaxed"
                />
              </FormField>
            </div>
          )}

          {/* TAB 3: TAGS & SEO */}
          {activeTab === "seo" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <ArrayInput
                label="Article Tags & Topics"
                items={formData.tags}
                onChange={(tags) => setFormData({ ...formData, tags })}
                placeholder="Add tag (e.g. Next.js) and press Enter..."
                helperText="Tags help categorize content and connect related reading recommendations."
              />

              <SeoHelperInputs
                metaTitle={formData.metaTitle}
                onChangeMetaTitle={(metaTitle) => setFormData({ ...formData, metaTitle })}
                metaDescription={formData.metaDescription}
                onChangeMetaDescription={(metaDescription) => setFormData({ ...formData, metaDescription })}
                canonicalPath={`/blog/${formData.slug}`}
                fallbackTitle={formData.title}
                fallbackDescription={formData.excerpt}
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
        title="Delete Article"
        description="Are you sure you want to delete this article? Once deleted, the URL may return a 404 error."
        confirmText="Delete Article"
      />
    </div>
  );
}
