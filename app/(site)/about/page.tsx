import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/Parallax";
import { getSettingsData } from "@/lib/db-helpers";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Engineering Philosophy",
  description: "Learn about Kas Denge's engineering philosophy, architecture standards, and mission to build scalable digital products.",
  openGraph: {
    title: "About Us — Engineering Philosophy | Kas Denge Technologies",
    description: "Learn about Kas Denge's engineering philosophy, architecture standards, and mission to build scalable digital products.",
  },
};

export default async function AboutPage() {
  const settings = await getSettingsData();
  const aboutSubtitle = settings?.about?.subtitle || "Kas Denge was founded with a single mission: to build scalable, maintainable software that solves real business problems. No shortcuts, no black boxes.";
  const mission = settings?.about?.mission || "To empower businesses by building mission-critical software solutions with uncompromising engineering rigor.";
  const vision = settings?.about?.vision || "To be the premier engineering partner for visionary founders and forward-thinking enterprises worldwide.";
  const story = settings?.about?.story;

  return (
    <>
      <div className="pt-32 pb-12 relative overflow-hidden">
        {/* Background Parallax Orb */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <Parallax speed={0.8} className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/10 to-transparent blur-[120px]" />
        </div>
        <div className="container-site relative z-10">
          <SectionHeading
            title="We are engineers, not just coders."
            subtitle={aboutSubtitle}
            badge="About Us"
            align="center"
          />

          {(mission || vision || story) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 md:mt-10 max-w-4xl mx-auto">
              {mission && (
                <div className="p-8 rounded-3xl bg-surface-1 border border-[var(--color-border)]">
                  <span className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-bold mb-3 block">Our Mission</span>
                  <p className="text-text-secondary leading-relaxed">{mission}</p>
                </div>
              )}
              {vision && (
                <div className="p-8 rounded-3xl bg-surface-1 border border-[var(--color-border)]">
                  <span className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-bold mb-3 block">Our Vision</span>
                  <p className="text-text-secondary leading-relaxed">{vision}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <WhyChooseUsSection items={settings?.whyChooseUs} />
      <ProcessSection steps={settings?.processSteps} />
    </>
  );
}

