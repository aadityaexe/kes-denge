import type { Metadata } from "next";
import { getJobsData, getSettingsData } from "@/lib/db-helpers";
import { buildBreadcrumbSchema, safeJsonLd } from "@/lib/json-ld";
import { CareersView } from "@/components/careers/CareersView";

export const revalidate = 300;

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Careers — Build Your Future With Us | MARK 2",
  description:
    "Build your future with MARK 2. Explore open roles in engineering, design, and product, learn about our mission, culture, benefits, and hiring process.",
  alternates: {
    canonical: `${siteUrl}/careers`,
  },
  openGraph: {
    title: "Careers — Build Your Future With Us",
    description:
      "Explore open engineering, design, and product roles at MARK 2. Remote-friendly culture, high ownership, and real-world impact.",
    url: `${siteUrl}/careers`,
    siteName: "MARK 2",
    type: "website",
    images: [{ url: `${siteUrl}/opengraph-image`, width: 1200, height: 630, alt: "Careers at MARK 2" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers — Build Your Future With Us",
    description: "Explore open roles in engineering, design, and product at MARK 2.",
    images: [`${siteUrl}/twitter-image`],
  },
};

export default async function CareersPage() {
  const [jobs, settings] = await Promise.all([getJobsData(), getSettingsData()]);

  const companyInfo = {
    siteName: settings?.siteName || "MARK 2",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <CareersView initialJobs={jobs} company={companyInfo} />
    </>
  );
}
