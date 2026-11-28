"use client";

import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";
import {
  Check,
  Copy,
  DollarSign,
  Mail,
  MessageCircle,
  Phone,
  PhoneCall,
  StickyNote,
  Tag,
  Trash2,
} from "lucide-react";
import { VALID_STATUSES } from "./constants";

interface MessageDetailModalProps {
  message: any | null;
  editingNotes: string;
  isSavingNotes: boolean;
  copiedField: string | null;
  onClose: () => void;
  onNotesChange: (notes: string) => void;
  onSaveNotes: () => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onCopy: (text: string, field: string) => void;
  getWhatsAppLink: (phone: string, name: string, projectType: string) => string;
}

export function MessageDetailModal({
  message,
  editingNotes,
  isSavingNotes,
  copiedField,
  onClose,
  onNotesChange,
  onSaveNotes,
  onStatusChange,
  onDelete,
  onCopy,
  getWhatsAppLink,
}: MessageDetailModalProps) {
  if (!message) return null;

  return (
    <Modal
      isOpen={!!message}
      onClose={onClose}
      title={`Lead: ${message.name}`}
      description={`Received on ${new Date(message.createdAt).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Quick Communication Action Bar */}
        <div className="p-3.5 bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 rounded-xl flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-bold text-text-primary block">Direct Communication Shortcuts</span>
            <span className="text-text-muted text-[11px]">Connect directly with client across preferred channels:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.projectType} Inquiry — MARK2`)}&body=${encodeURIComponent(`Hi ${message.name},\n\nThank you for reaching out to MARK2 regarding your ${message.projectType} project requirements.\n\nWe reviewed your requirements and would love to schedule a brief discovery call to discuss scope, timeline, and architectural approach.\n\nBest regards,\nMARK Technologies Engineering Team`)}`}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Mail size={13} />
              <span>Reply via Email</span>
            </a>

            {message.phone ? (
              <>
                <a
                  href={getWhatsAppLink(message.phone, message.name, message.projectType)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <MessageCircle size={13} />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${message.phone}`}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface-2 border border-[var(--color-border)] text-text-primary hover:bg-surface-3 transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall size={13} />
                  <span>Call</span>
                </a>
              </>
            ) : null}
          </div>
        </div>

        {/* Sender Summary Cards */}
        <div className="bg-surface-2 p-4 rounded-xl border border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-surface-1 border border-[var(--color-border)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <Mail size={16} className="text-[var(--color-accent-dark)] shrink-0" />
              <div className="min-w-0">
                <span className="text-text-muted text-[10px] uppercase font-mono block">Email Address</span>
                <a href={`mailto:${message.email}`} className="font-semibold text-text-primary hover:underline truncate block">
                  {message.email}
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onCopy(message.email, "email")}
              className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors shrink-0"
              title="Copy email"
            >
              {copiedField === "email" ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            </button>
          </div>

          {message.phone ? (
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-surface-1 border border-[var(--color-border)]">
              <div className="flex items-center gap-2.5 min-w-0">
                <Phone size={16} className="text-[var(--color-accent-dark)] shrink-0" />
                <div className="min-w-0">
                  <span className="text-text-muted text-[10px] uppercase font-mono block">Phone Number</span>
                  <a href={`tel:${message.phone}`} className="font-semibold text-text-primary hover:underline truncate block">
                    {message.phone}
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onCopy(message.phone, "phone")}
                className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors shrink-0"
                title="Copy phone"
              >
                {copiedField === "phone" ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-1 border border-[var(--color-border)] text-text-muted">
              <Phone size={16} className="shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-mono block">Phone Number</span>
                <span className="text-xs italic">Not provided</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-1 border border-[var(--color-border)]">
            <Tag size={16} className="text-[var(--color-accent-dark)] shrink-0" />
            <div>
              <span className="text-text-muted text-[10px] uppercase font-mono block">Service Requested</span>
              <span className="font-semibold text-text-primary">{message.projectType}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-1 border border-[var(--color-border)]">
            <DollarSign size={16} className="text-[var(--color-accent-dark)] shrink-0" />
            <div>
              <span className="text-text-muted text-[10px] uppercase font-mono block">Budget Range</span>
              <span className="font-semibold text-[var(--color-accent-dark)] font-mono">{message.budgetRange}</span>
            </div>
          </div>
        </div>

        {/* Client Message */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Client Project Requirements
            </label>
            <button
              type="button"
              onClick={() => onCopy(message.message, "message")}
              className="text-[11px] text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors"
            >
              {copiedField === "message" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              <span>Copy Message</span>
            </button>
          </div>
          <div className="p-4 bg-surface-2 rounded-xl border border-[var(--color-border)] text-text-primary text-xs leading-relaxed whitespace-pre-wrap font-sans">
            {message.message}
          </div>
        </div>

        {/* Internal Admin Notes Section */}
        <div className="p-4 bg-surface-1 rounded-xl border border-amber-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StickyNote size={15} className="text-amber-500" />
              <span className="text-xs font-bold text-text-primary">Internal Deal Notes &amp; Follow-ups</span>
            </div>
            <span className="text-[10px] text-text-muted">Visible only to admin team</span>
          </div>

          <textarea
            value={editingNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Log internal details: e.g. 'Intro call booked for Thursday', 'Sent technical proposal for $35k', 'Waiting on client budget sign-off'..."
            rows={3}
            className="w-full p-3 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="text-text-muted">Insert:</span>
              {[
                { label: "📞 Discovery Call", snippet: "• Discovery call scheduled" },
                { label: "📑 Proposal Sent", snippet: "• Proposal and architecture scope sent" },
                { label: "⏰ Follow-up Needed", snippet: "• Follow-up required next week" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    onNotesChange(editingNotes ? `${editingNotes}\n${item.snippet}` : item.snippet)
                  }
                  className="px-2 py-0.5 rounded bg-surface-2 border border-[var(--color-border)] text-text-secondary hover:text-text-primary"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={onSaveNotes}
              disabled={isSavingNotes}
              className="text-xs"
            >
              {isSavingNotes ? "Saving..." : "Save Notes"}
            </Button>
          </div>
        </div>

        {/* Status Selector & Delete */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-muted">Pipeline Status:</span>
            <select
              value={message.status}
              onChange={(e) => onStatusChange(message._id, e.target.value)}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg border focus:outline-none ${
                VALID_STATUSES.find((s) => s.id === message.status)?.badge ||
                "bg-surface-2 border-[var(--color-border)] text-text-primary"
              }`}
            >
              {VALID_STATUSES.map((st) => (
                <option key={st.id} value={st.id} className="bg-surface-1 text-text-primary normal-case font-normal">
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDelete(message._id)}
              className="p-2 text-xs font-semibold rounded-lg border border-red-500/20 text-red-600 hover:bg-red-500/10 transition-colors"
              title="Delete Lead"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
