import type { Metadata } from "next";
import { TeamSection } from "@/components/sections/TeamSection";
import { getTeamData } from "@/lib/db-helpers";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Our Team — Engineers & Architects",
  description: "Meet the engineers, designers, and architects building scalable software and digital products at MARK.",
  alternates: {
    canonical: `${siteUrl}/team`,
  },
  openGraph: {
    title: "Our Team — Engineers & Architects | MARK Technologies",
    description: "Meet the engineers, designers, and architects building scalable software and digital products at MARK.",
    url: `${siteUrl}/team`,
    siteName: "MARK Technologies",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Our Team — MARK Technologies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Team — Engineers & Architects | MARK Technologies",
    description: "Meet the engineers, designers, and architects building scalable software and digital products at MARK.",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <TeamSection teamData={teamData} headingTag="h1" />
    </>
  );
}

