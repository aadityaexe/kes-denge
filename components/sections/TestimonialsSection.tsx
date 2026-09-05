"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Star, Quote } from "lucide-react";
import { Parallax } from "@/components/ui/Parallax";


interface TestimonialsSectionProps {
  testimonialsData?: any[];
}

export function TestimonialsSection({ testimonialsData = [] }: TestimonialsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const list = testimonialsData.filter((t: any) => t.isActive !== false);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || list.length === 0) return;
    const ctx = gsap.context(() => {
      // Auto-sliding marquee effect for testimonials using GSAP
      const track = trackRef.current!;
      
      // Clone items for infinite scroll
      const items = Array.from(track.children);
      items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
      });
      // Animate the track
      gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: 30,
        repeat: -1,
      });
      // Reveal animation
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0, 
          duration: 1, 
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [list.length]);

  if (list.length === 0) return null;

  return (
    <section ref={sectionRef} id="testimonials" className="section-padding bg-surface-1 border-t border-[var(--color-border)] relative overflow-hidden">
      {/* Background Parallax Orb */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <Parallax speed={0.9} className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-tr from-[var(--color-accent)]/10 to-transparent blur-[120px]" />
      </div>

      <div className="container-site relative z-10 mb-4 md:mb-6">
        <SectionHeading
          title="Client Feedback"
          subtitle="Don't just take our word for it. See what our partners have to say."
          badge="Testimonials"
          align="center"
        />
      </div>

      {/* Auto-sliding track */}
      <div className="relative w-full flex overflow-hidden">
        
        {/* Left & Right Fade Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-32 bg-gradient-to-r from-surface-1 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-32 bg-gradient-to-l from-surface-1 to-transparent z-10 pointer-events-none" />
        
        <div ref={trackRef} className="flex gap-4 sm:gap-6 px-4 sm:px-6">
          {list.map((t: any, i: number) => (
            <div 
              key={t._id || t.id || i} 
              className="w-[85vw] max-w-[380px] sm:w-[380px] shrink-0 bg-surface-2 border border-[var(--color-border)] p-5 sm:p-8 rounded-2xl flex flex-col justify-between hover:border-black/20 transition-colors"
            >
              <div>
                <div className="flex items-center gap-1 mb-4 sm:mb-6 text-[var(--color-accent)]">
                  {[...Array(5)].map((_, starIdx) => (
                    <Star key={starIdx} size={16} fill={starIdx < (t.rating || 5) ? "currentColor" : "none"} className={starIdx >= (t.rating || 5) ? "text-black/10" : ""} />
                  ))}
                </div>
                <Quote size={28} className="text-black/5 mb-3 sm:mb-4" />
                <p className="text-text-primary text-base sm:text-lg font-display mb-6 sm:mb-8 leading-relaxed break-words">&ldquo;{t.review || t.content}&rdquo;</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-black/5 overflow-hidden shrink-0">
                  {t.photo || t.clientAvatar ? (
                    <img src={t.photo || t.clientAvatar} alt={t.clientName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted/50 font-bold uppercase">{t.clientName?.substring(0,2) || "KD"}</div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-text-primary">{t.clientName}</p>
                  <p className="text-sm text-text-muted">{t.company || t.clientRole}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

