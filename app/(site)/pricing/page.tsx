import { PricingSection } from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/Parallax";
import { getPricingData, getFAQsData } from "@/lib/db-helpers";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparent Pricing & Investment",
  description: "Transparent pricing models for our engineering services, dedicated teams, and ready platforms.",
  openGraph: {
    title: "Transparent Pricing & Investment | Kas Denge Technologies",
    description: "Transparent pricing models for our engineering services, dedicated teams, and ready platforms.",
  },
};

export default async function PricingPage() {
  const [pricingData, faqsData] = await Promise.all([
    getPricingData(),
    getFAQsData(),
  ]);

  return (
    <>
      <div className="pt-32 pb-8 md:pb-12 relative overflow-hidden">
        {/* Background Parallax Orb */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <Parallax speed={0.8} className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/10 to-transparent blur-[120px]" />
        </div>
        <div className="container-site relative z-10">
          <SectionHeading
            title="Invest in scalable engineering."
            subtitle="Clear, predictable pricing without the dreaded scope creep."
            badge="Plans & Pricing"
            align="center"
          />
        </div>
      </div>
      
      <PricingSection pricingData={pricingData} hideHeader={true} />
      <FAQSection faqsData={faqsData} />
    </>
  );
}

