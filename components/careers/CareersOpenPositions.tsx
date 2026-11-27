"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  Clock,
  MapPin,
  Search,
  X,
} from "lucide-react";
import type { Job } from "@/lib/types";
import { EXPERIENCE_LEVELS } from "./careers-data";

interface CareersOpenPositionsProps {
  totalJobs: number;
  filteredJobs: Job[];
  departments: string[];
  locations: string[];
  searchQuery: string;
  selectedDepartment: string;
  selectedLocation: string;
  selectedExperience: string;
  activeFilterCount: number;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onExperienceChange: (value: string) => void;
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
  activeFilterCount,
  onSearchChange,
  onDepartmentChange,
  onLocationChange,
  onExperienceChange,
  onClearFilters,
}: CareersOpenPositionsProps) {
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

        {/* Search & Filters */}
        <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search jobs by title or keyword..."
                aria-label="Search jobs by title or keyword"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            <div className="md:col-span-2">
              <select
                value={selectedDepartment}
                onChange={(e) => onDepartmentChange(e.target.value)}
                aria-label="Filter by department"
                className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d === "All" ? "All Departments" : d}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedLocation}
                onChange={(e) => onLocationChange(e.target.value)}
                aria-label="Filter by location"
                className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === "All" ? "All Locations" : loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={selectedExperience}
                onChange={(e) => onExperienceChange(e.target.value)}
                aria-label="Filter by experience"
                className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-[var(--color-border)] text-sm text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
              >
                {EXPERIENCE_LEVELS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp === "All" ? "All Experience" : exp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)] text-xs">
              <span className="text-text-muted">
                {activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}
              </span>
              <button
                type="button"
                onClick={onClearFilters}
                className="inline-flex items-center gap-1 font-medium text-[var(--color-accent-dark)] hover:underline cursor-pointer"
              >
                <X size={13} /> Clear all filters
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
                    <span className="px-2.5 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] text-xs font-medium">
                      {job.workMode}
                    </span>
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
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} className="text-text-muted" />
                      {job.employmentType}
                    </span>
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
