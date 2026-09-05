"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/Parallax";
import {
  Search,
  FileText,
  Palette,
  Code2,
  TestTube2,
  Rocket,
  Wrench,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Search,
  FileText,
  Palette,
  Code2,
  TestTube2,
  Rocket,
  Wrench,
};

interface ProcessSectionProps {
  steps?: Array<{
    number: number;
    title: string;
    description: string;
    icon: string;
  }>;
}

export function ProcessSection({ steps = [] }: ProcessSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !lineRef.current || steps.length === 0) return;

    const processStepsElements = gsap.utils.toArray<HTMLElement>(".process-step");
    
    // Animate the main center line
    gsap.fromTo(lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        }
      }
    );

    // Animate each step revealing
    processStepsElements.forEach((step, i) => {
      const isEven = i % 2 === 0;
      const xOffset = isEven ? -50 : 50;

      gsap.fromTo(step,
        { opacity: 0, x: xOffset, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 75%",
            toggleActions: "play reverse play reverse",
          }
        }
      );
      
      // Animate the icon node
      const node = step.querySelector(".process-node");
      if (node) {
        gsap.fromTo(node,
          { scale: 0, backgroundColor: "transparent" },
          {
            scale: 1,
            backgroundColor: "var(--color-surface-2)",
            duration: 0.5,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: step,
              start: "top 70%",
              toggleActions: "play reverse play reverse",
            }
          }
        );
      }
    });
  }, [steps]);

  if (!steps || steps.length === 0) return null;

  return (
    <section id="process" className="section-padding bg-surface-1 border-t border-[var(--color-border)] relative overflow-hidden">
      {/* Background Parallax Layer */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <Parallax speed={0.2} className="absolute top-1/4 -left-1/4 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-r from-blue-500/5 to-transparent blur-[120px]" />
      </div>

      {/* Midground Parallax Layer */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <Parallax speed={0.5} className="absolute bottom-1/4 -right-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-t from-[var(--color-accent)]/5 to-transparent blur-[100px]" />
      </div>

      <Parallax speed={1.05} className="container-site relative z-10">
        <SectionHeading
          title="How We Build"
          subtitle="A transparent, engineering-led process. No black boxes, no radio silence, no surprise invoices."
          badge="Process"
          align="center"
        />

        <div ref={containerRef} className="relative max-w-4xl mx-auto py-4 md:py-6">
          
          {/* Background Timeline Line */}
          <div className="absolute left-5 sm:left-8 md:left-1/2 top-0 bottom-0 w-px bg-[var(--color-border)] -translate-x-1/2" />
          
          {/* Active Timeline Line */}
          <div 
            ref={lineRef}
            className="absolute left-5 sm:left-8 md:left-1/2 top-0 bottom-0 w-px bg-[var(--color-accent)] -translate-x-1/2 origin-top"
          />

          <div className="flex flex-col gap-8 md:gap-14">
            {steps.map((step, index) => {
              const Icon = iconMap[step.icon] || Code2;
              const isEven = index % 2 === 0;

              return (
                <div key={index} className="process-step relative flex items-center w-full">
                  {/* Center Node */}
                  <div className="process-node absolute left-5 sm:left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border border-[var(--color-border)] z-10 transition-colors duration-500 hover:border-[var(--color-accent)] hover:bg-surface-2 text-text-primary bg-surface-1 shadow-sm">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>

                  {/* Grid layout with single semantic content block */}
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center">
                    {isEven ? (
                      <>
                        {/* Even: Desktop Left, Mobile Right */}
                        <div className="pl-14 sm:pl-20 md:pl-0 md:pr-16 md:text-right">
                          <div className="flex items-center gap-2.5 sm:gap-3 mb-2 md:justify-end">
                            <span className="text-[var(--color-accent)] font-bold font-display text-lg sm:text-xl shrink-0">0{step.number}</span>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-display text-text-primary break-words">{step.title}</h3>
                          </div>
                          <p className="text-text-secondary text-sm sm:text-base leading-relaxed break-words">{step.description}</p>
                        </div>
                        <div className="hidden md:block" aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        <div className="hidden md:block" aria-hidden="true" />
                        {/* Odd: Desktop Right, Mobile Right */}
                        <div className="pl-14 sm:pl-20 md:pl-16 text-left">
                          <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
                            <span className="text-[var(--color-accent)] font-bold font-display text-lg sm:text-xl shrink-0">0{step.number}</span>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-display text-text-primary break-words">{step.title}</h3>
                          </div>
                          <p className="text-text-secondary text-sm sm:text-base leading-relaxed break-words">{step.description}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Parallax>
    </section>
  );
}
