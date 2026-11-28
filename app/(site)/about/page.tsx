import type { Metadata } from "next";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { PageHero } from "@/components/layout/PageHero";
import { getSettingsData } from "@/lib/db-helpers";
import { buildBreadcrumbSchema, safeJsonLd } from "@/lib/json-ld";
import { buildPageMetadata, SEO_CONFIG } from "@/lib/seo";

export const revalidate = 3600;

const siteUrl = SEO_CONFIG.siteUrl;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsData();
  const description =
    settings?.seo?.aboutDescription ||
    settings?.about?.subtitle ||
    "MARK2 is a custom software development company based in India. We build scalable web applications, mobile apps, enterprise ERP systems, and AI automation products for high-growth businesses worldwide.";

  return buildPageMetadata({
    title: "About MARK2 — Custom Software Development Company",
    description,
    ogDescription:
      "MARK2 is a custom software development company building scalable web apps, mobile apps, enterprise ERP, and AI automation for high-growth businesses.",
    ogAlt: "About MARK2 — Custom Software Development Company",
    path: "/about",
    keywords: [
      "MARK2",
      "custom software development company India",
      "software engineering agency",
      "product engineering company",
      "web application development India",
      "about MARK2",
    ],
  });
}

export default async function AboutPage() {
  const settings = await getSettingsData();
  const aboutSubtitle = settings?.about?.subtitle || "MARK2 was founded with a single mission: to build scalable, maintainable software that solves real business problems. No shortcuts, no black boxes — just rigorous engineering.";
  const mission = settings?.about?.mission || "To empower businesses by building mission-critical software solutions with uncompromising engineering rigor.";
  const vision = settings?.about?.vision || "To be the premier engineering partner for visionary founders and forward-thinking enterprises across India and worldwide.";
  const story = settings?.about?.story;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "About", url: `${siteUrl}/about` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <PageHero
        badge="About Us"
        title="We are engineers, not just coders."
        subtitle={aboutSubtitle}
        className="pb-10 sm:pb-12"
      >
        {(mission || vision || story) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8 md:mt-10 max-w-4xl mx-auto">
            {mission && (
              <div className="p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-surface-1 border border-[var(--color-border)]">
                <span className="text-xs uppercase tracking-widest text-[var(--color-accent-dark)] font-bold mb-3 block">Our Mission</span>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed break-words">{mission}</p>
              </div>
            )}
            {vision && (
              <div className="p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-surface-1 border border-[var(--color-border)]">
                <span className="text-xs uppercase tracking-widest text-[var(--color-accent-dark)] font-bold mb-3 block">Our Vision</span>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed break-words">{vision}</p>
              </div>
            )}
          </div>
        )}
      </PageHero>

      <WhyChooseUsSection items={settings?.whyChooseUs} />
      <ProcessSection steps={settings?.processSteps} />
    </>
  );
}
