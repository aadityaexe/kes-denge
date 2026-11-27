"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StatusBreakdownBar } from "@/components/admin/StatusBreakdownBar";
import { useToast } from "@/components/admin/Toast";
import { MessageDetailModal } from "@/components/admin/messages/MessageDetailModal";
import { AddLeadModal } from "@/components/admin/messages/AddLeadModal";
import { VALID_STATUSES, PROJECT_TYPES, BUDGET_RANGES } from "@/components/admin/messages/constants";
import {
  Trash2,
  Eye,
  Mail,
  Phone,
  CheckCircle2,
  Plus,
  Download,
  MessageCircle,
  StickyNote,
  Clock,
  Filter,
  Layers,
  Zap,
} from "lucide-react";

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("All Types");
  const [budgetFilter, setBudgetFilter] = useState("All Budgets");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewingMessage, setViewingMessage] = useState<any | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  // New Lead Form State
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Web Development",
    budgetRange: "$10k - $25k",
    message: "",
    status: "new",
    notes: "",
  });

  const { success, error: toastError } = useToast();

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (res.ok) setMessages(data.messages || []);
    } catch (err) {
      console.error("Error fetching messages", err);
      toastError("Failed to load inquiries");
    } finally {
      setIsLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Quick In-Row Status Update
  const handleInlineStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
        );
        if (viewingMessage && viewingMessage._id === id) {
          setViewingMessage((prev: any) => ({ ...prev, status: newStatus }));
        }
        success(`Lead status set to ${newStatus.toUpperCase()}`);
      } else {
        toastError("Failed to update status");
      }
    } catch {
      toastError("Error updating status");
    }
  };

  // Internal Notes Update
  const handleSaveNotes = async () => {
    if (!viewingMessage) return;
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/messages/${viewingMessage._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: editingNotes }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m._id === viewingMessage._id ? { ...m, notes: editingNotes } : m))
        );
        setViewingMessage((prev: any) => ({ ...prev, notes: editingNotes }));
        success("Internal notes updated successfully");
      } else {
        toastError("Failed to save notes");
      }
    } catch {
      toastError("Error saving notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    success(`Copied ${field} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const openViewModal = async (msg: any) => {
    setViewingMessage(msg);
    setEditingNotes(msg.notes || "");
    // If it was 'new', automatically mark as 'read'
    if (msg.status === "new") {
      try {
        await fetch(`/api/admin/messages/${msg._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "read" }),
        });
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, status: "read" } : m))
        );
        setViewingMessage((prev: any) => ({ ...prev, status: "read" }));
      } catch {
        // ignore
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/messages/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        if (viewingMessage?._id === deleteId) setViewingMessage(null);
        setMessages((prev) => prev.filter((m) => m._id !== deleteId));
        setSelectedIds((prev) => prev.filter((id) => id !== deleteId));
        success("Inquiry deleted successfully");
      } else {
        toastError("Failed to delete inquiry");
      }
    } catch {
      toastError("Failed to delete message");
    }
  };

  // Bulk Status Update
  const handleBulkStatus = async (status: string) => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, status }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (selectedIds.includes(m._id) ? { ...m, status } : m))
        );
        success(`Updated ${selectedIds.length} lead(s) to ${status.toUpperCase()}`);
        setSelectedIds([]);
      } else {
        toastError("Failed to bulk update status");
      }
    } catch {
      toastError("Error performing bulk update");
    }
  };

  // Bulk Deletion
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => !selectedIds.includes(m._id)));
        success(`Deleted ${selectedIds.length} lead(s)`);
        setSelectedIds([]);
        setIsBulkDeleting(false);
      } else {
        toastError("Failed to bulk delete leads");
      }
    } catch {
      toastError("Error performing bulk deletion");
    }
  };

  // Manual Lead Creation
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name.trim() || !newLead.email.trim()) {
      toastError("Please enter both client name and email address.");
      return;
    }

    setIsSubmittingLead(true);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [data.message, ...prev]);
        success("New inbound lead logged successfully!");
        setIsAddModalOpen(false);
        setNewLead({
          name: "",
          email: "",
          phone: "",
          projectType: "Web Development",
          budgetRange: "$10k - $25k",
          message: "",
          status: "new",
          notes: "",
        });
      } else {
        toastError(data.error || "Failed to create lead");
      }
    } catch {
      toastError("Error submitting new lead");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Export to CSV Functionality
  const handleExportCsv = (leadsToExport: any[]) => {
    if (leadsToExport.length === 0) {
      toastError("No leads available to export.");
      return;
    }

    const headers = [
      "ID",
      "Date",
      "Name",
      "Email",
      "Phone",
      "Service Requested",
      "Budget Range",
      "Status",
      "Client Message",
      "Internal Notes",
    ];

    const rows = leadsToExport.map((m) => [
      `"${m._id}"`,
      `"${new Date(m.createdAt).toISOString()}"`,
      `"${(m.name || "").replace(/"/g, '""')}"`,
      `"${(m.email || "").replace(/"/g, '""')}"`,
      `"${(m.phone || "").replace(/"/g, '""')}"`,
      `"${(m.projectType || "").replace(/"/g, '""')}"`,
      `"${(m.budgetRange || "").replace(/"/g, '""')}"`,
      `"${m.status}"`,
      `"${(m.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${(m.notes || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `mark-leads-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    success(`Exported ${leadsToExport.length} lead(s) to CSV!`);
  };

  // Multi-Filter Logic
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      // 1. Status Filter
      if (statusFilter !== "all" && msg.status !== statusFilter) return false;

      // 2. Project Type Filter
      if (projectFilter !== "All Types") {
        const pType = (msg.projectType || "").toLowerCase();
        const target = projectFilter.toLowerCase();
        if (!pType.includes(target) && !target.includes(pType)) return false;
      }

      // 3. Budget Filter
      if (budgetFilter !== "All Budgets") {
        const bRange = (msg.budgetRange || "").toLowerCase();
        const targetB = budgetFilter.toLowerCase();
        if (!bRange.includes(targetB) && !targetB.includes(bRange)) return false;
      }

      return true;
    });
  }, [messages, statusFilter, projectFilter, budgetFilter]);

  // Selection helpers
  const allVisibleSelected =
    filteredMessages.length > 0 &&
    filteredMessages.every((m) => selectedIds.includes(m._id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      const visibleIds = new Set(filteredMessages.map((m) => m._id));
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    } else {
      const newIds = Array.from(
        new Set([...selectedIds, ...filteredMessages.map((m) => m._id)])
      );
      setSelectedIds(newIds);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Helper for WhatsApp Clean Number
  const getWhatsAppLink = (phone: string, name: string, projectType: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Hi ${name}, this is MARK 2 following up on your ${projectType} inquiry.`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  // Metric Computations
  const totalLeads = messages.length;
  const newLeads = messages.filter((m) => m.status === "new").length;
  const activeLeads = messages.filter((m) =>
    ["contacted", "in_progress"].includes(m.status)
  ).length;
  const convertedLeads = messages.filter((m) => m.status === "completed").length;

  const columns: Column<any>[] = [
    {
      header: (
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={toggleSelectAll}
          className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer"
          title="Select all visible leads"
        />
      ),
      className: "w-10 px-4",
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row._id)}
          onChange={(e) => {
            e.stopPropagation();
            toggleSelectOne(row._id);
          }}
          className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer"
        />
      ),
    },
    {
      header: "Lead Contact",
      cell: (row) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-text-primary text-xs">{row.name}</span>
            {row.status === "new" && (
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="New unaddressed inquiry" />
            )}
          </div>
          <div className="text-[11px] text-text-muted font-mono">{row.email}</div>
          {row.phone && (
            <div className="text-[10px] text-text-secondary flex items-center gap-1 mt-0.5">
              <Phone size={10} className="text-text-muted" />
              <span>{row.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Service & Budget",
      cell: (row) => (
        <div>
          <span className="inline-block px-2 py-0.5 rounded bg-surface-3 text-[11px] font-medium text-text-primary border border-[var(--color-border)]">
            {row.projectType}
          </span>
          <div className="text-[11px] text-[var(--color-accent-dark)] font-mono font-semibold mt-1">
            {row.budgetRange}
          </div>
        </div>
      ),
    },
    {
      header: "Message Snippet",
      cell: (row) => (
        <div className="max-w-xs">
          <p className="line-clamp-2 text-xs text-text-secondary font-light">
            {row.message}
          </p>
          {row.notes && (
            <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 w-fit">
              <StickyNote size={10} />
              <span className="truncate max-w-[180px]">{row.notes}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Status Triage",
      cell: (row) => {
        return (
          <select
            value={row.status}
            onChange={(e) => {
              e.stopPropagation();
              handleInlineStatusChange(row._id, e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border cursor-pointer focus:outline-none transition-all ${
              VALID_STATUSES.find((s) => s.id === row.status)?.badge ||
              "bg-zinc-500/10 text-zinc-500"
            }`}
          >
            {VALID_STATUSES.map((st) => (
              <option key={st.id} value={st.id} className="bg-surface-1 text-text-primary normal-case font-normal">
                {st.label}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      header: "Received",
      cell: (row) => (
        <span className="text-[11px] text-text-muted font-mono whitespace-nowrap">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openViewModal(row)}
            className="p-1.5 rounded-md hover:bg-surface-3 text-text-secondary hover:text-text-primary transition-colors"
            title="View Full Lead Details"
          >
            <Eye size={14} />
          </button>

          <a
            href={`mailto:${row.email}?subject=${encodeURIComponent(`Re: ${row.projectType} Inquiry — MARK 2`)}&body=${encodeURIComponent(`Hi ${row.name},\n\nThank you for contacting MARK 2 regarding your ${row.projectType} project requirements.\n\n`)}`}
            className="p-1.5 rounded-md hover:bg-[var(--color-accent)]/10 text-text-secondary hover:text-[var(--color-accent-dark)] transition-colors"
            title="Send Email"
          >
            <Mail size={14} />
          </a>

          {row.phone && (
            <a
              href={getWhatsAppLink(row.phone, row.name, row.projectType)}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-md hover:bg-emerald-500/10 text-text-secondary hover:text-emerald-600 transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={14} />
            </a>
          )}

          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-600 transition-colors"
            title="Delete Lead"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col pb-16">
      <AdminHeader
        title="Contact Leads & Inbound Pipeline"
        description="Track, triage, and convert prospective client inquiries into production projects"
        actionButton={{
          label: "Add Inbound Lead",
          onClick: () => setIsAddModalOpen(true),
          icon: Plus,
        }}
        onRefresh={fetchMessages}
        isLoading={isLoading}
      />

      <div className="p-6 sm:p-8 max-w-7xl space-y-6">
        {/* Pipeline KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface-1 border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center justify-between text-xs text-text-muted mb-1">
              <span>Total Inbound Pipeline</span>
              <Layers size={14} className="text-text-muted" />
            </div>
            <div className="text-2xl font-bold font-display text-text-primary">{totalLeads}</div>
            <div className="text-[10px] text-text-muted mt-1">All captured inquiries</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-1 border border-rose-500/20 bg-rose-500/[0.02] shadow-sm">
            <div className="flex items-center justify-between text-xs text-rose-600 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Urgent Action
              </span>
              <Zap size={14} className="text-rose-500" />
            </div>
            <div className="text-2xl font-bold font-display text-rose-600">{newLeads}</div>
            <div className="text-[10px] text-rose-600/80 mt-1">Awaiting first response</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-1 border border-amber-500/20 bg-amber-500/[0.02] shadow-sm">
            <div className="flex items-center justify-between text-xs text-amber-600 font-semibold mb-1">
              <span>Active Discussions</span>
              <Clock size={14} className="text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-display text-amber-600">{activeLeads}</div>
            <div className="text-[10px] text-amber-600/80 mt-1">Contacted & in proposal</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-1 border border-emerald-500/20 bg-emerald-500/[0.02] shadow-sm">
            <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold mb-1">
              <span>Closed / Converted</span>
              <CheckCircle2 size={14} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-bold font-display text-emerald-600">{convertedLeads}</div>
            <div className="text-[10px] text-emerald-600/80 mt-1">Engaged as active projects</div>
          </div>
        </div>

        {/* Status Breakdown Bar */}
        <StatusBreakdownBar
          items={[
            { id: "all", label: "All Leads", count: messages.length },
            { id: "new", label: "New Leads", count: messages.filter((m) => m.status === "new").length, color: "rose" },
            { id: "contacted", label: "Contacted", count: messages.filter((m) => m.status === "contacted").length, color: "purple" },
            { id: "in_progress", label: "In Progress", count: messages.filter((m) => m.status === "in_progress").length, color: "amber" },
            { id: "completed", label: "Completed", count: messages.filter((m) => m.status === "completed").length, color: "emerald" },
            { id: "closed", label: "Closed", count: messages.filter((m) => m.status === "closed").length, color: "blue" },
            { id: "spam", label: "Spam", count: messages.filter((m) => m.status === "spam").length, color: "zinc" },
          ]}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        {/* Multi-Filter Dropdown Bar & CSV Export Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-1 p-3.5 rounded-xl border border-[var(--color-border)]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Filter size={14} />
              <span className="font-semibold">Filter By:</span>
            </div>

            {/* Project Type Filter */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)] cursor-pointer"
            >
              {PROJECT_TYPES.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>

            {/* Budget Range Filter */}
            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)] cursor-pointer"
            >
              {BUDGET_RANGES.map((br) => (
                <option key={br} value={br}>
                  {br}
                </option>
              ))}
            </select>

            {(projectFilter !== "All Types" || budgetFilter !== "All Budgets" || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setProjectFilter("All Types");
                  setBudgetFilter("All Budgets");
                }}
                className="text-[11px] text-[var(--color-accent-dark)] hover:underline font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExportCsv(filteredMessages)}
              className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-surface-2 hover:bg-surface-3 text-text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download filtered leads as CSV file"
            >
              <Download size={13} className="text-[var(--color-accent-dark)]" />
              <span>Export CSV ({filteredMessages.length})</span>
            </button>
          </div>
        </div>

        {/* Floating / Sticky Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="sticky top-4 z-20 bg-surface-1 border border-[var(--color-accent)]/50 rounded-xl p-3 shadow-xl flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] font-bold text-xs">
                {selectedIds.length} Selected
              </span>
              <span className="text-xs text-text-muted">Bulk Actions:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleBulkStatus("contacted")}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-500/10 text-purple-600 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
              >
                Mark Contacted
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus("in_progress")}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
              >
                Mark In Progress
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus("completed")}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
              >
                Mark Completed
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus("spam")}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-zinc-500/10 text-zinc-600 border border-zinc-500/20 hover:bg-zinc-500/20 transition-colors"
              >
                Mark Spam
              </button>
              <button
                type="button"
                onClick={() => {
                  const selectedLeads = messages.filter((m) => selectedIds.includes(m._id));
                  handleExportCsv(selectedLeads);
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-surface-2 border border-[var(--color-border)] text-text-primary hover:bg-surface-3 transition-colors flex items-center gap-1"
              >
                <Download size={12} />
                Export Selected
              </button>
              <button
                type="button"
                onClick={() => setIsBulkDeleting(true)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center gap-1"
              >
                <Trash2 size={12} />
                Delete
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1 rounded-lg text-[11px] text-text-muted hover:text-text-primary hover:underline ml-1"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredMessages}
          searchPlaceholder="Search leads by client name, email, or message..."
          searchKey="name"
          isLoading={isLoading}
          emptyMessage="No contact inquiries found matching the selected filters."
        />
      </div>

      {/* Message Details Modal */}
      <MessageDetailModal
        message={viewingMessage}
        editingNotes={editingNotes}
        isSavingNotes={isSavingNotes}
        copiedField={copiedField}
        onClose={() => setViewingMessage(null)}
        onNotesChange={setEditingNotes}
        onSaveNotes={handleSaveNotes}
        onStatusChange={handleInlineStatusChange}
        onDelete={setDeleteId}
        onCopy={copyToClipboard}
        getWhatsAppLink={getWhatsAppLink}
      />

      {/* Manual Inbound Lead Creation Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        newLead={newLead}
        isSubmitting={isSubmittingLead}
        onClose={() => setIsAddModalOpen(false)}
        onChange={setNewLead}
        onSubmit={handleCreateLead}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to permanently delete this contact inquiry?"
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleting}
        onClose={() => setIsBulkDeleting(false)}
        onConfirm={handleBulkDelete}
        message={`Are you sure you want to permanently delete ${selectedIds.length} selected lead(s)?`}
      />
    </div>
  );
}
