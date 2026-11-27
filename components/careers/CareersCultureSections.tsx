"use client";

import { motion } from "framer-motion";
import { Compass, Layers, Target } from "lucide-react";
import {
  BENEFITS_PERKS,
  CORE_VALUES,
  HIRING_STEPS,
  LIFE_GALLERY,
  WHY_JOIN_US,
  type CompanyInfo,
} from "./careers-data";

export function CareersCultureSections({ company }: { company: CompanyInfo }) {
  return (
    <>
      {/* About the Company */}
      <section id="about-company" className="section-padding border-b border-[var(--color-border)]">
        <div className="container-site space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent-dark)]">
              About {company.siteName}
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-primary tracking-tight">
              Driven by precision, built by people who care.
            </h2>
            <p className="text-text-secondary text-base leading-relaxed">
              {company.story || company.aboutSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent-dark)]">
                <Target size={18} />
              </div>
              <h3 className="text-xl font-display font-semibold text-text-primary">
                Our Mission
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {company.mission}
              </p>
            </div>

            <div className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent-dark)]">
                <Compass size={18} />
              </div>
              <h3 className="text-xl font-display font-semibold text-text-primary">
                Our Vision
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {company.vision}
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="space-y-5">
            <h3 className="text-lg font-display font-semibold text-text-primary">
              Our Core Values
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {CORE_VALUES.map((val) => {
                const Icon = val.icon;
                return (
                  <div
                    key={val.title}
                    className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-5 space-y-2.5 hover:border-[var(--color-accent)]/40 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-surface-2 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent-dark)]">
                      <Icon size={17} />
                    </div>
                    <h4 className="text-sm font-display font-semibold text-text-primary">
                      {val.title}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="section-padding bg-surface-2/40 border-b border-[var(--color-border)]">
        <div className="container-site space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent-dark)]">
              Why Join Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-primary tracking-tight">
              An environment built for your best work.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_JOIN_US.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-6 space-y-3 shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent-dark)]">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-base font-display font-semibold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Life at Our Company */}
      <section className="section-padding bg-surface-2/40 border-b border-[var(--color-border)]">
        <div className="container-site space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent-dark)]">
                Life at {company.siteName}
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-primary tracking-tight">
                Collaboration, craft, and curiosity.
              </h2>
            </div>
            <p className="text-xs text-text-muted">
              Culture highlights (illustrative gallery)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {LIFE_GALLERY.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-[var(--color-border)] bg-surface-1 overflow-hidden hover:border-[var(--color-accent)]/40 transition-all"
              >
                <div
                  className={`h-44 bg-gradient-to-br ${item.gradient} p-5 flex flex-col justify-between relative`}
                >
                  <span className="self-start px-2.5 py-1 rounded-full bg-surface-1/90 border border-[var(--color-border)] text-[11px] font-medium text-text-primary">
                    {item.tag}
                  </span>
                  <Layers
                    size={36}
                    className="text-[var(--color-accent-dark)]/40 group-hover:scale-110 transition-transform self-end"
                  />
                </div>
                <div className="p-5 space-y-1.5">
                  <h3 className="text-sm font-display font-semibold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Perks */}
      <section className="section-padding bg-surface-2/40 border-b border-[var(--color-border)]">
        <div className="container-site space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent-dark)]">
              Benefits &amp; Perks
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-primary tracking-tight">
              Designed to support you inside and outside of work.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS_PERKS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-6 space-y-2.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent-dark)]">
                    <Icon size={17} />
                  </div>
                  <h3 className="text-base font-display font-semibold text-text-primary">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hiring Process */}
      <section className="section-padding border-b border-[var(--color-border)]">
        <div className="container-site space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent-dark)]">
              Hiring Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-primary tracking-tight">
              Transparent, respectful, and fast.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {HIRING_STEPS.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-6 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[var(--color-accent-dark)] px-2.5 py-1 rounded-full bg-[var(--color-accent)]/10">
                      Step {st.step}
                    </span>
                    <Icon size={18} className="text-text-muted" />
                  </div>
                  <h3 className="text-base font-display font-semibold text-text-primary">
                    {st.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {st.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
