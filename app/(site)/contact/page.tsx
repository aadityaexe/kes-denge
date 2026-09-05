import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/Parallax";
import { getSettingsData } from "@/lib/db-helpers";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Contact Us — Start a Project",
  description: "Get in touch with our engineering team to start your next web app, mobile app, or enterprise platform.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact Us — Start a Project | MARK Technologies",
    description: "Get in touch with our engineering team to start your next web app, mobile app, or enterprise platform.",
    url: `${siteUrl}/contact`,
    siteName: "MARK Technologies",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us — Start a Project | MARK Technologies",
    description: "Get in touch with our engineering team to start your next web app, mobile app, or enterprise platform.",
  },
};

export default async function ContactPage() {
  const settingsData = await getSettingsData();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${siteUrl}/contact` },
    ],
  };

  return (
    <div className="pt-24 md:pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContactSection settingsData={settingsData} headingTag="h1" />
    </div>
  );
}

