"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  Search,
  ArrowUpRight,
  Building2,
  ExternalLink,
  Check,
  MapPin,
  Award,
} from "lucide-react";
import type { Client } from "@/lib/types";

interface ClientsDirectoryProps {
  clients: Client[];
}

function ClientSpotlightCard({ client }: { client: Client }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const initialLetters = client.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isOngoing =
    !client.partnershipYear ||
    client.partnershipYear.toLowerCase().includes("present");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col justify-between rounded-[28px] border border-[var(--color-border)] bg-surface-1/95 p-6 sm:p-7 md:p-8 backdrop-blur-xl transition-all duration-300 hover:border-[var(--color-accent)]/50 hover:shadow-2xl hover:shadow-[var(--color-accent)]/10 hover:-translate-y-1.5 h-full overflow-hidden"
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Radial Hover Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[28px] opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              450px circle at ${mouseX}px ${mouseY}px,
              rgba(201, 169, 110, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-20 flex flex-col flex-1">
        {/* Tier 1: Logo / Monogram + Engagement Badge */}
        <div className="flex items-center justify-between gap-3 mb-5">
          {/* Logo container */}
          <div className="relative w-14 h-14 rounded-2xl bg-surface-2 border border-[var(--color-border)] p-2 flex items-center justify-center font-display font-bold text-lg text-text-primary group-hover:border-[var(--color-accent)]/40 group-hover:shadow-md transition-all duration-300 shadow-xs overflow-hidden shrink-0">
            {client.logoUrl ? (
              <Image
                src={client.logoUrl}
                alt={client.name}
                fill
                sizes="56px"
                className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 text-[var(--color-accent-light)] flex items-center justify-center font-mono font-bold text-sm tracking-wider border border-white/10 shadow-inner">
                {initialLetters}
              </div>
            )}
          </div>

          {/* Partnership Year & Active Status Indicator */}
          {client.partnershipYear && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono font-medium text-text-secondary bg-surface-2/80 border border-[var(--color-border)] shadow-2xs shrink-0">
              {isOngoing && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              )}
              <span>{client.partnershipYear}</span>
            </div>
          )}
        </div>

        {/* Tier 2: Title & Identity Row */}
        <div>
          <Link
            href={`/clients/${client.slug}`}
            className="group/title block"
          >
            <h3 className="text-xl sm:text-[22px] font-display font-bold text-text-primary group-hover/title:text-[var(--color-accent-dark)] transition-colors tracking-tight leading-snug break-words">
              {client.name}
            </h3>
          </Link>

          {/* Clean metadata pills */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] border border-[var(--color-accent)]/20 whitespace-nowrap shadow-2xs">
              {client.industry}
            </span>
            {client.location && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-text-muted bg-surface-2/70 border border-[var(--color-border)]/60 font-medium whitespace-nowrap">
                <MapPin size={12} className="text-[var(--color-accent-dark)]/80 shrink-0" />
                <span>{client.location}</span>
              </span>
            )}
          </div>
        </div>

        {/* Value Proposition Tagline */}
        {client.tagline && (
          <p className="text-sm sm:text-[15px] font-semibold text-text-primary leading-snug line-clamp-2 mt-4 mb-2 tracking-tight break-words">
            {client.tagline}
          </p>
        )}

        {/* Narrative / Context */}
        {(client.aboutPartnership || client.description) && (
          <p className="text-xs sm:text-[13px] text-text-secondary leading-relaxed line-clamp-3 mb-5 break-words">
            {client.aboutPartnership || client.description}
          </p>
        )}

        {/* Engineered Scope & Deliverables Box */}
        {client.keyAchievements && client.keyAchievements.length > 0 && (
          <div className="rounded-2xl bg-surface-2/60 border border-[var(--color-border)]/70 p-3.5 sm:p-4 mb-5 space-y-2.5 backdrop-blur-xs transition-colors group-hover:border-[var(--color-accent)]/20">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-text-muted font-bold">
              <span className="flex items-center gap-1.5">
                <Award size={11} className="text-[var(--color-accent-dark)]" />
                Key Deliverables
              </span>
              <span className="text-[var(--color-accent-dark)] font-medium">Production Scope</span>
            </div>
            <div className="space-y-2">
              {client.keyAchievements.slice(0, 2).map((achievement, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary">
                  <div className="w-4 h-4 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent-dark)] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span className="font-medium text-text-primary line-clamp-1 leading-snug">
                    {achievement}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Capabilities & Tech Stack Tags */}
        {client.servicesProvided && client.servicesProvided.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto mb-5 pt-1">
            {client.servicesProvided.slice(0, 3).map((service) => (
              <span
                key={service}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface-2/90 text-text-secondary border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 hover:text-text-primary transition-colors"
              >
                {service}
              </span>
            ))}
            {client.servicesProvided.length > 3 && (
              <span className="px-2 py-1 rounded-lg text-[11px] font-mono font-medium text-text-muted bg-surface-2 border border-[var(--color-border)]">
                +{client.servicesProvided.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Action Links */}
      <div className="relative z-20 pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-3 mt-auto">
        <Link
          href={`/clients/${client.slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-primary hover:text-[var(--color-accent-dark)] transition-colors group/link"
        >
          <span>View Partnership Profile</span>
          <ArrowUpRight
            size={15}
            className="transition-transform duration-200 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 text-[var(--color-accent-dark)]"
          />
        </Link>

        {client.website && (
          <a
            href={client.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-text-muted hover:text-text-primary hover:bg-surface-2 border border-transparent hover:border-[var(--color-border)] transition-all shrink-0"
            title={`Visit ${client.name} website`}
            aria-label={`Visit ${client.name} website`}
          >
            <span>Live Site</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export function ClientsDirectory({ clients = [] }: ClientsDirectoryProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique industries
  const industries = useMemo(() => {
    const list = new Set<string>();
    clients.forEach((c) => {
      if (c.industry) list.add(c.industry.trim());
    });
    return ["All", ...Array.from(list)];
  }, [clients]);

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesIndustry =
        selectedIndustry === "All" || client.industry === selectedIndustry;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        client.name.toLowerCase().includes(q) ||
        (client.industry && client.industry.toLowerCase().includes(q)) ||
        (client.tagline && client.tagline.toLowerCase().includes(q)) ||
        (client.servicesProvided &&
          client.servicesProvided.some((s) => s.toLowerCase().includes(q))) ||
        (client.technologies &&
          client.technologies.some((t) => t.toLowerCase().includes(q)));

      return matchesIndustry && matchesSearch;
    });
  }, [clients, selectedIndustry, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-surface-1 border border-[var(--color-border)] shadow-sm">
        {/* Industry Pill Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none max-w-full">
          {industries.map((ind) => {
            const isSelected = selectedIndustry === ind;
            return (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`
                  px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer min-h-[36px]
                  ${
                    isSelected
                      ? "bg-text-primary text-surface-1 shadow-sm"
                      : "bg-surface-2 text-text-secondary hover:text-text-primary hover:bg-surface-2/80 border border-[var(--color-border)]"
                  }
                `}
              >
                {ind}
              </button>
            );
          })}
        </div>

        {/* Real-time Search Input */}
        <div className="relative w-full md:w-72 min-w-0">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients, tech, tags..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-surface-2 border border-[var(--color-border)] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-accent)] transition-colors min-h-[38px]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-text-muted hover:text-text-primary"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Clients Count Indicator */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-text-muted">
          Showing <span className="font-semibold text-text-primary">{filteredClients.length}</span>{" "}
          {filteredClients.length === 1 ? "verified partner" : "verified partners"}
          {selectedIndustry !== "All" && ` in ${selectedIndustry}`}
        </p>
      </div>

      {/* Grid of Clients */}
      {filteredClients.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {filteredClients.map((client) => (
            <ClientSpotlightCard key={client.id || client.slug} client={client} />
          ))}
        </motion.div>
      ) : (
        <div className="py-20 text-center rounded-2xl bg-surface-1 border border-[var(--color-border)] p-8">
          <Building2 size={40} className="mx-auto text-text-muted mb-4 opacity-40" />
          <h4 className="text-lg font-display font-semibold text-text-primary mb-2">
            No matching client partners found
          </h4>
          <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
            We couldn't find any partners matching "{searchQuery}". Try resetting your filter or search query.
          </p>
          <button
            onClick={() => {
              setSelectedIndustry("All");
              setSearchQuery("");
            }}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-text-primary text-surface-1 hover:opacity-90 transition-opacity"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
