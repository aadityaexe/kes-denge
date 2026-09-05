"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Globe, ExternalLink } from "lucide-react";
import { Parallax } from "@/components/ui/Parallax";


interface TeamSectionProps {
  teamData?: any[];
  headingTag?: "h1" | "h2";
}

export function TeamSection({ teamData = [], headingTag = "h2" }: TeamSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const activeMembers = teamData.filter((m: any) => m.isActive !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current || activeMembers.length === 0) return;

    gsap.fromTo(
      gridRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, [activeMembers.length]);

  if (activeMembers.length === 0) return null;

  return (
    <section ref={sectionRef} className="section-padding bg-background border-t border-[var(--color-border)] relative overflow-hidden">
      {/* Background Parallax Element */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <Parallax speed={0.9} className="absolute top-1/3 -right-1/4 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-bl from-[var(--color-accent)]/5 to-transparent blur-[100px]" />
      </div>

      <div className="container-site relative z-10">
        <SectionHeading
          as={headingTag}
          title="The engineers behind the products."
          subtitle="We don't outsource. Every line of code is written by our in-house team of senior engineers and designers."
          badge="Our Team"
          align="center"
        />

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activeMembers.map((member, index) => (
            <Link key={member.slug || member._id || index} href={`/team/${member.slug}`}>
              <div className="group relative h-full flex flex-col p-5 sm:p-6 md:p-8 rounded-2xl bg-surface-1 border border-[var(--color-border)] overflow-hidden transition-all duration-500 hover:border-black/20 hover:bg-surface-2">
                {/* Image / Avatar */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black/5 mb-4 sm:mb-6 flex items-center justify-center text-text-muted/50 text-xl sm:text-2xl font-bold uppercase overflow-hidden border-2 border-transparent group-hover:border-[var(--color-accent-light)] transition-colors duration-500">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={`Portrait of ${member.name}, ${member.role || 'Engineer'} at MARK Technologies`}
                      fill
                      sizes="(max-width: 640px) 80px, 96px"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    member.name.substring(0, 2)
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-display text-text-primary mb-2 group-hover:text-[var(--color-accent-dark)] transition-colors break-words">{member.name}</h3>
                <p className="text-[var(--text-body-sm)] text-[var(--color-accent)] mb-4 sm:mb-6 break-words">{member.role}</p>

                <div className="flex flex-wrap gap-2 mt-auto mb-8">
                  {(member.techTags || []).slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-black/5 text-xs text-text-secondary border border-black/10 group-hover:border-black/20 transition-colors">
                      {tag}
                    </span>
                  ))}
                  {(member.techTags || []).length > 3 && (
                    <span className="px-3 py-1 rounded-full bg-black/5 text-xs text-text-secondary border border-black/10">
                      +{(member.techTags || []).length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-5 mt-auto pt-6 border-t border-[var(--color-border)] group-hover:border-black/10 transition-colors">
                  {member.socialLinks?.linkedin && (
                    <div className="text-text-muted hover:text-[#0A66C2] transition-colors"><ExternalLink size={18} /></div>
                  )}
                  {member.socialLinks?.github && (
                    <div className="text-text-muted hover:text-text-primary transition-colors"><Globe size={18} /></div>
                  )}
                  {member.socialLinks?.twitter && (
                    <div className="text-text-muted hover:text-[#1DA1F2] transition-colors"><ExternalLink size={18} /></div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
