import type { Metadata } from "next";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/Parallax";
import { getServicesData } from "@/lib/db-helpers";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Core Engineering Services",
  description: "Explore our core engineering services: Web Apps, Mobile Apps, Enterprise Platforms, and AI Automation built for high-growth companies.",
  alternates: {
    canonical: `${siteUrl}/services`,
  },
  openGraph: {
    title: "Core Engineering Services | MARK Technologies",
    description: "Explore our core engineering services: Web Apps, Mobile Apps, Enterprise Platforms, and AI Automation built for high-growth companies.",
    url: `${siteUrl}/services`,
    siteName: "MARK Technologies",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Core Engineering Services | MARK Technologies",
    description: "Explore our core engineering services: Web Apps, Mobile Apps, Enterprise Platforms, and AI Automation built for high-growth companies.",
  },
};

export default async function ServicesPage() {
  const servicesData = await getServicesData();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pt-32 pb-8 md:pb-12 relative overflow-hidden">
        {/* Background Parallax Orb */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <Parallax speed={0.8} className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/10 to-transparent blur-[120px]" />
        </div>
        <div className="container-site relative z-10">
          <SectionHeading
            as="h1"
            title="Engineering solutions for complex problems."
            subtitle="We don't just write code. We architect systems that scale with your business."
            badge="Our Services"
            align="center"
          />
        </div>
      </div>
      
      <ServicesSection servicesData={servicesData} hideHeader={true} />
    </>
  );
}

