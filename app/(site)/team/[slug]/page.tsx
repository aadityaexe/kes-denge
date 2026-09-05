import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTeamMemberBySlug, getTeamData } from "@/lib/db-helpers";
import { Badge } from "@/components/ui/Badge";
import { Link as LinkIcon, Globe, MessageSquare, ArrowLeft, Calendar, Award, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const revalidate = 3600;

export async function generateStaticParams() {
  const members = await getTeamData();
  return members.map((member: any) => ({
    slug: member.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);
  if (!member) return { title: "Member Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";
  const canonicalUrl = `${siteUrl}/team/${member.slug}`;
  const title = `${member.name} — ${member.role} | MARK Technologies`;
  const description = member.bio || `${member.name} is a ${member.role} at MARK Technologies specializing in ${member.specialization || "software engineering"}.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "MARK Technologies",
      type: "profile",
      images: [
        {
          url: member.photo || `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [member.photo || `${siteUrl}/twitter-image`],
    },
  };
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);
  
  if (!member) {
    notFound();
  }

  const techTags = member.techTags || [];
  const certifications = member.certifications || [];
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";
  const memberUrl = `${siteUrl}/team/${member.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Team",
        item: `${siteUrl}/team`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: member.name,
        item: memberUrl,
      },
    ],
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    worksFor: {
      "@type": "Organization",
      name: "MARK Technologies",
      url: siteUrl,
    },
    url: memberUrl,
    image: member.photo || undefined,
    description: member.bio || undefined,
    sameAs: [
      member.socialLinks?.linkedin,
      member.socialLinks?.github,
      member.socialLinks?.twitter,
    ].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 min-h-screen">
        <div className="container-site max-w-4xl">
          <Link href="/team" className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-6 sm:mb-8">
            <ArrowLeft size={16} /> Back to Team
          </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-12 items-start">
          {/* Left Column - Profile Card */}
          <div className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 sm:p-6 md:p-8 text-center sticky top-28 md:top-32">
            <div className="relative w-32 h-32 mx-auto rounded-full bg-surface-2 mb-6 flex items-center justify-center text-text-muted text-4xl font-bold uppercase overflow-hidden border-2 border-surface-2">
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={`Portrait of ${member.name}, ${member.role} at MARK Technologies`}
                  fill
                  priority
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                member.name.substring(0, 2)
              )}
            </div>
            
            <h1 className="text-display-sm mb-2">{member.name}</h1>
            <p className="text-accent font-medium mb-6">{member.role}</p>
            
            <div className="flex justify-center gap-4 mb-8">
              {member.socialLinks?.linkedin && (
                <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-surface-2 rounded-full text-text-muted hover:text-[#0A66C2] hover:bg-surface-2/80 transition-all"><LinkIcon size={20} /></a>
              )}
              {member.socialLinks?.github && (
                <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-surface-2 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-2/80 transition-all"><Globe size={20} /></a>
              )}
              {member.socialLinks?.twitter && (
                <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-surface-2 rounded-full text-text-muted hover:text-[#1DA1F2] hover:bg-surface-2/80 transition-all"><MessageSquare size={20} /></a>
              )}
            </div>

            <div className="space-y-4 text-left text-[var(--text-body-sm)]">
              {member.yearsExperience && (
                <div className="flex items-center gap-3 text-text-secondary">
                  <Briefcase size={16} className="text-text-muted" />
                  <span>{member.yearsExperience}+ Years Exp.</span>
                </div>
              )}
              {member.joinedDate && (
                <div className="flex items-center gap-3 text-text-secondary">
                  <Calendar size={16} className="text-text-muted" />
                  <span>Joined {member.joinedDate}</span>
                </div>
              )}
              {certifications.length > 0 && (
                <div className="flex items-start gap-3 text-text-secondary">
                  <Award size={16} className="text-text-muted mt-1 shrink-0" />
                  <span>{certifications[0]} {certifications.length > 1 && `+${certifications.length - 1} more`}</span>
                </div>
              )}
            </div>
            
            <Button className="w-full mt-8" href="/contact">Hire Our Team</Button>
          </div>

          {/* Right Column - Content */}
          <div className="prose prose-invert max-w-none">
            <h2 className="text-display-xs mb-6 pb-4 border-b border-[var(--color-border)]">About {member.name.split(' ')[0]}</h2>
            <div className="text-text-secondary text-lg leading-relaxed space-y-6 whitespace-pre-wrap">
              {member.bio || `${member.name} is a senior engineering specialist with extensive experience designing resilient architectures, intuitive interfaces, and enterprise software systems.`}
            </div>

            {member.specialization && (
              <>
                <h3 className="text-xl font-bold mt-12 mb-6 text-text-primary">Specialization</h3>
                <p className="text-text-secondary mb-8">{member.specialization}</p>
              </>
            )}

            {techTags.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-12 mb-6 text-text-primary">Core Tech Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {techTags.map((tag: string) => (
                    <Badge key={tag} variant="outline" size="md">{tag}</Badge>
                  ))}
                </div>
              </>
            )}

            {member.currentlyWorkingOn && (
              <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-accent/5 border border-accent/20 rounded-[var(--radius-md)]">
                <p className="text-sm font-medium text-accent mb-2 uppercase tracking-wider">Currently Working On</p>
                <p className="text-text-primary">{member.currentlyWorkingOn}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

