import type { Metadata } from "next";
import { getJobsData, getSettingsData } from "@/lib/db-helpers";
import { buildBreadcrumbSchema, safeJsonLd } from "@/lib/json-ld";
import { buildPageMetadata, SEO_CONFIG } from "@/lib/seo";
import { CareersView } from "@/components/careers/CareersView";
import type { Job } from "@/lib/types";

export const revalidate = 300;

const siteUrl = SEO_CONFIG.siteUrl;

export const metadata: Metadata = buildPageMetadata({
  title: "Careers — Build Your Future With Us",
  description:
    "Build your future with MARK2. Explore open roles in engineering, design, and product, learn about our mission, culture, benefits, and hiring process.",
  ogDescription:
    "Explore open engineering, design, and product roles at MARK2. Remote-friendly culture, high ownership, and real-world impact.",
  ogAlt: "Careers at MARK2",
  path: "/careers",
});

export default async function CareersPage() {
  const [jobs, settings] = await Promise.all([getJobsData(), getSettingsData()]);

  const companyInfo = {
    siteName: settings?.siteName || "MARK2",
    description:
      settings?.description ||
      "A product-engineering agency that ships web apps, mobile apps, ERP/SaaS systems, and AI automation for startups and growing businesses.",
    aboutSubtitle:
      settings?.about?.subtitle ||
      "We build scalable, maintainable software that solves real business problems.",
    mission:
      settings?.about?.mission ||
      "To empower businesses by building mission-critical software solutions with uncompromising engineering rigor.",
    vision:
      settings?.about?.vision ||
      "To be the premier engineering partner for visionary founders and forward-thinking enterprises worldwide.",
    story:
      settings?.about?.story ||
      "Founded by engineers who spent years architecting high-traffic distributed systems, we believe code quality and business velocity go hand in hand.",
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Careers", url: `${siteUrl}/careers` },
  ]);

  // JobPosting structured data for each active job
  const jobPostingSchemas = (jobs || []).map((job: Job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.summary || job.description || `${job.title} role at MARK2`,
    datePosted: job.createdAt
      ? new Date(job.createdAt).toISOString().split("T")[0]
      : new Date("2026-11-28").toISOString().split("T")[0],
    ...(job.applicationDeadline
      ? { validThrough: new Date(job.applicationDeadline).toISOString().split("T")[0] }
      : {}),
    employmentType: job.employmentType
      ? job.employmentType.toUpperCase().replace("-", "_")
      : "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "MARK2",
      sameAs: siteUrl,
      logo: `${siteUrl}/logo/logo.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || "India",
        addressCountry: "IN",
      },
    },
    ...(job.workMode === "Remote" ? { jobLocationType: "TELECOMMUTE" } : {}),
    url: `${siteUrl}/careers/${job.slug}`,
    ...(job.salaryRange
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "INR",
            value: {
              "@type": "QuantitativeValue",
              unitText: "YEAR",
              value: job.salaryRange,
            },
          },
        }
      : {}),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      {jobPostingSchemas.map((schema: any, idx: number) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
        />
      ))}
      <CareersView initialJobs={jobs} company={companyInfo} />
    </>
  );
}
