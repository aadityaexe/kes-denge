"use client";

import { Modal } from "@/components/admin/Modal";
import { FormField } from "@/components/admin/FormField";
import { safeHref } from "@/lib/schemas";
import type { JobApplication } from "@/lib/types";
import { ExternalLink, FileText, Globe, Link as LinkIcon, Mail, MapPin, Phone } from "lucide-react";

const APP_STATUSES = [
  "new",
  "reviewing",
  "shortlisted",
  "interviewing",
  "hired",
  "rejected",
] as const;

interface ApplicationReviewModalProps {
  application: JobApplication | null;
  statusDraft: string;
  notesDraft: string;
  saving: boolean;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onNotesChange: (notes: string) => void;
  onSave: () => void;
}

export function ApplicationReviewModal({
  application,
  statusDraft,
  notesDraft,
  saving,
  onClose,
  onStatusChange,
  onNotesChange,
  onSave,
}: ApplicationReviewModalProps) {
  return (
    <Modal
      isOpen={Boolean(application)}
      onClose={onClose}
      title={application ? `Application: ${application.applicantName}` : "Application"}
      maxWidth="2xl"
    >
      {application && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-surface-2 border border-[var(--color-border)] space-y-2">
            <p className="text-xs text-text-muted">Applied for</p>
            <p className="text-base font-display font-semibold text-text-primary">
              {application.jobTitle}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-secondary pt-1">
              <a
                href={`mailto:${application.email}`}
                className="inline-flex items-center gap-1 hover:text-[var(--color-accent-dark)]"
              >
                <Mail size={12} /> {application.email}
              </a>
              {application.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone size={12} /> {application.phone}
                </span>
              )}
              {application.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} /> {application.location}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {application.resumeUrl && (
              <a
                href={safeHref(application.resumeUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-2 border border-[var(--color-border)] text-xs font-medium text-text-primary hover:border-[var(--color-accent)]"
              >
                <FileText size={13} /> View Resume <ExternalLink size={11} />
              </a>
            )}
            {application.linkedinUrl && (
              <a
                href={safeHref(application.linkedinUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-2 border border-[var(--color-border)] text-xs font-medium text-text-primary hover:border-[var(--color-accent)]"
              >
                <LinkIcon size={13} /> LinkedIn <ExternalLink size={11} />
              </a>
            )}
            {application.portfolioUrl && (
              <a
                href={safeHref(application.portfolioUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-2 border border-[var(--color-border)] text-xs font-medium text-text-primary hover:border-[var(--color-accent)]"
              >
                <Globe size={13} /> Portfolio / GitHub <ExternalLink size={11} />
              </a>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Cover Letter / Note
            </p>
            <div className="p-4 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
              {application.coverLetter}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
            <FormField label="Application Status">
              <select
                value={statusDraft}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary capitalize"
              >
                {APP_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Internal Hiring Notes">
              <textarea
                rows={2}
                value={notesDraft}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Interview feedback, next steps..."
                className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary"
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-medium text-text-secondary cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-text-primary text-surface-1 text-xs font-semibold hover:bg-[var(--color-accent-dark)] disabled:opacity-60 cursor-pointer"
            >
              {saving ? "Saving..." : "Update Application"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
