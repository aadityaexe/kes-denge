"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FormTabs, FormTabItem } from "@/components/admin/FormTabs";
import { SlugInput } from "@/components/admin/SlugInput";
import { ArrayInput } from "@/components/admin/ArrayInput";
import { SeoHelperInputs } from "@/components/admin/SeoHelperInputs";
import { FormField } from "@/components/admin/FormField";
import { StatusBreakdownBar } from "@/components/admin/StatusBreakdownBar";
import { useToast } from "@/components/admin/Toast";
import { ApplicationReviewModal } from "@/components/admin/careers/ApplicationReviewModal";
import { CustomSelect } from "@/components/ui/CustomSelect";
import type { Job, JobApplication } from "@/lib/types";
import {
  Briefcase,
  Edit2,
  Trash2,
  Plus,
  ExternalLink,
  Users,
  Search,
  Layers,
  Eye,
  Check,
  Download,
  Star,
} from "lucide-react";

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "AI & Data",
  "Marketing",
  "Sales",
  "Operations",
];
const WORK_MODES = ["Remote", "Hybrid", "On-site"] as const;
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;
const EXPERIENCE_LEVELS = ["Entry Level", "Mid Level", "Senior", "Lead / Principal"] as const;
const JOB_STATUSES = ["open", "draft", "closed"] as const;
const APP_STATUSES = [
  "new",
  "reviewing",
  "shortlisted",
  "interviewing",
  "hired",
  "rejected",
] as const;

const APP_STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  reviewing: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  shortlisted: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  interviewing: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  hired: "bg-green-500/10 text-green-600 border-green-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function CareersAdminPage() {
  const [activeSection, setActiveSection] = useState<"jobs" | "applications">("jobs");

  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobStatusFilter, setJobStatusFilter] = useState("all");
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [activeFormTab, setActiveFormTab] = useState("general");
  const [jobFormLoading, setJobFormLoading] = useState(false);
  const [jobFormError, setJobFormError] = useState("");

  // Applications state
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [appStatusFilter, setAppStatusFilter] = useState("all");
  const [appJobFilter, setAppJobFilter] = useState("all");
  const [isLoadingApps, setIsLoadingApps] = useState(true);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [appStatusDraft, setAppStatusDraft] = useState("new");
  const [appNotesDraft, setAppNotesDraft] = useState("");
  const [appRatingDraft, setAppRatingDraft] = useState(0);
  const [appInterviewDateDraft, setAppInterviewDateDraft] = useState("");
  const [appInterviewLinkDraft, setAppInterviewLinkDraft] = useState("");
  const [appSaving, setAppSaving] = useState(false);
  const [deleteAppId, setDeleteAppId] = useState<string | null>(null);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [isBulkDeletingApps, setIsBulkDeletingApps] = useState(false);

  const { success, error: toastError } = useToast();

  const [jobForm, setJobForm] = useState({
    title: "",
    slug: "",
    department: "Engineering",
    location: "Remote",
    workMode: "Remote" as Job["workMode"],
    employmentType: "Full-time" as Job["employmentType"],
    experienceLevel: "Mid Level" as Job["experienceLevel"],
    salaryRange: "",
    summary: "",
    description: "",
    responsibilities: [] as string[],
    requirements: [] as string[],
    niceToHave: [] as string[],
    skills: [] as string[],
    benefits: [] as string[],
    applicationDeadline: "",
    applyUrl: "",
    status: "open" as Job["status"],
    isFeatured: false,
    order: 0,
    metaTitle: "",
    metaDescription: "",
  });

  const fetchJobs = useCallback(async () => {
    setIsLoadingJobs(true);
    try {
      const res = await fetch("/api/admin/careers");
      const data = await res.json();
      if (res.ok) setJobs(data.jobs || []);
      else toastError(data.error || "Failed to load jobs");
    } catch {
      toastError("Failed to load jobs");
    } finally {
      setIsLoadingJobs(false);
    }
  }, [toastError]);

  const fetchApplications = useCallback(async () => {
    setIsLoadingApps(true);
    try {
      const res = await fetch("/api/admin/careers/applications");
      const data = await res.json();
      if (res.ok) setApplications(data.applications || []);
      else toastError(data.error || "Failed to load applications");
    } catch {
      toastError("Failed to load applications");
    } finally {
      setIsLoadingApps(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, [fetchJobs, fetchApplications]);

  const openCreateJobModal = () => {
    setEditingJob(null);
    setActiveFormTab("general");
    setJobFormError("");
    setJobForm({
      title: "",
      slug: "",
      department: "Engineering",
      location: "Remote",
      workMode: "Remote",
      employmentType: "Full-time",
      experienceLevel: "Mid Level",
      salaryRange: "",
      summary: "",
      description: "",
      responsibilities: [],
      requirements: [],
      niceToHave: [],
      skills: ["TypeScript", "Next.js", "React"],
      benefits: ["Flexible remote work", "Learning & upskilling budget"],
      applicationDeadline: "",
      applyUrl: "",
      status: "open",
      isFeatured: false,
      order: 0,
      metaTitle: "",
      metaDescription: "",
    });
    setIsJobModalOpen(true);
  };

  const openEditJobModal = (job: Job) => {
    setEditingJob(job);
    setActiveFormTab("general");
    setJobFormError("");
    setJobForm({
      title: job.title || "",
      slug: job.slug || "",
      department: job.department || "Engineering",
      location: job.location || "Remote",
      workMode: job.workMode || "Remote",
      employmentType: job.employmentType || "Full-time",
      experienceLevel: job.experienceLevel || "Mid Level",
      salaryRange: job.salaryRange || "",
      summary: job.summary || "",
      description: job.description || "",
      responsibilities: job.responsibilities || [],
      requirements: job.requirements || [],
      niceToHave: job.niceToHave || [],
      skills: job.skills || [],
      benefits: job.benefits || [],
      applicationDeadline: job.applicationDeadline
        ? new Date(job.applicationDeadline).toISOString().split("T")[0]
        : "",
      applyUrl: job.applyUrl || "",
      status: job.status || "open",
      isFeatured: Boolean(job.isFeatured),
      order: job.order || 0,
      metaTitle: job.metaTitle || "",
      metaDescription: job.metaDescription || "",
    });
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (jobFormLoading) return;
    setJobFormError("");
    setJobFormLoading(true);

    try {
      const url = editingJob
        ? `/api/admin/careers/${editingJob._id}`
        : "/api/admin/careers";
      const method = editingJob ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...jobForm,
          applicationDeadline: jobForm.applicationDeadline || null,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setJobFormError(data.error || "Failed to save job posting");
        return;
      }

      success(editingJob ? "Job posting updated" : "Job posting published");
      setIsJobModalOpen(false);
      fetchJobs();
    } catch {
      setJobFormError("Network error while saving job posting");
    } finally {
      setJobFormLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!deleteJobId) return;
    try {
      const res = await fetch(`/api/admin/careers/${deleteJobId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(data.error || "Failed to delete job");
        return;
      }
      success("Job posting and its applications deleted");
      setDeleteJobId(null);
      fetchJobs();
      fetchApplications();
    } catch {
      toastError("Failed to delete job");
    }
  };

  const openApplicationModal = (app: JobApplication) => {
    setSelectedApp(app);
    setAppStatusDraft(app.status || "new");
    setAppNotesDraft(app.notes || "");
    setAppRatingDraft(app.rating || 0);
    setAppInterviewDateDraft(
      app.interviewDate ? new Date(app.interviewDate).toISOString().slice(0, 16) : ""
    );
    setAppInterviewLinkDraft(app.interviewLink || "");
  };

  const handleSaveApplication = async () => {
    if (!selectedApp || appSaving) return;
    setAppSaving(true);
    try {
      const res = await fetch(`/api/admin/careers/applications/${selectedApp._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: appStatusDraft,
          notes: appNotesDraft,
          rating: appRatingDraft,
          interviewDate: appInterviewDateDraft || null,
          interviewLink: appInterviewLinkDraft,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(data.error || "Failed to update application");
        return;
      }
      success("Application updated");
      if (data.application) {
        setApplications((prev) =>
          prev.map((a) => (a._id === data.application._id ? data.application : a))
        );
        setSelectedApp(data.application);
      } else {
        fetchApplications();
      }
    } catch {
      toastError("Failed to update application");
    } finally {
      setAppSaving(false);
    }
  };

  const handleExportAppsCsv = (rows: JobApplication[]) => {
    if (rows.length === 0) {
      toastError("No applications to export");
      return;
    }
    const headers = [
      "Candidate Name",
      "Email",
      "Phone",
      "Location",
      "Applied Role",
      "Current Role",
      "Experience",
      "Notice Period",
      "Status",
      "Rating",
      "Resume URL",
      "Applied Date",
    ];
    const escapeCsv = (val: unknown) => {
      const str = String(val ?? "").replace(/"/g, '""');
      return `"${str}"`;
    };
    const csvContent = [
      headers.join(","),
      ...rows.map((a) =>
        [
          escapeCsv(a.applicantName),
          escapeCsv(a.email),
          escapeCsv(a.phone),
          escapeCsv(a.location),
          escapeCsv(a.jobTitle),
          escapeCsv(a.currentRole),
          escapeCsv(a.experienceYears),
          escapeCsv(a.noticePeriod),
          escapeCsv(a.status),
          escapeCsv(a.rating || 0),
          escapeCsv(a.resumeUrl),
          escapeCsv(a.createdAt ? new Date(a.createdAt).toISOString() : ""),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `candidates-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    success(`Exported ${rows.length} candidate(s) to CSV`);
  };

  const handleBulkAppStatus = async (status: string) => {
    if (selectedAppIds.length === 0) return;
    try {
      await Promise.all(
        selectedAppIds.map((id) =>
          fetch(`/api/admin/careers/applications/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          })
        )
      );
      success(`Updated ${selectedAppIds.length} candidate(s) to ${status}`);
      setSelectedAppIds([]);
      fetchApplications();
    } catch {
      toastError("Bulk update failed");
    }
  };

  const handleBulkDeleteApps = async () => {
    if (selectedAppIds.length === 0) return;
    try {
      await Promise.all(
        selectedAppIds.map((id) =>
          fetch(`/api/admin/careers/applications/${id}`, { method: "DELETE" })
        )
      );
      success(`Deleted ${selectedAppIds.length} application(s)`);
      setSelectedAppIds([]);
      setIsBulkDeletingApps(false);
      fetchApplications();
      fetchJobs();
    } catch {
      toastError("Bulk delete failed");
    }
  };

  const handleDeleteApplication = async () => {
    if (!deleteAppId) return;
    try {
      const res = await fetch(`/api/admin/careers/applications/${deleteAppId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toastError("Failed to delete application");
        return;
      }
      success("Application deleted");
      setDeleteAppId(null);
      fetchApplications();
      fetchJobs();
    } catch {
      toastError("Failed to delete application");
    }
  };

  const filteredJobs = useMemo(() => {
    if (jobStatusFilter === "all") return jobs;
    return jobs.filter((j) => j.status === jobStatusFilter);
  }, [jobs, jobStatusFilter]);

  const filteredApps = useMemo(() => {
    return applications.filter((a) => {
      if (appStatusFilter !== "all" && a.status !== appStatusFilter) return false;
      if (appJobFilter !== "all" && String(a.jobId) !== appJobFilter) return false;
      return true;
    });
  }, [applications, appStatusFilter, appJobFilter]);

  const newAppsCount = applications.filter((a) => a.status === "new").length;

  const jobColumns: Column<Job>[] = [
    {
      header: "Role",
      accessorKey: "title",
      cell: (job) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary">{job.title}</span>
            {job.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent-dark)] text-[10px] font-medium">
                <Star size={10} /> Featured
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted">
            {job.department} • {job.location}
          </p>
        </div>
      ),
    },
    {
      header: "Mode & Type",
      accessorKey: "workMode",
      cell: (job) => (
        <div className="text-xs space-y-0.5">
          <span className="inline-block px-2 py-0.5 rounded-md bg-surface-2 border border-[var(--color-border)] font-medium text-text-primary">
            {job.workMode}
          </span>
          <p className="text-text-muted">
            {job.employmentType} • {job.experienceLevel}
          </p>
        </div>
      ),
    },
    {
      header: "Applicants",
      accessorKey: "applicantCount",
      cell: (job) => (
        <button
          type="button"
          onClick={() => {
            setAppJobFilter(String(job._id));
            setActiveSection("applications");
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 border border-[var(--color-border)] hover:border-[var(--color-accent)] text-xs font-medium text-text-primary transition-colors cursor-pointer"
        >
          <Users size={12} className="text-[var(--color-accent-dark)]" />
          {job.applicantCount || 0}
        </button>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (job) => {
        const badgeStyle =
          job.status === "open"
            ? "bg-green-500/10 text-green-600 border-green-500/20"
            : job.status === "draft"
            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
            : "bg-surface-3 text-text-muted border-[var(--color-border)]";
        return (
          <span
            className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-medium capitalize ${badgeStyle}`}
          >
            {job.status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      cell: (job) => (
        <div className="flex items-center gap-1.5">
          {job.status === "open" && (
            <a
              href={`/careers/${job.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              title="View live job posting"
              className="p-2 rounded-lg border border-[var(--color-border)] text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          )}
          <button
            type="button"
            onClick={() => openEditJobModal(job)}
            title="Edit job"
            className="p-2 rounded-lg border border-[var(--color-border)] text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteJobId(String(job._id))}
            title="Delete job"
            className="p-2 rounded-lg border border-[var(--color-border)] text-text-secondary hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const appColumns: Column<JobApplication>[] = [
    {
      header: (
        <input
          type="checkbox"
          aria-label="Select all filtered applications"
          checked={
            filteredApps.length > 0 &&
            filteredApps.every((a) => selectedAppIds.includes(String(a._id)))
          }
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedAppIds(filteredApps.map((a) => String(a._id)));
            } else {
              setSelectedAppIds([]);
            }
          }}
          className="rounded border-[var(--color-border)] cursor-pointer"
        />
      ),
      cell: (app) => {
        const id = String(app._id);
        return (
          <input
            type="checkbox"
            aria-label={`Select ${app.applicantName}`}
            checked={selectedAppIds.includes(id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedAppIds((prev) => [...prev, id]);
              } else {
                setSelectedAppIds((prev) => prev.filter((x) => x !== id));
              }
            }}
            className="rounded border-[var(--color-border)] cursor-pointer"
          />
        );
      },
    },
    {
      header: "Candidate",
      accessorKey: "applicantName",
      cell: (app) => (
        <div>
          <p className="font-semibold text-text-primary">{app.applicantName}</p>
          <p className="text-xs text-text-muted">{app.email}</p>
        </div>
      ),
    },
    {
      header: "Applied Role",
      accessorKey: "jobTitle",
      cell: (app) => (
        <div>
          <p className="text-sm font-medium text-text-primary">{app.jobTitle}</p>
          {app.currentRole && (
            <p className="text-xs text-text-muted">Current: {app.currentRole}</p>
          )}
        </div>
      ),
    },
    {
      header: "Rating",
      accessorKey: "rating",
      cell: (app) =>
        app.rating && app.rating > 0 ? (
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[var(--color-accent-dark)]">
            <Star size={12} className="fill-[var(--color-accent)] text-[var(--color-accent-dark)]" />
            {app.rating}/5
          </span>
        ) : (
          <span className="text-xs text-text-muted">—</span>
        ),
    },
    {
      header: "Experience",
      accessorKey: "experienceYears",
      cell: (app) => (
        <div className="text-xs text-text-secondary">
          <p>{app.experienceYears || "—"}</p>
          {app.noticePeriod && <p className="text-text-muted">Notice: {app.noticePeriod}</p>}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (app) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full border text-[11px] font-medium capitalize ${
            APP_STATUS_STYLES[app.status] || "bg-surface-2 text-text-secondary"
          }`}
        >
          {app.status}
        </span>
      ),
    },
    {
      header: "Applied",
      accessorKey: "createdAt",
      cell: (app) => (
        <span className="text-xs text-text-muted">
          {app.createdAt
            ? new Date(app.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (app) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => openApplicationModal(app)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs font-medium text-text-primary hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <Eye size={13} /> Review
          </button>
          <button
            type="button"
            onClick={() => setDeleteAppId(String(app._id))}
            title="Delete application"
            className="p-2 rounded-lg border border-[var(--color-border)] text-text-secondary hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const formTabs: FormTabItem[] = [
    { id: "general", label: "Role & Overview", icon: Briefcase },
    { id: "details", label: "Requirements & Stack", icon: Layers },
    { id: "seo", label: "Compensation & SEO", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-base">
      <AdminHeader
        title="Careers & Job Postings"
        description="Post open roles, manage hiring status, and review candidate applications."
        actionButton={{
          label: "Post New Job",
          onClick: openCreateJobModal,
          icon: Plus,
          variant: "gold",
        }}
        onRefresh={() => {
          fetchJobs();
          fetchApplications();
        }}
        isLoading={isLoadingJobs || isLoadingApps}
      />

      <main className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Top Section Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex p-1 rounded-xl bg-surface-2 border border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setActiveSection("jobs")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSection === "jobs"
                  ? "bg-surface-1 text-text-primary shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Briefcase size={14} />
              Job Postings ({jobs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("applications")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSection === "applications"
                  ? "bg-surface-1 text-text-primary shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Users size={14} />
              Applications ({applications.length})
              {newAppsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[var(--color-accent)] text-white text-[10px] font-bold">
                  {newAppsCount} new
                </span>
              )}
            </button>
          </div>
        </div>

        {activeSection === "jobs" ? (
          <div className="space-y-4">
            <StatusBreakdownBar
              activeFilter={jobStatusFilter}
              onFilterChange={setJobStatusFilter}
              items={[
                { id: "all", label: "All Roles", count: jobs.length },
                {
                  id: "open",
                  label: "Open",
                  count: jobs.filter((j) => j.status === "open").length,
                },
                {
                  id: "draft",
                  label: "Draft",
                  count: jobs.filter((j) => j.status === "draft").length,
                },
                {
                  id: "closed",
                  label: "Closed",
                  count: jobs.filter((j) => j.status === "closed").length,
                },
              ]}
            />

            <DataTable
              data={filteredJobs}
              columns={jobColumns}
              searchKey="title"
              isLoading={isLoadingJobs}
              searchPlaceholder="Search job titles..."
              emptyMessage="No job postings found. Click 'Post New Job' to create your first opening."
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <StatusBreakdownBar
                activeFilter={appStatusFilter}
                onFilterChange={setAppStatusFilter}
                items={[
                  { id: "all", label: "All", count: applications.length },
                  ...APP_STATUSES.map((st) => ({
                    id: st,
                    label: st.charAt(0).toUpperCase() + st.slice(1),
                    count: applications.filter((a) => a.status === st).length,
                  })),
                ]}
              />

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="w-full sm:w-64">
                  <CustomSelect
                    size="sm"
                    searchable
                    searchPlaceholder="Search job roles..."
                    ariaLabel="Filter applications by role"
                    value={appJobFilter}
                    onChange={setAppJobFilter}
                    options={[
                      { value: "all", label: "All Job Roles" },
                      ...jobs.map((job) => ({
                        value: String(job._id),
                        label: job.title,
                      })),
                    ]}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleExportAppsCsv(filteredApps)}
                  className="px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-surface-1 hover:bg-surface-2 text-xs font-semibold text-text-primary inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} className="text-[var(--color-accent-dark)]" />
                  Export CSV ({filteredApps.length})
                </button>
              </div>
            </div>

            {selectedAppIds.length > 0 && (
              <div className="sticky top-4 z-20 bg-surface-1 border border-[var(--color-accent)]/50 rounded-xl p-3 shadow-lg flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] font-bold text-xs">
                    {selectedAppIds.length} Selected
                  </span>
                  <span className="text-xs text-text-muted">Bulk Actions:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleBulkAppStatus("reviewing")}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20 hover:bg-amber-500/20 cursor-pointer"
                  >
                    Mark Reviewing
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAppStatus("shortlisted")}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-500/10 text-purple-700 border border-purple-500/20 hover:bg-purple-500/20 cursor-pointer"
                  >
                    Shortlist
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAppStatus("rejected")}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-red-500/10 text-red-700 border border-red-500/20 hover:bg-red-500/20 cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleExportAppsCsv(
                        applications.filter((a) => selectedAppIds.includes(String(a._id)))
                      )
                    }
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-surface-2 border border-[var(--color-border)] text-text-primary hover:bg-surface-3 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Download size={12} /> Export Selected
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBulkDeletingApps(true)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-red-500/10 text-red-700 border border-red-500/20 hover:bg-red-500/20 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedAppIds([])}
                    className="px-2 py-1 text-[11px] text-text-muted hover:text-text-primary hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            <DataTable
              data={filteredApps}
              columns={appColumns}
              searchKey="applicantName"
              isLoading={isLoadingApps}
              searchPlaceholder="Search candidates by name..."
              emptyMessage="No applications received yet."
            />
          </div>
        )}
      </main>

      {/* Post / Edit Job Modal */}
      <Modal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        title={editingJob ? `Edit Job: ${editingJob.title}` : "Post a New Job Opening"}
        maxWidth="4xl"
      >
        <form onSubmit={handleSaveJob} className="space-y-5">
          <FormTabs
            tabs={formTabs}
            activeTab={activeFormTab}
            onChange={setActiveFormTab}
          />

          {jobFormError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs">
              {jobFormError}
            </div>
          )}

          {activeFormTab === "general" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Job Title" required>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setJobForm((prev) => ({
                        ...prev,
                        title,
                        slug:
                          editingJob || prev.slug
                            ? prev.slug
                            : title
                                .toLowerCase()
                                .trim()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, ""),
                      }));
                    }}
                    placeholder="Senior Full-Stack Engineer"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary"
                  />
                </FormField>

                <SlugInput
                  value={jobForm.slug}
                  onChange={(val) => setJobForm((prev) => ({ ...prev, slug: val }))}
                  titleValue={jobForm.title}
                  pathPrefix="/careers/"
                  isExisting={Boolean(editingJob)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField label="Department" required>
                  <select
                    value={jobForm.department}
                    onChange={(e) =>
                      setJobForm((prev) => ({ ...prev, department: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Work Mode" required>
                  <select
                    value={jobForm.workMode}
                    onChange={(e) =>
                      setJobForm((prev) => ({
                        ...prev,
                        workMode: e.target.value as Job["workMode"],
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary"
                  >
                    {WORK_MODES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Employment Type" required>
                  <select
                    value={jobForm.employmentType}
                    onChange={(e) =>
                      setJobForm((prev) => ({
                        ...prev,
                        employmentType: e.target.value as Job["employmentType"],
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary"
                  >
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Experience Level" required>
                  <select
                    value={jobForm.experienceLevel}
                    onChange={(e) =>
                      setJobForm((prev) => ({
                        ...prev,
                        experienceLevel: e.target.value as Job["experienceLevel"],
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary"
                  >
                    {EXPERIENCE_LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Location" required>
                  <input
                    type="text"
                    required
                    value={jobForm.location}
                    onChange={(e) =>
                      setJobForm((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="Remote (India) / Bengaluru"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary"
                  />
                </FormField>

                <FormField label="Status">
                  <select
                    value={jobForm.status}
                    onChange={(e) =>
                      setJobForm((prev) => ({
                        ...prev,
                        status: e.target.value as Job["status"],
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary capitalize"
                  >
                    {JOB_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label="Short Summary (shown on job cards)" required>
                <textarea
                  required
                  rows={2}
                  value={jobForm.summary}
                  onChange={(e) =>
                    setJobForm((prev) => ({ ...prev, summary: e.target.value }))
                  }
                  placeholder="Lead architecture and delivery of Next.js & Node.js enterprise platforms..."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary"
                />
              </FormField>

              <FormField label="Full Role Description" required>
                <textarea
                  required
                  rows={5}
                  value={jobForm.description}
                  onChange={(e) =>
                    setJobForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Describe the team, mission, and what makes this role exciting..."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary"
                />
              </FormField>

              <label className="inline-flex items-center gap-2 text-xs font-medium text-text-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={jobForm.isFeatured}
                  onChange={(e) =>
                    setJobForm((prev) => ({ ...prev, isFeatured: e.target.checked }))
                  }
                  className="rounded border-[var(--color-border)]"
                />
                Feature this role at the top of the Careers page
              </label>
            </div>
          )}

          {activeFormTab === "details" && (
            <div className="space-y-5">
              <ArrayInput
                label="Skills & Tech Stack (used for search & tags)"
                value={jobForm.skills}
                onChange={(skills) => setJobForm((prev) => ({ ...prev, skills }))}
                placeholder="Type a skill (e.g. TypeScript) and press Enter"
              />
              <ArrayInput
                label="Responsibilities"
                value={jobForm.responsibilities}
                onChange={(responsibilities) =>
                  setJobForm((prev) => ({ ...prev, responsibilities }))
                }
                placeholder="Add a key responsibility and press Enter"
              />
              <ArrayInput
                label="Requirements"
                value={jobForm.requirements}
                onChange={(requirements) =>
                  setJobForm((prev) => ({ ...prev, requirements }))
                }
                placeholder="Add a requirement and press Enter"
              />
              <ArrayInput
                label="Nice to Have"
                value={jobForm.niceToHave}
                onChange={(niceToHave) =>
                  setJobForm((prev) => ({ ...prev, niceToHave }))
                }
                placeholder="Add a bonus qualification and press Enter"
              />
              <ArrayInput
                label="Perks & Benefits"
                value={jobForm.benefits}
                onChange={(benefits) => setJobForm((prev) => ({ ...prev, benefits }))}
                placeholder="Add a perk or benefit and press Enter"
              />
            </div>
          )}

          {activeFormTab === "seo" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Salary / Compensation Range (Optional)">
                  <input
                    type="text"
                    value={jobForm.salaryRange}
                    onChange={(e) =>
                      setJobForm((prev) => ({ ...prev, salaryRange: e.target.value }))
                    }
                    placeholder="₹12L – ₹18L / yr"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary"
                  />
                </FormField>

                <FormField label="Application Deadline (Optional)">
                  <input
                    type="date"
                    value={jobForm.applicationDeadline}
                    onChange={(e) =>
                      setJobForm((prev) => ({
                        ...prev,
                        applicationDeadline: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="External Apply URL (Leave empty to use built-in form)">
                  <input
                    type="url"
                    value={jobForm.applyUrl}
                    onChange={(e) =>
                      setJobForm((prev) => ({ ...prev, applyUrl: e.target.value }))
                    }
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary"
                  />
                </FormField>

                <FormField label="Display Order">
                  <input
                    type="number"
                    value={jobForm.order}
                    onChange={(e) =>
                      setJobForm((prev) => ({ ...prev, order: Number(e.target.value) || 0 }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary"
                  />
                </FormField>
              </div>

              <SeoHelperInputs
                metaTitle={jobForm.metaTitle}
                metaDescription={jobForm.metaDescription}
                onChangeMetaTitle={(metaTitle) =>
                  setJobForm((prev) => ({ ...prev, metaTitle }))
                }
                onChangeMetaDescription={(metaDescription) =>
                  setJobForm((prev) => ({ ...prev, metaDescription }))
                }
                canonicalPath={`/careers/${jobForm.slug || "role"}`}
                fallbackTitle={jobForm.title || "MARK2 Careers"}
                fallbackDescription={jobForm.summary || "Open role at MARK2"}
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setIsJobModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-medium text-text-secondary hover:text-text-primary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={jobFormLoading}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-text-primary text-surface-1 text-xs font-semibold hover:bg-[var(--color-accent-dark)] disabled:opacity-60 cursor-pointer"
            >
              <Check size={14} />
              {jobFormLoading
                ? "Saving..."
                : editingJob
                ? "Save Changes"
                : "Publish Job Posting"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Review Application Modal */}
      {(() => {
        const selectedIdx = selectedApp
          ? filteredApps.findIndex((a) => String(a._id) === String(selectedApp._id))
          : -1;
        return (
          <ApplicationReviewModal
            application={selectedApp}
            statusDraft={appStatusDraft}
            notesDraft={appNotesDraft}
            ratingDraft={appRatingDraft}
            interviewDateDraft={appInterviewDateDraft}
            interviewLinkDraft={appInterviewLinkDraft}
            saving={appSaving}
            hasPrev={selectedIdx > 0}
            hasNext={selectedIdx >= 0 && selectedIdx < filteredApps.length - 1}
            onPrev={() => {
              if (selectedIdx > 0) openApplicationModal(filteredApps[selectedIdx - 1]);
            }}
            onNext={() => {
              if (selectedIdx >= 0 && selectedIdx < filteredApps.length - 1) {
                openApplicationModal(filteredApps[selectedIdx + 1]);
              }
            }}
            onClose={() => setSelectedApp(null)}
            onStatusChange={setAppStatusDraft}
            onNotesChange={setAppNotesDraft}
            onRatingChange={setAppRatingDraft}
            onInterviewDateChange={setAppInterviewDateDraft}
            onInterviewLinkChange={setAppInterviewLinkDraft}
            onSave={handleSaveApplication}
          />
        );
      })()}

      <ConfirmDialog
        isOpen={isBulkDeletingApps}
        onClose={() => setIsBulkDeletingApps(false)}
        onConfirm={handleBulkDeleteApps}
        title="Delete Selected Applications"
        message={`Are you sure you want to permanently delete ${selectedAppIds.length} selected candidate application(s)?`}
        confirmText="Delete Selected"
      />

      <ConfirmDialog
        isOpen={Boolean(deleteJobId)}
        onClose={() => setDeleteJobId(null)}
        onConfirm={handleDeleteJob}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting? All associated applications will also be permanently removed."
        confirmText="Delete Job"
      />

      <ConfirmDialog
        isOpen={Boolean(deleteAppId)}
        onClose={() => setDeleteAppId(null)}
        onConfirm={handleDeleteApplication}
        title="Delete Application"
        message="Are you sure you want to permanently delete this candidate application?"
        confirmText="Delete Application"
      />
    </div>
  );
}
