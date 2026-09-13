import type { Metadata } from "next";
import { TeamSection } from "@/components/sections/TeamSection";
import { getTeamData } from "@/lib/db-helpers";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Engineering Team — Developers, Architects & Designers",
  description: "Meet the MARK Technologies engineering team: developers, software architects, UI/UX designers, and mobile app engineers building scalable digital products for high-growth businesses.",
  alternates: {
    canonical: `${siteUrl}/team`,
  },
  openGraph: {
    title: "Engineering Team — Developers & Architects | MARK Technologies",
    description: "Meet the MARK Technologies engineering team: developers, software architects, UI/UX designers, and mobile app engineers.",
    url: `${siteUrl}/team`,
    siteName: "MARK Technologies",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Engineering Team — MARK Technologies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Team — Developers & Architects | MARK Technologies",
    description: "Meet the MARK Technologies engineering team: developers, software architects, UI/UX designers, and mobile app engineers.",
    images: [`${siteUrl}/twitter-image`],
  },
};


export default async function TeamPage() {
  const teamData = await getTeamData();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Team", item: `${siteUrl}/team` },
    ],
  };

  const teamSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MARK Technologies Engineering Team",
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
          name: "MARK Technologies",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
      />
      <TeamSection teamData={teamData} headingTag="h1" />
    </>
  );
}

