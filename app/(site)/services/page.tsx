import type { Metadata } from "next";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { PageHero } from "@/components/layout/PageHero";
import { getServicesData } from "@/lib/db-helpers";
import { buildBreadcrumbSchema, safeJsonLd } from "@/lib/json-ld";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Software Development Services \u2014 Web, Mobile, ERP & AI Automation",
  description: "Custom software development services by MARK 2: web application development, mobile app development, enterprise ERP systems, SaaS platforms, and AI automation — built for high-growth businesses in India and globally.",
  keywords: [
    "custom software development services",
    "web application development company",
    "mobile app development India",
    "enterprise ERP development",
    "AI automation services",
    "SaaS development company",
    "MARK 2 services",
    "MARK 2 Technologies",
    "MARK 2 custom software",
    "MARK 2 software development services",
    "MARK 2 web application development company",
    "MARK 2 mobile app development India",
    "MARK 2 enterprise ERP development",
    "MARK 2 AI automation services",
    "MARK 2 SaaS development company",
    "MARK 2",
    "MARK2",
    "MARK",
  ],
  alternates: {
    canonical: `${siteUrl}/services`,
  },
  openGraph: {
    title: "Software Development Services \u2014 Web, Mobile, ERP & AI",
    description: "Custom software development services: web apps, mobile apps, enterprise ERP, SaaS platforms, and AI automation built for high-growth businesses.",
    url: `${siteUrl}/services`,
    siteName: "MARK 2",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Software Development Services \u2014 MARK 2",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Development Services \u2014 Web, Mobile, ERP & AI",
    description: "Custom software development services: web apps, mobile apps, enterprise ERP, SaaS platforms, and AI automation built for high-growth businesses.",
    images: [`${siteUrl}/twitter-image`],
  },
};

export const revalidate = 3600;

export default async function ServicesPage() {
  const servicesData = await getServicesData();

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Services", url: `${siteUrl}/services` },
  ]);

  const serviceListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MARK 2 Engineering Services",
    description: "Production-grade software engineering, ERP architectures, mobile applications, and AI automation systems.",
    itemListElement: (servicesData || []).map((s: any, idx: number) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Service",
        name: s.title || s.name,
        description: s.shortDescription || s.tagline || s.description,
        provider: {
          "@type": "Organization",
          name: "MARK 2 Technologies",
          url: siteUrl,
        },
        url: `${siteUrl}/services/${s.slug}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceListSchema) }}
      />
      <PageHero
        badge="Our Services"
        title="Engineering solutions for complex problems."
        subtitle="We don't just write code. We architect systems that scale with your business."
        lead="MARK 2 provides full-lifecycle product engineering services across custom web applications, cross-platform mobile apps (React Native, iOS, Android), enterprise ERP systems, and autonomous AI agents. Every system is built on modern microservices and modular architectures with automated CI/CD and direct senior engineering oversight."
      />

      <ServicesSection servicesData={servicesData} hideHeader={true} />
    </>
  );
}
