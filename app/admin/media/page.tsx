"use client";

import { useEffect, useState, useRef } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StatusBreakdownBar } from "@/components/admin/StatusBreakdownBar";
import { useToast } from "@/components/admin/Toast";
import {
  Upload,
  Copy,
  Check,
  Trash2,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
  Search,
} from "lucide-react";

export default function MediaAdminPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [storageFilter, setStorageFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error: toastError } = useToast();

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (res.ok) setMediaList(data.media || []);
    } catch (err) {
      console.error("Error fetching media", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) successCount++;
      }
      if (successCount > 0) {
        success(`${successCount} asset${successCount > 1 ? "s" : ""} uploaded successfully`);
      } else {
        toastError("Upload failed. Check file formats and network.");
      }
      fetchMedia();
    } catch (err) {
      console.error("Error uploading files", err);
      toastError("An error occurred during file upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    success("Image asset URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/media?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        success("Asset removed from media library");
        fetchMedia();
      } else {
        toastError("Failed to delete media asset");
      }
    } catch (err) {
      console.error("Failed to delete media", err);
      toastError("Error deleting media asset");
    }
  };

  const filteredMedia = mediaList.filter((m) => {
    const matchesSearch = (m.originalName || m.filename).toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (storageFilter === "cloudinary") return Boolean(m.publicId);
    if (storageFilter === "local") return !m.publicId;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Media & File Library"
        description="Upload, view, manage, and copy URLs of website images and assets"
        actionButton={{
          label: isUploading ? "Uploading..." : "Upload Images",
          onClick: () => fileInputRef.current?.click(),
          icon: Upload,
        }}
        onRefresh={fetchMedia}
        isLoading={isLoading}
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Drag and Drop Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] bg-surface-1 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-surface-2 group"
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 size={32} className="animate-spin text-[var(--color-accent-dark)] mb-3" />
              <p className="text-sm font-semibold text-text-primary">Uploading selected assets...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-surface-2 border border-[var(--color-border)] flex items-center justify-center text-text-muted mb-3 group-hover:scale-105 transition-transform shadow-sm">
                <Upload size={22} className="text-[var(--color-accent-dark)]" />
              </div>
              <p className="text-sm font-bold text-text-primary">Click or drop files to upload to media library</p>
              <p className="text-xs text-text-muted mt-1">Supports PNG, JPG, SVG, WebP up to 10MB each</p>
            </div>
          )}
        </div>

        {/* Storage Breakdown & Filtering */}
        <StatusBreakdownBar
          items={[
            { id: "all", label: "All Media", count: mediaList.length },
            { id: "cloudinary", label: "Cloudinary CDN", count: mediaList.filter((m) => Boolean(m.publicId)).length, color: "blue" },
            { id: "local", label: "Local Storage", count: mediaList.filter((m) => !m.publicId).length, color: "zinc" },
          ]}
          activeFilter={storageFilter}
          onFilterChange={setStorageFilter}
        />

        {/* Media Dimension Quick Reference Guide */}
        <div className="bg-surface-1 border border-[var(--color-border)] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] flex items-center justify-center font-bold shrink-0">
              📐
            </div>
            <div>
              <p className="font-bold text-text-primary">Website Dimension Recommendation Cheatsheet</p>
              <p className="text-text-muted">Upload assets optimized for each section to ensure lightning-fast page loading:</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="px-2 py-1 rounded bg-surface-2 border border-[var(--color-border)] text-text-secondary">
              <strong className="text-text-primary">Heroes:</strong> 1920×1080px
            </span>
            <span className="px-2 py-1 rounded bg-surface-2 border border-[var(--color-border)] text-text-secondary">
              <strong className="text-text-primary">Case Studies:</strong> 1600×1000px
            </span>
            <span className="px-2 py-1 rounded bg-surface-2 border border-[var(--color-border)] text-text-secondary">
              <strong className="text-text-primary">Blog Covers:</strong> 1200×630px
            </span>
            <span className="px-2 py-1 rounded bg-surface-2 border border-[var(--color-border)] text-text-secondary">
              <strong className="text-text-primary">Team / Avatars:</strong> 500×500px
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4 bg-surface-1 p-4 rounded-xl border border-[var(--color-border)]">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search uploaded files by name..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          <span className="text-xs text-text-muted font-mono">{filteredMedia.length} Files</span>
        </div>

        {/* Media Grid */}
        {isLoading ? (
          <div className="p-16 text-center text-text-muted">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-accent-dark)] border-r-transparent mb-2" />
            <p className="text-xs">Loading media assets...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-16 text-center text-text-muted">
            <ImageIcon size={36} className="mx-auto mb-2 text-text-muted/60" />
            <p className="text-sm font-semibold text-text-primary mb-1">No media files found</p>
            <p className="text-xs text-text-muted">Upload images to reuse them across services, case studies, and blogs.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMedia.map((item) => {
              const isCopied = copiedId === item._id;
              const sizeInKb = Math.round(item.size / 1024);

              return (
                <div
                  key={item._id}
                  className="group relative bg-surface-1 border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-black/20 hover:shadow-md transition-all flex flex-col"
                >
                  {/* Thumbnail Image */}
                  <div className="w-full h-32 bg-surface-2 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={item.url}
                      alt={item.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Storage Badge */}
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm pointer-events-none">
                      {item.publicId ? "Cloudinary" : "Local"}
                    </div>

                    {/* Hover Quick Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => copyToClipboard(item.url, item._id)}
                        className="p-2 bg-white text-text-primary rounded-lg shadow-sm hover:bg-surface-2 transition-all"
                        title="Copy Public URL"
                      >
                        {isCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white text-text-primary rounded-lg shadow-sm hover:bg-surface-2 transition-all"
                        title="Open Full Image"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => setDeleteId(item._id)}
                        className="p-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-all"
                        title="Delete Image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="p-2.5">
                    <p className="text-[11px] font-semibold text-text-primary truncate" title={item.originalName}>
                      {item.originalName}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-text-muted mt-0.5 font-mono">
                      <span>{sizeInKb} KB</span>
                      <span>{item.width && item.height ? `${item.width}x${item.height}` : new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this media file permanently?"
      />
    </div>
  );
}
