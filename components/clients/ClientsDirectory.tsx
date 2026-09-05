"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  Search,
  ArrowUpRight,
  Building2,
  ExternalLink,
  CheckCircle2,
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col justify-between rounded-[24px] border border-[var(--color-border)] bg-surface-1/90 p-4 sm:p-6 md:p-8 backdrop-blur-md transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:shadow-xl hover:shadow-[var(--color-accent)]/5"
    >
      {/* Radial Hover Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(201, 169, 110, 0.12),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-20 flex flex-col flex-1">
        {/* Top bar: Monogram / Logo + Industry & Year */}
        <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-3 sm:gap-4 mb-6">
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-surface-2 border border-[var(--color-border)] flex items-center justify-center font-display font-bold text-base sm:text-lg text-text-primary group-hover:border-[var(--color-accent)]/50 group-hover:text-[var(--color-accent-dark)] transition-colors shadow-sm overflow-hidden p-1 shrink-0">
              {client.logoUrl ? (
                <img
                  src={client.logoUrl}
                  alt={client.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span>{initialLetters}</span>
              )}
            </div>
            <div className="min-w-0">
              <Link
                href={`/clients/${client.slug}`}
                className="group/title inline-flex items-center gap-1.5 max-w-full"
              >
                <h3 className="text-lg sm:text-xl font-display font-bold text-text-primary group-hover/title:text-[var(--color-accent-dark)] transition-colors break-words">
                  {client.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] border border-[var(--color-accent)]/20">
                  {client.industry}
                </span>
                {client.location && (
                  <span className="text-[11px] sm:text-[12px] text-text-muted hidden sm:inline">
                    • {client.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {client.partnershipYear && (
            <span className="text-xs font-mono text-text-muted px-2.5 py-1 rounded-md bg-surface-2/80 border border-[var(--color-border)] whitespace-nowrap shrink-0">
              {client.partnershipYear}
            </span>
          )}
        </div>

        {/* Tagline / Value Proposition */}
        {client.tagline && (
          <p className="text-text-primary font-medium text-sm md:text-[15px] leading-snug mb-3 break-words">
            {client.tagline}
          </p>
        )}

        {/* Brief Narrative */}
        {(client.aboutPartnership || client.description) && (
          <p className="text-text-secondary text-xs md:text-sm line-clamp-3 leading-relaxed mb-6 break-words">
            {client.aboutPartnership || client.description}
          </p>
        )}

        {/* Key Achievements Bullet Highlights */}
        {client.keyAchievements && client.keyAchievements.length > 0 && (
          <div className="space-y-2 mb-6 pt-4 border-t border-[var(--color-border)]/60">
            {client.keyAchievements.slice(0, 2).map((achievement, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                <CheckCircle2 size={14} className="text-[var(--color-accent-light)] shrink-0 mt-0.5" />
                <span className="line-clamp-1">{achievement}</span>
              </div>
            ))}
          </div>
        )}

        {/* Services Provided Tags */}
        {client.servicesProvided && client.servicesProvided.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto mb-6">
            {client.servicesProvided.slice(0, 3).map((service) => (
              <span
                key={service}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-2 text-text-secondary border border-[var(--color-border)]"
              >
                {service}
              </span>
            ))}
            {client.servicesProvided.length > 3 && (
              <span className="px-2 py-1 rounded-full text-[11px] text-text-muted bg-surface-2 border border-[var(--color-border)]">
                +{client.servicesProvided.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Action Links */}
      <div className="relative z-20 pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
        <Link
          href={`/clients/${client.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-primary hover:text-[var(--color-accent-dark)] transition-colors group/link"
        >
          <span>View Partnership Profile</span>
          <ArrowUpRight
            size={15}
            className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 text-[var(--color-accent-light)]"
          />
        </Link>

        {client.website && (
          <a
            href={client.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-primary transition-colors p-1"
            title="Visit external client website"
            aria-label={`Visit ${client.name} website`}
          >
            <ExternalLink size={14} />
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
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
