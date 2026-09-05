"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  recommendedDimension?: string;
}

export function ImageUploadInput({
  label,
  value,
  onChange,
  helperText,
  recommendedDimension,
}: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setUploadError(data.error || "Failed to upload image");
      }
    } catch (err: any) {
      setUploadError("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
          {label}
        </label>
        {recommendedDimension && (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-text-muted bg-surface-2 px-2 py-0.5 rounded border border-[var(--color-border)]">
            <ImageIcon size={10} className="text-text-muted" />
            {recommendedDimension}
          </span>
        )}
      </div>

      {/* Preview if image URL exists */}
      {value ? (
        <div className="relative group w-full h-36 rounded-xl border border-[var(--color-border)] overflow-hidden bg-surface-2 flex items-center justify-center">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-text-primary text-xs font-semibold rounded-md shadow-sm hover:bg-surface-2 transition-all"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 transition-all"
              title="Remove"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-surface-2/60 hover:bg-surface-2 transition-all ${
            isUploading ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center py-2">
              <Loader2 size={24} className="animate-spin text-[var(--color-accent-dark)] mb-2" />
              <p className="text-xs text-text-secondary">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-2">
              <div className="w-10 h-10 rounded-full bg-surface-1 border border-[var(--color-border)] flex items-center justify-center text-text-muted mb-2 shadow-sm">
                <Upload size={18} className="text-[var(--color-accent-dark)]" />
              </div>
              <p className="text-xs font-semibold text-text-primary">Click to upload file</p>
              <p className="text-[11px] text-text-muted mt-0.5">PNG, JPG, SVG, WebP up to 10MB</p>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Direct URL text option */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL (e.g. /uploads/image.webp or https://...)"
          className="flex-1 px-3 py-1.5 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
        />
      </div>

      {uploadError && <p className="text-[11px] text-red-600">{uploadError}</p>}
      {helperText && !uploadError && <p className="text-[11px] text-text-muted">{helperText}</p>}
    </div>
  );
}
