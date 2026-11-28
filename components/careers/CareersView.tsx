"use client";

import { useMemo, useState } from "react";
import type { Job } from "@/lib/types";
import type { CompanyInfo } from "./careers-data";
import { CareersHero } from "./CareersHero";
import { CareersOpenPositions } from "./CareersOpenPositions";
import { CareersCultureSections } from "./CareersCultureSections";
import { CareersTestimonials } from "./CareersTestimonials";
import { CareersFAQ } from "./CareersFAQ";

interface CareersViewProps {
  initialJobs: Job[];
  company: CompanyInfo;
}

export function CareersView({ initialJobs, company }: CareersViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("All");
  const [selectedWorkMode, setSelectedWorkMode] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const departments = useMemo(() => {
    const set = new Set<string>();
    for (const job of initialJobs) {
      if (job.department) set.add(job.department);
    }
    return ["All", ...Array.from(set).sort()];
  }, [initialJobs]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    for (const job of initialJobs) {
      if (job.location) set.add(job.location);
    }
    return ["All", ...Array.from(set).sort()];
  }, [initialJobs]);

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    (selectedDepartment !== "All" ? 1 : 0) +
    (selectedLocation !== "All" ? 1 : 0) +
    (selectedExperience !== "All" ? 1 : 0) +
    (selectedEmploymentType !== "All" ? 1 : 0) +
    (selectedWorkMode !== "All" ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("All");
    setSelectedLocation("All");
    setSelectedExperience("All");
    setSelectedEmploymentType("All");
    setSelectedWorkMode("All");
  };

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = initialJobs.filter((job) => {
      if (selectedDepartment !== "All" && job.department !== selectedDepartment) return false;
      if (selectedLocation !== "All" && job.location !== selectedLocation) return false;
      if (selectedExperience !== "All" && job.experienceLevel !== selectedExperience) return false;
      if (selectedEmploymentType !== "All" && job.employmentType !== selectedEmploymentType) return false;
      if (selectedWorkMode !== "All" && job.workMode !== selectedWorkMode) return false;
      if (q) {
        const haystack = [
          job.title,
          job.summary,
          job.department,
          job.location,
          job.employmentType,
          job.experienceLevel,
          job.workMode,
          ...(job.skills || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === "newest") {
      return [...list].sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }
    if (sortBy === "title") {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [
    initialJobs,
    searchQuery,
    selectedDepartment,
    selectedLocation,
    selectedExperience,
    selectedEmploymentType,
    selectedWorkMode,
    sortBy,
  ]);

  const scrollToPositions = () => {
    const el = document.getElementById("open-positions");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-base">
      <CareersHero
        company={company}
        totalJobs={initialJobs.length}
        departmentCount={departments.length - 1}
        onExploreClick={scrollToPositions}
      />

      <CareersOpenPositions
        totalJobs={initialJobs.length}
        filteredJobs={filteredJobs}
        departments={departments}
        locations={locations}
        searchQuery={searchQuery}
        selectedDepartment={selectedDepartment}
        selectedLocation={selectedLocation}
        selectedExperience={selectedExperience}
        selectedEmploymentType={selectedEmploymentType}
        selectedWorkMode={selectedWorkMode}
        sortBy={sortBy}
        activeFilterCount={activeFilterCount}
        onSearchChange={setSearchQuery}
        onDepartmentChange={setSelectedDepartment}
        onLocationChange={setSelectedLocation}
        onExperienceChange={setSelectedExperience}
        onEmploymentTypeChange={setSelectedEmploymentType}
        onWorkModeChange={setSelectedWorkMode}
        onSortChange={setSortBy}
        onClearFilters={clearFilters}
      />

      <CareersCultureSections company={company} />
      <CareersTestimonials />
      <CareersFAQ />
    </div>
  );
}
