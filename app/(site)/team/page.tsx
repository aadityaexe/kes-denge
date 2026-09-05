import { TeamSection } from "@/components/sections/TeamSection";
import { getTeamData } from "@/lib/db-helpers";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team — Engineers & Architects",
  description: "Meet the engineers, designers, and architects building scalable software and digital products at Kas Denge.",
  openGraph: {
    title: "Our Team — Engineers & Architects | Kas Denge Technologies",
    description: "Meet the engineers, designers, and architects building scalable software and digital products at Kas Denge.",
  },
};

export default async function TeamPage() {
  const teamData = await getTeamData();

  return <TeamSection teamData={teamData} />;
}

