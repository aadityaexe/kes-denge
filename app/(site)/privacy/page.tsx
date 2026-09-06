import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/Parallax";
import { getLegalDocument } from "@/lib/db-helpers";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalDocument("privacy");
  const title = doc?.title || "Privacy Policy";
  const description =
    doc?.subtitle ||
    "Learn how MARK Technologies collects, protects, and manages data across our engineering services, platforms, and client partnerships.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/privacy`,
    },
    openGraph: {
      title: `${title} | MARK Technologies`,
      description,
      url: `${siteUrl}/privacy`,
      siteName: "MARK Technologies",
      type: "website",
      images: [
        {
          url: `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${title} | MARK Technologies`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | MARK Technologies`,
      description,
      images: [`${siteUrl}/twitter-image`],
    },
  };
}

export default async function PrivacyPolicyPage() {
  const doc = await getLegalDocument("privacy");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: doc?.title || "Privacy Policy", item: `${siteUrl}/privacy` },
    ],
  };

  const sections = doc?.sections || [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <Parallax
            speed={0.8}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/10 to-transparent blur-[120px]"
          />
        </div>
        <div className="container-site relative z-10">
          <SectionHeading
            as="h1"
            title={doc?.title || "Privacy Policy"}
            subtitle={doc?.subtitle || "Last updated: September 2026. How we collect, safeguard, and respect your data."}
            badge={doc?.badge || "Legal & Security"}
            align="center"
          />
        </div>
      </div>

      <section className="section-padding pt-0">
        <div className="container-site max-w-4xl text-text-secondary leading-relaxed space-y-6 sm:space-y-8">
          {sections.map((section: any, idx: number) => (
            <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-[var(--color-border)] shadow-xs">
              <h2 className="text-xl font-display font-semibold text-text-primary mb-3">
                {section.title}
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-sm sm:text-base">
                {section.content}
              </p>
            </div>
          ))}

          {doc?.contactEmail && (
            <div className="p-5 sm:p-6 rounded-2xl bg-surface-2 border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="text-text-secondary">
                Questions or data deletion requests? Contact our data governance team directly.
              </span>
              <a
                href={`mailto:${doc.contactEmail}`}
                className="text-[var(--color-accent-dark)] font-semibold hover:underline"
              >
                {doc.contactEmail}
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
