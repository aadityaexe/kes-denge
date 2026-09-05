"use client";

import { ServiceProblemSolution } from "@/lib/types";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

interface ServiceProblemsSolvedProps {
  problemsSolved: ServiceProblemSolution[];
}

function ProblemCard({ item, index }: { item: ServiceProblemSolution; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group relative bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 sm:p-6 md:p-8 flex flex-col justify-between transition-all duration-500 hover:border-[var(--color-accent)]/40 hover:shadow-2xl overflow-hidden"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0 rounded-[var(--radius-xl)]"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(201, 169, 110, 0.12),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10">
        {/* The Client Pain Point */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-xs font-semibold mb-3">
            <AlertTriangle size={13} />
            <span>The Traditional Bottleneck</span>
          </div>
          <p className="text-[#555555] text-text-secondary text-sm sm:text-base leading-relaxed font-normal break-words">
            {item.problem}
          </p>
        </div>

        {/* Separator */}
        <div className="flex items-center gap-3 my-6 text-[#999999]">
          <div className="h-px bg-[var(--color-border)] flex-1" />
          <div className="w-8 h-8 rounded-full bg-surface-2 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] shrink-0">
            <ArrowRight size={14} className="rotate-90 md:rotate-0 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="h-px bg-[var(--color-border)] flex-1" />
        </div>

        {/* The MARK Solution */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold mb-3">
            <CheckCircle2 size={13} />
            <span>MARK Solution</span>
          </div>
          <p className="text-[#111111] text-text-primary text-sm sm:text-base leading-relaxed font-semibold break-words">
            {item.solution}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ServiceProblemsSolved({ problemsSolved }: ServiceProblemsSolvedProps) {
  if (!problemsSolved || problemsSolved.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {problemsSolved.map((item, idx) => (
        <ProblemCard key={idx} item={item} index={idx} />
      ))}
    </div>
  );
}
