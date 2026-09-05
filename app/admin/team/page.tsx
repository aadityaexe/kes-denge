"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FormTabs, FormTabItem } from "@/components/admin/FormTabs";
import { SlugInput } from "@/components/admin/SlugInput";
import { ArrayInput } from "@/components/admin/ArrayInput";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";
import { FormField } from "@/components/admin/FormField";
import { StatusBreakdownBar } from "@/components/admin/StatusBreakdownBar";
import { useToast } from "@/components/admin/Toast";
import {
  Edit2,
  Trash2,
  Plus,
  User,
  ExternalLink,
  Layers,
  FileText,
  Share2,
  Check,
} from "lucide-react";

export default function TeamAdminPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    role: "",
    specialization: "",
    photo: "",
    bio: "",
    techTags: [] as string[],
    linkedin: "",
    github: "",
    twitter: "",
    yearsExperience: 5,
    joinedDate: "2024-01",
    isActive: true,
    order: 0,
  });

  const fetchTeam = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (res.ok) setTeam(data.team || []);
    } catch (err) {
      console.error("Error fetching team", err);
      toastError("Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openCreateModal = () => {
    setEditingMember(null);
    setActiveTab("profile");
    setFormData({
      name: "",
      slug: "",
      role: "",
      specialization: "",
      photo: "",
      bio: "",
      techTags: ["React", "Next.js", "Node.js", "TypeScript"],
      linkedin: "",
      github: "",
      twitter: "",
      yearsExperience: 5,
      joinedDate: new Date().toISOString().slice(0, 7),
      isActive: true,
      order: team.length + 1,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (member: any) => {
    setEditingMember(member);
    setActiveTab("profile");
    setFormData({
      name: member.name || "",
      slug: member.slug || "",
      role: member.role || "",
      specialization: member.specialization || member.role || "",
      photo: member.photo || "",
      bio: member.bio || "",
      techTags: Array.isArray(member.techTags) ? member.techTags : [],
      linkedin: member.socialLinks?.linkedin || "",
      github: member.socialLinks?.github || "",
      twitter: member.socialLinks?.twitter || "",
      yearsExperience: member.yearsExperience || 3,
      joinedDate: member.joinedDate || "2024-01",
      isActive: member.isActive ?? true,
      order: member.order || 0,
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

  const handleToggleActive = async (member: any) => {
    const newStatus = !member.isActive;
    try {
      const res = await fetch(`/api/admin/team/${member._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (res.ok) {
        setTeam((prev) =>
          prev.map((m) => (m._id === member._id ? { ...m, isActive: newStatus } : m))
        );
        success(`Member marked as ${newStatus ? "Active" : "Disabled"}`);
      } else {
        toastError("Failed to update status");
      }
    } catch (err) {
      toastError("Error updating team member status");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    const payload = {
      name: formData.name,
      slug: formData.slug,
      role: formData.role,
      specialization: formData.specialization,
      photo: formData.photo,
      bio: formData.bio,
      techTags: formData.techTags,
      socialLinks: {
        linkedin: formData.linkedin,
        github: formData.github,
        twitter: formData.twitter,
      },
      yearsExperience: Number(formData.yearsExperience),
      joinedDate: formData.joinedDate,
      isActive: formData.isActive,
      order: Number(formData.order),
    };

    try {
      const url = editingMember
        ? `/api/admin/team/${editingMember._id}`
        : `/api/admin/team`;
      const method = editingMember ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save team member");
      }

      setIsModalOpen(false);
      fetchTeam();
      success(editingMember ? "Team member updated!" : "Team member added!");
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
      const res = await fetch(`/api/admin/team/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        fetchTeam();
        success("Team member deleted successfully");
      } else {
        toastError("Failed to delete member");
      }
    } catch (err) {
      toastError("Error deleting team member");
    }
  };

  const tabs: FormTabItem[] = [
    { id: "profile", label: "Profile & Role", icon: User },
    { id: "skills", label: "Bio & Skills", icon: FileText, badge: formData.techTags.length },
    { id: "experience", label: "Social & Experience", icon: Share2 },
  ];

  const filteredTeam = team.filter((m) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return Boolean(m.isActive);
    if (statusFilter === "disabled") return !m.isActive;
    return true;
  });

  const columns: Column<any>[] = [
    {
      header: "Member",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.photo ? (
            <img src={row.photo} alt={row.name} className="w-9 h-9 rounded-full object-cover border border-[var(--color-border)]" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] flex items-center justify-center font-bold text-xs">
              {row.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-semibold text-text-primary text-xs">{row.name}</div>
            <div className="text-[11px] text-text-muted">{row.role}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Specialization",
      cell: (row) => (
        <span className="text-xs text-text-secondary font-light">
          {row.specialization || row.role}
        </span>
      ),
    },
    {
      header: "Experience",
      cell: (row) => (
        <span className="font-mono text-xs text-text-muted">
          {row.yearsExperience || 0} yrs
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <button
          type="button"
          onClick={() => handleToggleActive(row)}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
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
            href={`/team/${row.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-surface-3 text-text-muted hover:text-text-primary transition-colors"
            title="View Profile"
          >
            <ExternalLink size={14} />
          </a>
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 rounded-md hover:bg-surface-3 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title="Edit Member"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteId(row._id)}
            className="p-1.5 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-600 transition-colors cursor-pointer"
            title="Delete Member"
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
        title="Engineering Pod & Team"
        description="Add, edit, and organize senior architects, software engineers, and leadership profiles"
        actionButton={{
          label: "Add Member",
          onClick: openCreateModal,
          icon: Plus,
        }}
        onRefresh={fetchTeam}
        isLoading={isLoading}
      />

      <div className="p-6 sm:p-8 max-w-7xl space-y-4">
        <StatusBreakdownBar
          items={[
            { id: "all", label: "All Members", count: team.length },
            { id: "active", label: "Active", count: team.filter((m) => m.isActive).length, color: "emerald" },
            { id: "disabled", label: "Disabled / Hidden", count: team.filter((m) => !m.isActive).length, color: "zinc" },
          ]}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        <DataTable
          columns={columns}
          data={filteredTeam}
          searchPlaceholder="Search team members by name or role..."
          searchKey="name"
          isLoading={isLoading}
          emptyMessage="No team members found for this status. Click 'Add Member' to showcase your talent."
        />
      </div>

      {/* Modal with Pinned Footer and Tabs */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? `Edit Member: ${editingMember.name}` : "Add Team Member"}
        description="Configure engineering profile, technical specializations, skills, and public visibility."
        maxWidth="3xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <div>
              {editingMember && formData.slug && (
                <a
                  href={`/team/${formData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--color-accent-dark)] hover:underline font-medium"
                >
                  <ExternalLink size={13} />
                  <span>View Profile</span>
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
                    <span>{editingMember ? "Update Member" : "Save Member"}</span>
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

          {/* TAB 1: PROFILE & ROLE */}
          {activeTab === "profile" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Full Name"
                  required
                  tooltip="Member's display name shown on team roster cards and in author attribution."
                  charCount={{ current: formData.name.length, optimal: { min: 4, max: 40 }, max: 60 }}
                >
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Alex Henderson"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <div>
                  <SlugInput
                    value={formData.slug}
                    onChange={(slug) => setFormData({ ...formData, slug })}
                    titleValue={formData.name}
                    pathPrefix="/team/"
                    isExisting={Boolean(editingMember)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Official Role"
                  required
                  tooltip="Primary engineering or leadership title (e.g. Principal System Architect, Head of AI)."
                >
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Lead Distributed Architect"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <FormField
                  label="Technical Specialization"
                  tooltip="Core domain expertise badge (e.g. High-Throughput Distributed Cloud, Cryptography, Mobile)."
                >
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g. High-Throughput Distributed Cloud"
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>
              </div>

              <ImageUploadInput
                label="Profile Photo"
                value={formData.photo}
                onChange={(photo) => setFormData({ ...formData, photo })}
                helperText="Square headshot or avatar image."
                recommendedDimension="500x500px (1:1 Square)"
              />
            </div>
          )}

          {/* TAB 2: BIO & SKILLS */}
          {activeTab === "skills" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <FormField
                label="Professional Bio"
                required
                tooltip="Short biographical summary detailing engineering pedigree and systems shipped."
                charCount={{ current: formData.bio.length, optimal: { min: 100, max: 300 }, max: 500 }}
              >
                <textarea
                  required
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Summarize engineering background, delivered projects, and architectural leadership."
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)] leading-relaxed"
                />
              </FormField>

              <ArrayInput
                label="Core Technologies & Frameworks"
                items={formData.techTags}
                onChange={(techTags) => setFormData({ ...formData, techTags })}
                placeholder="Add skill (e.g. Kubernetes, Go) and press Enter..."
                helperText="Displayed as skill tags on the team page and member profile."
              />
            </div>
          )}

          {/* TAB 3: SOCIAL & EXPERIENCE */}
          {activeTab === "experience" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Years of Experience"
                  tooltip="Numeric experience metric displayed as an expertise credential (e.g. 8+ yrs)."
                >
                  <input
                    type="number"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <FormField
                  label="Sort Order"
                  tooltip="Roster sorting rank: lower numbers appear first on the /team and /about pages."
                >
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Social & Professional Profiles
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="LinkedIn URL"
                      className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      placeholder="GitHub URL"
                      className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      placeholder="Twitter / X URL"
                      className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[var(--color-accent)] accent-[var(--color-accent)]"
                  />
                  <span>Active & Visible on Team Roster</span>
                </label>
              </div>
            </div>
          )}
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Team Member"
        description="Are you sure you want to remove this profile from the team roster?"
        confirmText="Delete Member"
      />
    </div>
  );
}
