import type { Metadata } from "next";
import { TeamSection } from "@/components/sections/TeamSection";
import { getTeamData } from "@/lib/db-helpers";
import { buildBreadcrumbSchema, safeJsonLd } from "@/lib/json-ld";
import { buildPageMetadata, SEO_CONFIG } from "@/lib/seo";

const siteUrl = SEO_CONFIG.siteUrl;

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Engineering Team — Developers, Architects & Designers",
  description:
    "Meet the MARK2 engineering team: developers, software architects, UI/UX designers, and mobile app engineers building scalable digital products for high-growth businesses.",
  ogTitle: "Engineering Team — Developers & Architects",
  ogDescription:
    "Meet the MARK2 engineering team: developers, software architects, UI/UX designers, and mobile app engineers.",
  ogAlt: "Engineering Team — MARK2",
  path: "/team",
});


export default async function TeamPage() {
  const teamData = await getTeamData();

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Team", url: `${siteUrl}/team` },
  ]);

  const teamSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MARK2 Engineering Team",
    itemListElement: (teamData || []).map((m: any, idx: number) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Person",
        name: m.name,
        jobTitle: m.role,
        image: m.photo || undefined,
        worksFor: {
          "@type": "Organization",
          name: "MARK2",
          url: siteUrl,
        },
        url: `${siteUrl}/team/${m.slug}`,
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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(teamSchema) }}
      />
      <TeamSection teamData={teamData} headingTag="h1" />
    </>
  );
}

