"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  Clock,
  IndianRupee,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { Job } from "@/lib/types";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { EXPERIENCE_LEVELS } from "./careers-data";

export const EMPLOYMENT_TYPE_FILTERS = [
  "All",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const;

export const WORK_MODE_FILTERS = ["All", "Remote", "Hybrid", "On-site"] as const;

export const SORT_OPTIONS = [
  { value: "featured", label: "Sort: Featured" },
  { value: "newest", label: "Sort: Newest First" },
  { value: "title", label: "Sort: Title (A–Z)" },
] as const;

interface CareersOpenPositionsProps {
  totalJobs: number;
  filteredJobs: Job[];
  departments: string[];
  locations: string[];
  searchQuery: string;
  selectedDepartment: string;
  selectedLocation: string;
  selectedExperience: string;
  selectedEmploymentType: string;
  selectedWorkMode: string;
  sortBy: string;
  activeFilterCount: number;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onExperienceChange: (value: string) => void;
  onEmploymentTypeChange: (value: string) => void;
  onWorkModeChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
}

export function CareersOpenPositions({
  totalJobs,
  filteredJobs,
  departments,
  locations,
  searchQuery,
  selectedDepartment,
  selectedLocation,
  selectedExperience,
  selectedEmploymentType,
  selectedWorkMode,
  sortBy,
  activeFilterCount,
  onSearchChange,
  onDepartmentChange,
  onLocationChange,
  onExperienceChange,
  onEmploymentTypeChange,
  onWorkModeChange,
  onSortChange,
  onClearFilters,
}: CareersOpenPositionsProps) {
  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (searchQuery.trim()) {
    activeChips.push({ label: `Search: "${searchQuery.trim()}"`, onRemove: () => onSearchChange("") });
  }
  if (selectedDepartment !== "All") {
    activeChips.push({ label: `Team: ${selectedDepartment}`, onRemove: () => onDepartmentChange("All") });
  }
  if (selectedEmploymentType !== "All") {
    activeChips.push({ label: `Type: ${selectedEmploymentType}`, onRemove: () => onEmploymentTypeChange("All") });
  }
  if (selectedWorkMode !== "All") {
    activeChips.push({ label: `Mode: ${selectedWorkMode}`, onRemove: () => onWorkModeChange("All") });
  }
  if (selectedExperience !== "All") {
    activeChips.push({ label: `Level: ${selectedExperience}`, onRemove: () => onExperienceChange("All") });
  }
  if (selectedLocation !== "All") {
    activeChips.push({ label: `Location: ${selectedLocation}`, onRemove: () => onLocationChange("All") });
  }

  return (
    <section
      id="open-positions"
      className="section-padding scroll-mt-24 border-b border-[var(--color-border)]"
    >
      <div className="container-site space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent-dark)]">
              Open Positions
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-primary tracking-tight">
              Find your next role.
            </h2>
          </div>
          <p className="text-sm text-text-secondary">
            Showing <strong className="text-text-primary">{filteredJobs.length}</strong> of{" "}
            {totalJobs} open positions
          </p>
        </div>

        {/* Search & Important Filters */}
        <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by job title, skill (Java, React, AI), or keyword..."
                aria-label="Search jobs by title, skill, or keyword"
                className="w-full pl-10 pr-9 py-2.5 min-h-[40px] rounded-xl bg-surface-2/60 border border-[var(--color-border)] text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-accent)] focus:bg-surface-1 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="md:col-span-3">
              <CustomSelect
                size="sm"
                searchable
                searchPlaceholder="Search teams..."
                ariaLabel="Filter by department"
                value={selectedDepartment}
                onChange={onDepartmentChange}
                options={departments.map((d) => ({
                  value: d,
                  label: d === "All" ? "All Departments" : d,
                }))}
              />
            </div>

            <div className="md:col-span-3">
              <CustomSelect
                size="sm"
                ariaLabel="Sort jobs"
                value={sortBy}
                onChange={onSortChange}
                options={SORT_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
              />
            </div>
          </div>

          {/* Secondary Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <CustomSelect
              size="sm"
              searchable
              searchPlaceholder="Search job type..."
              ariaLabel="Filter by employment type"
              value={selectedEmploymentType}
              onChange={onEmploymentTypeChange}
              options={EMPLOYMENT_TYPE_FILTERS.map((t) => ({
                value: t,
                label: t === "All" ? "All Job Types" : t,
              }))}
            />

            <CustomSelect
              size="sm"
              ariaLabel="Filter by experience level"
              value={selectedExperience}
              onChange={onExperienceChange}
              options={EXPERIENCE_LEVELS.map((exp) => ({
                value: exp,
                label: exp === "All" ? "All Experience Levels" : exp,
              }))}
            />

            <CustomSelect
              size="sm"
              ariaLabel="Filter by work mode"
              value={selectedWorkMode}
              onChange={onWorkModeChange}
              options={WORK_MODE_FILTERS.map((m) => ({
                value: m,
                label: m === "All" ? "All Work Modes" : m,
              }))}
            />

            <CustomSelect
              size="sm"
              searchable
              searchPlaceholder="Search locations..."
              ariaLabel="Filter by location"
              value={selectedLocation}
              onChange={onLocationChange}
              options={locations.map((loc) => ({
                value: loc,
                label: loc === "All" ? "All Locations" : loc,
              }))}
            />
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--color-border)] text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-text-muted mr-1">
                  <SlidersHorizontal size={12} /> Active:
                </span>
                {activeChips.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-2 border border-[var(--color-border)] text-text-primary hover:border-[var(--color-accent)] transition-colors cursor-pointer"
                  >
                    <span>{chip.label}</span>
                    <X size={11} className="text-text-muted" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex items-center gap-1 font-medium text-[var(--color-accent-dark)] hover:underline cursor-pointer shrink-0"
              >
                <X size={13} /> Clear all ({activeFilterCount})
              </button>
            </div>
          )}
        </div>

        {/* Job Cards or Empty State */}
        {totalJobs === 0 ? (
          <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-10 text-center max-w-2xl mx-auto space-y-3">
            <Briefcase size={28} className="mx-auto text-[var(--color-accent-dark)]" />
            <h3 className="text-xl font-display font-semibold text-text-primary">
              No open positions right now
            </h3>
            <p className="text-sm text-text-secondary">
              We don&apos;t have active openings at the moment, but we&apos;re always glad to connect with talented builders.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-text-primary text-surface-1 text-sm font-medium hover:bg-[var(--color-accent-dark)] transition-colors"
            >
              Send General Application <ArrowUpRight size={15} />
            </Link>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-10 text-center space-y-3">
            <Search size={26} className="mx-auto text-text-muted" />
            <h3 className="text-lg font-display font-semibold text-text-primary">
              No jobs match your search or filters
            </h3>
            <p className="text-sm text-text-secondary">
              Try broadening your keywords or clearing one of your active filters.
            </p>
            <button
              type="button"
              onClick={onClearFilters}
              className="px-5 py-2.5 rounded-full bg-text-primary text-surface-1 text-sm font-medium hover:bg-[var(--color-accent-dark)] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {filteredJobs.map((job) => (
              <motion.div
                key={job._id || job.slug}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col justify-between bg-surface-1 border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 hover:border-[var(--color-accent)]/50 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-2 border border-[var(--color-border)] text-xs font-medium text-text-primary">
                      <Building2 size={11} className="text-[var(--color-accent-dark)]" />
                      {job.department}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-surface-2 border border-[var(--color-border)] text-xs font-medium text-text-secondary">
                        {job.employmentType}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] text-xs font-medium">
                        {job.workMode}
                      </span>
                    </div>
                  </div>

                  <Link href={`/careers/${job.slug}`} className="block group">
                    <h3 className="text-xl font-display font-semibold text-text-primary group-hover:text-[var(--color-accent-dark)] transition-colors mb-2">
                      {job.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary mb-4">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} className="text-text-muted" />
                      {job.location}
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
                    {!job.salaryRange && (
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} className="text-text-muted" />
                        {job.employmentType}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed mb-5">
                    {job.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={`/careers/${job.slug}`}
                    className="text-xs font-medium text-text-secondary hover:text-text-primary underline-offset-4 hover:underline"
                  >
                    View Job Details
                  </Link>

                  <Link
                    href={`/careers/${job.slug}#apply-form`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-text-primary text-surface-1 text-xs font-medium hover:bg-[var(--color-accent-dark)] transition-colors"
                  >
                    Apply Now <ArrowUpRight size={13} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
