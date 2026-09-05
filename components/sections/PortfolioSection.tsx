"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Parallax } from "@/components/ui/Parallax";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

function PortfolioCard({ item, index, isLarge }: { item: any, index: number, isLarge: boolean }) {
  const speed = index % 2 === 0 ? 1.05 : 0.95;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const techStack = item.techStack || [];

  return (
    <Parallax speed={speed} className={isLarge ? "md:col-span-2" : "md:col-span-1"}>
      <Link
        href={`/portfolio/${item.slug}`}
        onMouseMove={handleMouseMove}
        className="group relative block overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-surface-1 w-full h-full min-h-[380px]"
      >
        {/* Background Image / Gradient Placeholder */}
        {item.coverImage || item.thumbnail ? (
          <img 
            src={item.coverImage || item.thumbnail} 
            alt={item.title} 
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 z-0" 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-1 to-surface-2 transition-transform duration-700 group-hover:scale-105 z-0" />
        )}
        
        {/* Framer Motion Hover Spotlight */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
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

        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-1/95 via-surface-1/60 to-transparent z-10 pointer-events-none" />

        {/* Animated Gradient Border on Hover */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-accent)]/30 rounded-[24px] transition-colors duration-500 pointer-events-none z-20" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full z-20">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-surface-1/80 border border-[var(--color-border)] backdrop-blur-md rounded-full text-xs font-medium text-text-primary">
              {item.category}
            </span>
            {techStack.slice(0, 2).map((tech: string) => (
              <span key={tech} className="px-3 py-1 bg-surface-1/80 border border-[var(--color-border)] backdrop-blur-md rounded-full text-xs font-medium text-text-secondary">
                {tech}
              </span>
            ))}
          </div>

          <h3 className="text-3xl font-display font-bold text-text-primary mb-2 group-hover:text-[var(--color-accent)] transition-colors">
            {item.title}
          </h3>

          <p className="text-text-secondary text-[var(--text-body-sm)] line-clamp-2 mb-6 max-w-lg">
            {item.oneLiner || item.summary || item.shortDescription || item.problem}
          </p>

          <div className="flex items-center text-sm font-semibold text-text-primary group-hover:text-[var(--color-accent)] transition-colors">
            <span>Read Case Study</span>
            <ArrowUpRight size={16} className="ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </div>
      </Link>
    </Parallax>
  );
}


export function PortfolioSection({
  portfolioData = [],
  showAll = false,
  hideHeader = false,
  className = "",
}: {
  portfolioData?: any[];
  showAll?: boolean;
  hideHeader?: boolean;
  className?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  const allItems = portfolioData.filter((item: any) => item.isActive !== false);
  const displayItems = showAll 
    ? allItems 
    : (allItems.filter((item: any) => item.isFeatured).length > 0 
        ? allItems.filter((item: any) => item.isFeatured).slice(0, 4) 
        : allItems.slice(0, 4));

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.children;

    gsap.fromTo(
      cards,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className={`${className ? className : hideHeader ? "pb-16 md:pb-24 pt-4" : "section-padding"} bg-base`}
    >
      <div className="container-site">
        {!hideHeader && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-10">
            <div className="max-w-2xl">
              <SectionHeading
                title={showAll ? "All Case Studies" : "Recent Work"}
                subtitle={showAll ? "Explore our comprehensive portfolio of production deployments." : "We don't just build software, we build businesses. Here are some of the products we've shipped recently."}
                badge="Portfolio"
                align="left"
              />
            </div>
            {!showAll && (
              <Button variant="outline" size="lg" href="/portfolio" className="rounded-full mb-6 md:mb-8">
                View All Projects
              </Button>
            )}
          </div>
        )}

        <div className="relative">
          {/* Parallax Background Glow for Bento Grid */}
          <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
            <Parallax speed={0.3} className="w-full h-full max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-tr from-[var(--color-accent)]/10 to-transparent blur-[120px]" />
          </div>

          {/* Bento Grid */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
            {displayItems.map((item: any, index: number) => {
              const isLarge = index === 0 || index === 3 || index === 4 || index === 7;
              return <PortfolioCard key={item._id || item.id || index} item={item} index={index} isLarge={isLarge} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

