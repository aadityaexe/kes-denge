"use client";

import { Modal } from "@/components/admin/Modal";
import { FormField } from "@/components/admin/FormField";
import { Button } from "@/components/ui/Button";

export interface NewLeadFormState {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  message: string;
  status: string;
  notes: string;
}

interface AddLeadModalProps {
  isOpen: boolean;
  newLead: NewLeadFormState;
  isSubmitting: boolean;
  onClose: () => void;
  onChange: (lead: NewLeadFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddLeadModal({
  isOpen,
  newLead,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
}: AddLeadModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Inbound Lead"
      description="Manually record leads received via phone calls, referrals, offline events, or social channels"
      maxWidth="4xl"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Client Full Name"
            required
            tooltip="Name of the prospective client or point of contact"
            charCount={{ current: newLead.name.length, max: 100 }}
          >
            <input
              type="text"
              required
              value={newLead.name}
              onChange={(e) => onChange({ ...newLead, name: e.target.value })}
              placeholder="e.g. David Sterling"
              className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            />
          </FormField>

          <FormField
            label="Email Address"
            required
            tooltip="Primary email used for proposals and communication"
          >
            <input
              type="email"
              required
              value={newLead.email}
              onChange={(e) => onChange({ ...newLead, email: e.target.value })}
              placeholder="david@company.com"
              className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="Phone Number"
            tooltip="Mobile or direct line for WhatsApp & calls"
          >
            <input
              type="tel"
              value={newLead.phone}
              onChange={(e) => onChange({ ...newLead, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            />
          </FormField>

          <FormField
            label="Service Requested"
            tooltip="Service pillar or engineering scope"
          >
            <select
              value={newLead.projectType}
              onChange={(e) => onChange({ ...newLead, projectType: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            >
              <option value="Web Development">Web Development</option>
              <option value="Mobile App Development">Mobile App Development</option>
              <option value="ERP & SaaS Systems">ERP &amp; SaaS Systems</option>
              <option value="AI & Automation">AI &amp; Automation</option>
              <option value="Cloud & DevOps Architecture">Cloud &amp; DevOps Architecture</option>
              <option value="Product Engineering & Consulting">Product Engineering &amp; Consulting</option>
              <option value="Other">Other</option>
            </select>
          </FormField>

          <FormField
            label="Estimated Budget"
            tooltip="Client indicated budget bracket"
          >
            <select
              value={newLead.budgetRange}
              onChange={(e) => onChange({ ...newLead, budgetRange: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            >
              <option value="Under $10k">Under $10k</option>
              <option value="$10k - $25k">$10k - $25k</option>
              <option value="$25k - $50k">$25k - $50k</option>
              <option value="$50k - $100k">$50k - $100k</option>
              <option value="$100k+">$100k+</option>
            </select>
          </FormField>
        </div>

        <FormField
          label="Project Scope / Client Inbound Message"
          required
          tooltip="Summary of the client's request or initial conversation"
          charCount={{ current: newLead.message.length, max: 5000 }}
        >
          <textarea
            required
            rows={4}
            value={newLead.message}
            onChange={(e) => onChange({ ...newLead, message: e.target.value })}
            placeholder="Details on the client's engineering requirements, goals, or timeline..."
            className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Initial Pipeline Status"
            tooltip="Current triage state for this lead"
          >
            <select
              value={newLead.status}
              onChange={(e) => onChange({ ...newLead, status: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
            </select>
          </FormField>

          <FormField
            label="Initial Internal Notes (Optional)"
            tooltip="Private notes for team context"
          >
            <input
              type="text"
              value={newLead.notes}
              onChange={(e) => onChange({ ...newLead, notes: e.target.value })}
              placeholder="e.g. Met at tech conference; requested demo"
              className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            />
          </FormField>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Adding Lead..." : "Add Inbound Lead"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
