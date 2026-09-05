"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Monitor, Smartphone, Server, Megaphone, Paintbrush, Layers, Database, Cpu, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Parallax } from "@/components/ui/Parallax";


const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Monitor,
  Smartphone,
  Server,
  Megaphone,
  Paintbrush,
  Layers,
  Database,
  Cpu
};

function ServiceCard({ service, index, isLarge }: { service: any, index: number, isLarge: boolean }) {
  const Icon = iconMap[service.icon] || Monitor;
  
  // Hover gradient effect with Framer Motion
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const speed = index % 2 === 0 ? 1.05 : 0.95;

  return (
    <Parallax speed={speed} className={`service-card opacity-0 translate-y-8 h-full ${isLarge ? "lg:col-span-2" : "lg:col-span-1"}`}>
      <Link href={`/services/${service.slug}`} className="block h-full w-full">
        <div
          onMouseMove={handleMouseMove}
          className="group relative flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-surface-1 p-8 hover:shadow-2xl transition-all duration-500"
        >
          {/* Framer Motion Hover Spotlight */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition duration-300 group-hover:opacity-100 z-0"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  500px circle at ${mouseX}px ${mouseY}px,
                  rgba(201, 169, 110, 0.15),
                  transparent 80%
                )
              `,
            }}
          />
          
          {/* Animated Gradient Border on Hover */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-accent)]/30 rounded-[24px] transition-colors duration-500 pointer-events-none z-10" />

          {/* Background Mesh (Only on large cards for visual hierarchy) */}
          {isLarge && (
            <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
          )}

          <div className="relative z-20 flex flex-col h-full">
            <div className="flex justify-between items-start mb-12">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 border border-[var(--color-border)] text-text-secondary group-hover:bg-[var(--color-accent)]/10 group-hover:border-[var(--color-accent)]/30 group-hover:text-[var(--color-accent)] transition-all duration-500 group-hover:scale-110">
                <Icon size={26} strokeWidth={1.5} />
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-2 border border-[var(--color-border)] flex items-center justify-center text-text-secondary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-[var(--color-accent)] group-hover:text-surface-1 group-hover:border-[var(--color-accent)] transition-all duration-500">
                <ArrowUpRight size={18} />
              </div>
            </div>
            
            <div className="mt-auto">
              <h3 className="mb-4 text-2xl font-display text-text-primary group-hover:text-[var(--color-accent)] transition-colors">
                {service.title}
              </h3>
              <p className="text-text-secondary leading-relaxed text-[var(--text-body-sm)]">
                {service.shortDescription}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </Parallax>
  );
}

export function ServicesSection({
  servicesData = [],
  hideHeader = false,
  className = "",
}: {
  servicesData?: any[];
  hideHeader?: boolean;
  className?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const activeServices = servicesData.filter((s) => s.isActive !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
  
  useEffect(() => {
    if (!sectionRef.current) return;
    
    gsap.to(".service-card", {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play reverse play reverse",
      }
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className={`${className ? className : hideHeader ? "pb-16 md:pb-24 pt-4" : "section-padding"} bg-base relative overflow-hidden`}
    >
      {/* Background Parallax Orb */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <Parallax speed={0.3} className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent blur-[120px]" />
      </div>

      <div className="container-site relative z-10">
        {!hideHeader && (
          <SectionHeading
            title="Core Capabilities"
            subtitle="We provide end-to-end engineering teams to bring your product from zero to one, and one to infinity."
            badge="Services"
            align="center"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(320px,auto)] gap-6">
          {activeServices.map((service, index) => {
            // Create a gorgeous asymmetric bento layout (e.g. indices 0, 3, 4, 7... span 2 cols on lg)
            const isLarge = index === 0 || index === 3 || index === 4 || index === 7 || index === 10;
            return (
              <ServiceCard key={service._id || service.id || index} service={service} index={index} isLarge={isLarge} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
