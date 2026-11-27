"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Star,
  ArrowUpRight,
  SlidersHorizontal,
  X,
  Building2,
  IndianRupee,
} from "lucide-react";
import type { Job } from "@/lib/types";

interface CareersBoardProps {
  initialJobs: Job[];
}

const WORK_MODES = ["All", "Remote", "Hybrid", "On-site"] as const;
const EMPLOYMENT_TYPES = ["All", "Full-time", "Part-time", "Contract", "Internship"] as const;
const EXPERIENCE_LEVELS = [
  "All",
  "Entry Level",
  "Mid Level",
  "Senior",
  "Lead / Principal",
] as const;

export function CareersBoard({ initialJobs }: CareersBoardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>("All");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>("All");
  const [selectedExperience, setSelectedExperience] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"featured" | "newest">("featured");

  const departments = useMemo(() => {
    const set = new Set<string>();
    for (const job of initialJobs) {
      if (job.department) set.add(job.department);
    }
    return ["All", ...Array.from(set).sort()];
  }, [initialJobs]);

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    (selectedDepartment !== "All" ? 1 : 0) +
    (selectedWorkMode !== "All" ? 1 : 0) +
    (selectedEmploymentType !== "All" ? 1 : 0) +
    (selectedExperience !== "All" ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("All");
    setSelectedWorkMode("All");
    setSelectedEmploymentType("All");
    setSelectedExperience("All");
  };

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = initialJobs.filter((job) => {
      if (selectedDepartment !== "All" && job.department !== selectedDepartment) {
        return false;
      }
      if (selectedWorkMode !== "All" && job.workMode !== selectedWorkMode) {
        return false;
      }
      if (selectedEmploymentType !== "All" && job.employmentType !== selectedEmploymentType) {
        return false;
      }
      if (selectedExperience !== "All" && job.experienceLevel !== selectedExperience) {
        return false;
      }
      if (q) {
        const haystack = [
          job.title,
          job.summary,
          job.department,
          job.location,
          job.workMode,
          job.employmentType,
          job.experienceLevel,
          ...(job.skills || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "featured") {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      }
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [
    initialJobs,
    searchQuery,
    selectedDepartment,
    selectedWorkMode,
    selectedEmploymentType,
    selectedExperience,
    sortBy,
  ]);

  if (initialJobs.length === 0) {
    return (
      <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-10 sm:p-14 text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-4 text-[var(--color-accent-dark)]">
          <Briefcase size={22} />
        </div>
        <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
          No open positions right now
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          We&apos;re not actively hiring for a specific role at the moment, but we&apos;re always excited to meet exceptional engineers, designers, and builders.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-text-primary text-surface-1 text-sm font-medium hover:bg-[var(--color-accent-dark)] transition-colors"
        >
          Send a General Application <ArrowUpRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search & Filter Panel */}
      <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        {/* Top Row: Search + Sort */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, skill (e.g. Next.js, TypeScript, UI/UX), or location..."
              aria-label="Search open positions"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "featured" | "newest")}
              aria-label="Sort jobs"
              className="px-3.5 py-3 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            >
              <option value="featured">Featured & Newest</option>
              <option value="newest">Newest First</option>
            </select>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-xl border border-[var(--color-border)] bg-surface-2 hover:bg-surface-3 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
              >
                <X size={14} /> Clear ({activeFilterCount})
              </button>
            )}
          </div>
        </div>

        {/* Department Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-text-muted mr-1 flex items-center gap-1">
            <SlidersHorizontal size={12} /> Department:
          </span>
          {departments.map((dept) => {
            const active = selectedDepartment === dept;
            return (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active
                    ? "bg-text-primary text-surface-1 shadow-xs"
                    : "bg-surface-2 text-text-secondary border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:text-text-primary"
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>

        {/* Secondary Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-[var(--color-border)]">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
              Work Mode
            </label>
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            >
              {WORK_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode === "All" ? "All Work Modes" : mode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
              Employment Type
            </label>
            <select
              value={selectedEmploymentType}
              onChange={(e) => setSelectedEmploymentType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            >
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Types" : type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
              Experience Level
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level === "All" ? "All Levels" : level}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-text-secondary px-1">
        <span>
          Showing <strong className="text-text-primary">{filteredJobs.length}</strong>{" "}
          {filteredJobs.length === 1 ? "open role" : "open roles"}
          {activeFilterCount > 0 ? " matching your filters" : ""}
        </span>
      </div>

      {/* Job Listings */}
      {filteredJobs.length === 0 ? (
        <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-10 text-center">
          <p className="text-text-primary font-medium mb-1">
            No matching positions found
          </p>
          <p className="text-text-secondary text-sm mb-5">
            Try adjusting your search keywords or clearing one of the active filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-full bg-text-primary text-surface-1 text-sm font-medium hover:bg-[var(--color-accent-dark)] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredJobs.map((job) => (
            <Link
              key={job._id || job.slug}
              href={`/careers/${job.slug}`}
              className="group flex flex-col justify-between bg-surface-1 border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 hover:border-[var(--color-accent)]/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-2 border border-[var(--color-border)] text-xs font-medium text-text-primary">
                      <Building2 size={11} className="text-[var(--color-accent-dark)]" />
                      {job.department}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] text-xs font-medium">
                      {job.workMode}
                    </span>
                  </div>

                  {job.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-text-primary text-surface-1 text-[11px] font-medium">
                      <Star size={11} /> Featured
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-xl font-display font-semibold text-text-primary group-hover:text-[var(--color-accent-dark)] transition-colors mb-2">
                  {job.title}
                </h2>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary mb-4">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} className="text-text-muted" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} className="text-text-muted" />
                    {job.employmentType}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase size={12} className="text-text-muted" />
                    {job.experienceLevel}
                  </span>
                  {job.salaryRange && (
                    <span className="inline-flex items-center gap-1 text-text-primary font-medium">
                      <IndianRupee size={12} className="text-[var(--color-accent-dark)]" />
                      {job.salaryRange}
                    </span>
                  )}
                </div>

                {/* Summary */}
                <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-5">
                  {job.summary}
                </p>

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {job.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-md bg-surface-2 border border-[var(--color-border)] text-[11px] text-text-secondary font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="px-2 py-0.5 text-[11px] text-text-muted">
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-medium">
                <span className="text-text-muted">
                  {job.createdAt
                    ? `Posted ${new Date(job.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}`
                    : "Open Position"}
                </span>
                <span className="inline-flex items-center gap-1 text-text-primary group-hover:text-[var(--color-accent-dark)] transition-colors">
                  View Role & Apply
                  <ArrowUpRight
                    size={14}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
