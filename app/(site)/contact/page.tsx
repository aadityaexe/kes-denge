import { ContactSection } from "@/components/sections/ContactSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/Parallax";
import { getSettingsData } from "@/lib/db-helpers";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Start a Project",
  description: "Get in touch with our engineering team to start your next web app, mobile app, or enterprise platform.",
  openGraph: {
    title: "Contact Us — Start a Project | Kas Denge Technologies",
    description: "Get in touch with our engineering team to start your next web app, mobile app, or enterprise platform.",
  },
};

export default async function ContactPage() {
  const settingsData = await getSettingsData();

  return (
    <div className="pt-24 md:pt-28">
      <ContactSection settingsData={settingsData} />
    </div>
  );
}

