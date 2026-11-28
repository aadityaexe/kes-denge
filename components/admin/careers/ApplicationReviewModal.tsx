"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/admin/Modal";
import { FormField } from "@/components/admin/FormField";
import { safeHref } from "@/lib/schemas";
import type { JobApplication } from "@/lib/types";
import {
  Briefcase,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  Link as LinkIcon,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Star,
  Video,
  XCircle,
} from "lucide-react";

const PIPELINE_STAGES = [
  { id: "new", label: "New" },
  { id: "reviewing", label: "Reviewing" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "interviewing", label: "Interviewing" },
  { id: "hired", label: "Hired" },
] as const;

const NOTE_SNIPPETS = [
  "Strong technical fit",
  "Screening call scheduled",
  "Assessment sent",
  "Good communication",
  "Not enough relevant experience",
];

const STATUS_BADGE_MAP: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-700 border-blue-500/25",
  reviewing: "bg-amber-500/10 text-amber-700 border-amber-500/25",
  shortlisted: "bg-purple-500/10 text-purple-700 border-purple-500/25",
  interviewing: "bg-indigo-500/10 text-indigo-700 border-indigo-500/25",
  hired: "bg-emerald-500/10 text-emerald-700 border-emerald-500/25",
  rejected: "bg-red-500/10 text-red-700 border-red-500/25",
};

interface ApplicationReviewModalProps {
  application: JobApplication | null;
  statusDraft: string;
  notesDraft: string;
  ratingDraft: number;
  interviewDateDraft: string;
  interviewLinkDraft: string;
  saving: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onNotesChange: (notes: string) => void;
  onRatingChange: (rating: number) => void;
  onInterviewDateChange: (val: string) => void;
  onInterviewLinkChange: (val: string) => void;
  onSave: () => void;
}

function buildMailto(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function getWhatsAppUrl(phone: string, name: string, role: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  const msg = `Hi ${name}, this is the MARK2 hiring team regarding your application for ${role}.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}

export function ApplicationReviewModal({
  application,
  statusDraft,
  notesDraft,
  ratingDraft,
  interviewDateDraft,
  interviewLinkDraft,
  saving,
  hasPrev = false,
  hasNext = false,
  onPrev,
  onNext,
  onClose,
  onStatusChange,
  onNotesChange,
  onRatingChange,
  onInterviewDateChange,
  onInterviewLinkChange,
  onSave,
}: ApplicationReviewModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (val: string, field: string) => {
    navigator.clipboard.writeText(val);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const appliedAtLabel = application?.createdAt
    ? new Date(application.createdAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const jobPostingHref = application?.jobSlug ? `/careers/${application.jobSlug}` : "/careers";
  const currentStageIndex = PIPELINE_STAGES.findIndex((s) => s.id === statusDraft);

  return (
    <Modal
      isOpen={Boolean(application)}
      onClose={onClose}
      title={application ? `Application: ${application.applicantName}` : "Application"}
      description={application ? `Applied on ${appliedAtLabel}` : undefined}
      maxWidth="3xl"
      footer={
        application ? (
          <div className="w-full flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={onPrev}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-surface-1 text-xs font-medium text-text-primary hover:bg-surface-3 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                type="button"
                disabled={!hasNext}
                onClick={onNext}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-surface-1 text-xs font-medium text-text-primary hover:bg-surface-3 disabled:opacity-40 cursor-pointer"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-surface-1 text-xs font-medium text-text-secondary hover:text-text-primary cursor-pointer"
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
        ) : undefined
      }
    >
      {application && (
        <div className="space-y-5">
          {/* Interactive Hiring Pipeline Stepper */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-surface-2/70 border border-[var(--color-border)] space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-semibold">
                Hiring Pipeline Stage
              </span>
              <button
                type="button"
                onClick={() => onStatusChange(statusDraft === "rejected" ? "reviewing" : "rejected")}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                  statusDraft === "rejected"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-surface-1 text-red-600 border-red-500/25 hover:bg-red-500/10"
                }`}
              >
                <XCircle size={12} />
                {statusDraft === "rejected" ? "Rejected (Click to Undo)" : "Reject Candidate"}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {PIPELINE_STAGES.map((stage, idx) => {
                const isActive = statusDraft === stage.id;
                const isPassed = currentStageIndex > idx && statusDraft !== "rejected";
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => onStatusChange(stage.id)}
                    className={`px-2.5 py-2 rounded-lg border text-xs font-semibold transition-all text-center cursor-pointer ${
                      isActive
                        ? "bg-text-primary text-surface-1 border-text-primary shadow-xs"
                        : isPassed
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/25"
                        : "bg-surface-1 text-text-secondary border-[var(--color-border)] hover:border-[var(--color-accent)]"
                    }`}
                  >
                    {idx + 1}. {stage.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Job Role Header + Direct Job Posting Link */}
          <div className="p-4 rounded-xl bg-surface-2 border border-[var(--color-border)] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-text-muted">Applied for</span>
                  <span
                    className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${
                      STATUS_BADGE_MAP[statusDraft] || "bg-surface-1 text-text-secondary border-[var(--color-border)]"
                    }`}
                  >
                    {statusDraft}
                  </span>
                </div>
                <p className="text-base sm:text-lg font-display font-semibold text-text-primary">
                  {application.jobTitle}
                </p>
              </div>

              <Link
                href={jobPostingHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-1 border border-[var(--color-border)] text-xs font-semibold text-text-primary hover:border-[var(--color-accent)] hover:text-[var(--color-accent-dark)] transition-colors shrink-0"
              >
                <Briefcase size={13} />
                View Job Posting
                <ExternalLink size={12} />
              </Link>
            </div>

            {/* Candidate Contact Info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-secondary pt-2 border-t border-[var(--color-border)]">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={12} className="text-[var(--color-accent-dark)]" />
                <a
                  href={`mailto:${application.email}`}
                  className="hover:text-[var(--color-accent-dark)] font-medium underline-offset-2 hover:underline"
                >
                  {application.email}
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(application.email, "email")}
                  title="Copy email"
                  className="p-1 rounded hover:bg-surface-3 text-text-muted hover:text-text-primary cursor-pointer"
                >
                  {copiedField === "email" ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                </button>
              </span>

              {application.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={12} className="text-[var(--color-accent-dark)]" />
                  <a href={`tel:${application.phone}`} className="hover:text-[var(--color-accent-dark)]">
                    {application.phone}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(application.phone || "", "phone")}
                    title="Copy phone"
                    className="p-1 rounded hover:bg-surface-3 text-text-muted hover:text-text-primary cursor-pointer"
                  >
                    {copiedField === "phone" ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                  </button>
                </span>
              )}

              {application.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} className="text-[var(--color-accent-dark)]" /> {application.location}
                </span>
              )}
            </div>
          </div>

          {/* Candidate Background Highlights + Rating */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-surface-2/60 border border-[var(--color-border)]">
              <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Current Role</p>
              <p className="text-xs font-semibold text-text-primary mt-1 truncate">
                {application.currentRole || "Not specified"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-surface-2/60 border border-[var(--color-border)]">
              <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Experience</p>
              <p className="text-xs font-semibold text-text-primary mt-1">
                {application.experienceYears || "Not specified"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-surface-2/60 border border-[var(--color-border)]">
              <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted flex items-center gap-1">
                <Clock size={10} /> Notice Period
              </p>
              <p className="text-xs font-semibold text-text-primary mt-1">
                {application.noticePeriod || "Immediate / N/A"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-surface-2/60 border border-[var(--color-border)]">
              <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted flex items-center gap-1">
                <Calendar size={10} /> Applied Date
              </p>
              <p className="text-xs font-semibold text-text-primary mt-1">
                {application.createdAt
                  ? new Date(application.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-surface-2/60 border border-[var(--color-border)]">
              <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Rating</p>
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => onRatingChange(ratingDraft === star ? 0 : star)}
                    aria-label={`Rate ${star} out of 5`}
                    className="p-0.5 cursor-pointer"
                  >
                    <Star
                      size={14}
                      className={
                        star <= ratingDraft
                          ? "fill-[var(--color-accent)] text-[var(--color-accent-dark)]"
                          : "text-text-muted/40 hover:text-[var(--color-accent)]"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* External Links & One-Click Communication Templates */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap gap-2">
              {application.resumeUrl && (
                <a
                  href={safeHref(application.resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-text-primary text-surface-1 text-xs font-medium hover:bg-[var(--color-accent-dark)] transition-colors"
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
              {application.phone && (
                <>
                  <a
                    href={getWhatsAppUrl(application.phone, application.applicantName, application.jobTitle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                  <a
                    href={`tel:${application.phone}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-2 border border-[var(--color-border)] text-xs font-medium text-text-primary hover:bg-surface-3"
                  >
                    <PhoneCall size={13} /> Call
                  </a>
                </>
              )}
            </div>

            {/* Email Action Templates */}
            <div className="p-3 rounded-xl bg-[var(--color-accent)]/6 border border-[var(--color-accent)]/20 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-text-primary mr-1 flex items-center gap-1">
                <Mail size={12} className="text-[var(--color-accent-dark)]" /> Email Templates:
              </span>
              <a
                href={buildMailto(
                  application.email,
                  `Screening Call Invitation: ${application.jobTitle} — MARK2`,
                  `Hi ${application.applicantName},\n\nThank you for applying for the ${application.jobTitle} role at MARK2. We reviewed your profile and would love to invite you for a 20-minute screening call.\n\nPlease share your preferred availability over the next 2–3 days.\n\nBest regards,\nMARK2 Hiring Team`
                )}
                className="px-2.5 py-1 rounded-lg bg-surface-1 border border-[var(--color-border)] text-[11px] font-medium text-text-primary hover:border-[var(--color-accent)]"
              >
                Screening Invite
              </a>
              <a
                href={buildMailto(
                  application.email,
                  `Technical Assessment: ${application.jobTitle} — MARK2`,
                  `Hi ${application.applicantName},\n\nCongratulations on moving forward for the ${application.jobTitle} position! As the next step, please complete our practical technical assessment.\n\nBest regards,\nMARK2 Hiring Team`
                )}
                className="px-2.5 py-1 rounded-lg bg-surface-1 border border-[var(--color-border)] text-[11px] font-medium text-text-primary hover:border-[var(--color-accent)]"
              >
                Send Assessment
              </a>
              <a
                href={buildMailto(
                  application.email,
                  `Offer Letter: ${application.jobTitle} — MARK2`,
                  `Hi ${application.applicantName},\n\nWe are thrilled to extend an offer for you to join MARK2 as a ${application.jobTitle}! Please find the next steps below.\n\nWelcome aboard!\nMARK2 Hiring Team`
                )}
                className="px-2.5 py-1 rounded-lg bg-surface-1 border border-[var(--color-border)] text-[11px] font-medium text-emerald-700 hover:border-emerald-500"
              >
                Extend Offer
              </a>
              <a
                href={buildMailto(
                  application.email,
                  `Update on your application for ${application.jobTitle} — MARK2`,
                  `Hi ${application.applicantName},\n\nThank you for taking the time to apply for ${application.jobTitle} at MARK2. After careful review, we won't be moving forward at this time, but we will keep your profile on file for future openings.\n\nWishing you the very best,\nMARK2 Hiring Team`
                )}
                className="px-2.5 py-1 rounded-lg bg-surface-1 border border-[var(--color-border)] text-[11px] font-medium text-text-secondary hover:border-red-400"
              >
                Polite Rejection
              </a>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Cover Letter / Note
            </p>
            <div className="p-4 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
              {application.coverLetter}
            </div>
          </div>

          {/* Interview Scheduling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
            <FormField label="Interview Date & Time (Optional)">
              <input
                type="datetime-local"
                value={interviewDateDraft}
                onChange={(e) => onInterviewDateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-xs sm:text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
              />
            </FormField>

            <FormField label="Meeting Link (Google Meet / Zoom)">
              <div className="relative">
                <Video
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
                <input
                  type="url"
                  value={interviewLinkDraft}
                  onChange={(e) => onInterviewLinkChange(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-xs sm:text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            </FormField>
          </div>

          {/* Internal Hiring Notes + Quick Chips */}
          <div className="space-y-2">
            <FormField label="Internal Hiring Notes">
              <textarea
                rows={3}
                value={notesDraft}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Interview feedback, technical strengths, next steps..."
                className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
              />
            </FormField>

            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-text-muted">Quick add:</span>
              {NOTE_SNIPPETS.map((snippet) => (
                <button
                  key={snippet}
                  type="button"
                  onClick={() =>
                    onNotesChange(notesDraft ? `${notesDraft}\n• ${snippet}` : `• ${snippet}`)
                  }
                  className="px-2 py-0.5 rounded-md bg-surface-2 border border-[var(--color-border)] text-text-secondary hover:text-text-primary hover:border-[var(--color-accent)] transition-colors cursor-pointer"
                >
                  + {snippet}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
