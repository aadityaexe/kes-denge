import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getJobsData, getJobBySlug } from "@/lib/db-helpers";
import { Parallax } from "@/components/ui/Parallax";
import { JobApplicationForm } from "@/components/careers/JobApplicationForm";
import { safeJsonLd } from "@/lib/json-ld";
import { buildPageMetadata, SEO_CONFIG } from "@/lib/seo";
import { safeHref } from "@/lib/schemas";
import type { Job } from "@/lib/types";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  IndianRupee,
  MapPin,
  Star,
} from "lucide-react";

export const revalidate = 300;

const siteUrl = SEO_CONFIG.siteUrl;

export async function generateStaticParams() {
  const jobs = await getJobsData();
  return (jobs || []).map((job: Job) => ({ slug: job.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return buildPageMetadata({
      title: "Role Not Found — Careers",
      description: "The requested job opening could not be found.",
      noIndex: true,
    });
  }

  const rawTitle = job.metaTitle || `${job.title} — Careers`;
  const metaTitle = rawTitle.replace(/\s*\|\s*MARK2.*$/i, "");
  const metaDescription = job.metaDescription || job.summary;

  return buildPageMetadata({
    title: metaTitle,
    description: metaDescription,
    path: `/careers/${job.slug}`,
  });
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job: Job | null = await getJobBySlug(slug);

  if (!job) notFound();

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.summary,
    datePosted: job.createdAt,
    validThrough: job.applicationDeadline || undefined,
    employmentType: job.employmentType.toUpperCase().replace("-", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: "MARK2",
      sameAs: siteUrl,
    },
    jobLocationType: job.workMode === "Remote" ? "TELECOMMUTE" : undefined,
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Careers", item: `${siteUrl}/careers` },
      { "@type": "ListItem", position: 3, name: job.title, item: `${siteUrl}/careers/${job.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jobPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />

      {/* Header */}
      <div className="pt-24 sm:pt-28 md:pt-32 pb-10 relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <Parallax
            speed={0.8}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/10 to-transparent blur-[120px]"
          />
        </div>

        <div className="container-site relative z-10">
          <Link
            href="/careers"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Back to all open roles
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-2 border border-[var(--color-border)] text-xs font-medium text-text-primary">
                  <Building2 size={12} className="text-[var(--color-accent-dark)]" />
                  {job.department}
                </span>
                <span className="px-3 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] text-xs font-medium">
                  {job.workMode}
                </span>
                {job.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-text-primary text-surface-1 text-xs font-medium">
                    <Star size={11} /> Featured Role
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-text-primary tracking-tight leading-tight">
                {job.title}
              </h1>

              <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                {job.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {job.applyUrl ? (
                <a
                  href={safeHref(job.applyUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-text-primary text-surface-1 text-sm font-medium hover:bg-[var(--color-accent-dark)] transition-colors"
                >
                  Apply Externally <ArrowUpRight size={15} />
                </a>
              ) : (
                <a
                  href="#apply-form"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-text-primary text-surface-1 text-sm font-medium hover:bg-[var(--color-accent-dark)] transition-colors"
                >
                  Apply for this Role
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content + Sidebar */}
      <section className="section-padding bg-base">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column: Details & Application Form */}
            <div className="lg:col-span-2 space-y-10">
              {/* Role Description */}
              <div className="space-y-3">
                <h2 className="text-xl font-display font-semibold text-text-primary">
                  About the Role
                </h2>
                <div className="text-text-secondary text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-display font-semibold text-text-primary">
                    What You&apos;ll Do
                  </h2>
                  <ul className="space-y-2.5">
                    {job.responsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-text-secondary">
                        <CheckCircle2
                          size={17}
                          className="text-[var(--color-accent-dark)] shrink-0 mt-1"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-display font-semibold text-text-primary">
                    What We&apos;re Looking For
                  </h2>
                  <ul className="space-y-2.5">
                    {job.requirements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-text-secondary">
                        <CheckCircle2
                          size={17}
                          className="text-[var(--color-accent-dark)] shrink-0 mt-1"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nice to Have */}
              {job.niceToHave && job.niceToHave.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-display font-semibold text-text-primary">
                    Nice to Have
                  </h2>
                  <ul className="space-y-2.5">
                    {job.niceToHave.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0 mt-2.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-display font-semibold text-text-primary">
                    Perks & Benefits
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {job.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3.5 rounded-xl bg-surface-1 border border-[var(--color-border)] text-sm text-text-primary"
                      >
                        <CheckCircle2 size={14} className="text-[var(--color-accent-dark)] shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Embedded Application Form */}
              <div id="apply-form" className="pt-4 scroll-mt-28">
                <JobApplicationForm
                  jobId={String(job._id || job.id)}
                  jobTitle={job.title}
                />
              </div>
            </div>

            {/* Right Column: Role Summary Sidebar */}
            <aside className="space-y-6">
              <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-6 space-y-5 sticky top-28">
                <h3 className="text-base font-display font-semibold text-text-primary border-b border-[var(--color-border)] pb-3">
                  Role Overview
                </h3>

                <dl className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-[var(--color-accent-dark)] shrink-0 mt-0.5" />
                    <div>
                      <dt className="text-xs text-text-muted">Location</dt>
                      <dd className="text-text-primary font-medium">
                        {job.location} ({job.workMode})
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-[var(--color-accent-dark)] shrink-0 mt-0.5" />
                    <div>
                      <dt className="text-xs text-text-muted">Employment Type</dt>
                      <dd className="text-text-primary font-medium">{job.employmentType}</dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase size={16} className="text-[var(--color-accent-dark)] shrink-0 mt-0.5" />
                    <div>
                      <dt className="text-xs text-text-muted">Experience Level</dt>
                      <dd className="text-text-primary font-medium">{job.experienceLevel}</dd>
                    </div>
                  </div>

                  {job.salaryRange && (
                    <div className="flex items-start gap-3">
                      <IndianRupee size={16} className="text-[var(--color-accent-dark)] shrink-0 mt-0.5" />
                      <div>
                        <dt className="text-xs text-text-muted">Compensation</dt>
                        <dd className="text-text-primary font-medium">{job.salaryRange}</dd>
                      </div>
                    </div>
                  )}

                  {job.applicationDeadline && (
                    <div className="flex items-start gap-3">
                      <Calendar size={16} className="text-[var(--color-accent-dark)] shrink-0 mt-0.5" />
                      <div>
                        <dt className="text-xs text-text-muted">Apply By</dt>
                        <dd className="text-text-primary font-medium">
                          {new Date(job.applicationDeadline).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </dd>
                      </div>
                    </div>
                  )}
                </dl>

                {job.skills && job.skills.length > 0 && (
                  <div className="pt-4 border-t border-[var(--color-border)] space-y-2.5">
                    <p className="text-xs text-text-muted">Key Skills & Stack</p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-md bg-surface-2 border border-[var(--color-border)] text-xs text-text-secondary font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <a
                  href="#apply-form"
                  className="block w-full text-center px-5 py-3 rounded-full bg-text-primary text-surface-1 text-sm font-medium hover:bg-[var(--color-accent-dark)] transition-colors"
                >
                  Apply Now
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
