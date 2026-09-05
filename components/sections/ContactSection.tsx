"use client";

import { useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

function ContactCard({ icon: Icon, title, content, href }: { icon: any, title: string, content: React.ReactNode, href?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const innerContent = (
    <div
      onMouseMove={handleMouseMove}
      className="group relative flex items-start gap-4 sm:gap-5 overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-surface-1 p-4 sm:p-6 hover:shadow-2xl transition-all duration-500"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(201, 169, 110, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-accent)]/30 rounded-[24px] transition-colors duration-500 pointer-events-none z-10" />

      <div className="relative z-20 flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-surface-2 border border-[var(--color-border)] flex items-center justify-center text-text-secondary group-hover:bg-[var(--color-accent)]/10 group-hover:border-[var(--color-accent)]/30 group-hover:text-[var(--color-accent)] transition-all duration-500 group-hover:scale-110">
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div className="relative z-20 flex flex-col justify-center min-h-[2.75rem] sm:min-h-[3.5rem] min-w-0">
        <h4 className="text-xs sm:text-[var(--text-body-sm)] font-bold text-text-primary mb-1 uppercase tracking-wider">{title}</h4>
        <div className="text-xs sm:text-[var(--text-body-md)] text-text-secondary group-hover:text-[var(--color-accent)] transition-colors leading-relaxed break-words">
          {content}
        </div>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block w-full outline-none">
      {innerContent}
    </a>
  ) : (
    <div className="block w-full">
      {innerContent}
    </div>
  );
}

interface ContactSectionProps {
  settingsData?: any;
  headingTag?: "h1" | "h2";
}

export function ContactSection({ settingsData, headingTag = "h2" }: ContactSectionProps) {
  const { ref, isVisible } = useScrollReveal({ delay: 0.1 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "web",
    budgetRange: "$10k - $25k",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const email = settingsData?.contactEmail || "hello@mark2.in";
  const phone = settingsData?.contactPhone || "";
  const address = settingsData?.address || "Mumbai, India & Global Remote";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message. Please try again.");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        projectType: "web",
        budgetRange: "$10k - $25k",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding bg-surface-1 border-t border-[var(--color-border)] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Left Column: Contact Info */}
          <div ref={ref} className={`transition-all duration-[var(--transition-slow)] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <SectionHeading
              as={headingTag}
              title="Let's build something exceptional."
              subtitle="Whether you have a fully documented spec or just a concept on a napkin, we're ready to engineer it."
              badge="Get in Touch"
              align="left"
            />
            
            <div className="mt-6 md:mt-8 flex flex-col gap-4 md:gap-5">
              <ContactCard 
                icon={Mail} 
                title="Email Us" 
                content={email} 
                href={`mailto:${email}`} 
              />
              {phone ? (
                <ContactCard 
                  icon={Phone} 
                  title="Call Us" 
                  content={phone} 
                  href={`tel:${phone.replace(/\s+/g, '')}`} 
                />
              ) : null}
              <ContactCard 
                icon={MapPin} 
                title="Visit Us" 
                content={
                  <span className="whitespace-pre-line">
                    {address}
                  </span>
                } 
              />
            </div>
          </div>
          
          {/* Right Column: Contact Form */}
          <div className={`transition-all duration-[var(--transition-slow)] delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative group">
              {/* Animated glowing border effect behind the form */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-glow)] rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              
              <form 
                className="relative bg-surface-1/80 backdrop-blur-2xl border border-[var(--color-border)] rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 md:p-10 shadow-2xl overflow-hidden"
                onSubmit={handleSubmit}
              >
                {success && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-medium">
                    Thank you! Your inquiry has been received. Our engineering lead will contact you within 24 hours.
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-[var(--text-caption)] font-semibold text-text-secondary uppercase tracking-wider">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-surface-2/50 border border-[var(--color-border)] rounded-[16px] text-text-primary placeholder-text-muted focus:outline-none focus:border-[var(--color-accent)] focus:bg-surface-2 transition-all shadow-inner min-h-[44px]"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[var(--text-caption)] font-semibold text-text-secondary uppercase tracking-wider">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@company.com"
                      required
                      className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-surface-2/50 border border-[var(--color-border)] rounded-[16px] text-text-primary placeholder-text-muted focus:outline-none focus:border-[var(--color-accent)] focus:bg-surface-2 transition-all shadow-inner min-h-[44px]"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="project" className="text-[var(--text-caption)] font-semibold text-text-secondary uppercase tracking-wider">
                      Project Type
                    </label>
                    <CustomSelect
                      id="project"
                      value={formData.projectType}
                      onChange={(val) => setFormData({ ...formData, projectType: val })}
                      options={[
                        { value: "web", label: "Web Application" },
                        { value: "mobile", label: "Mobile App (iOS/Android)" },
                        { value: "erp", label: "ERP / SaaS System" },
                        { value: "ai", label: "AI Automation" },
                        { value: "other", label: "Other / Custom Digital Service" },
                      ]}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="budget" className="text-[var(--text-caption)] font-semibold text-text-secondary uppercase tracking-wider">
                      Estimated Budget
                    </label>
                    <CustomSelect
                      id="budget"
                      value={formData.budgetRange}
                      onChange={(val) => setFormData({ ...formData, budgetRange: val })}
                      options={[
                        { value: "$5k - $10k", label: "$5,000 - $10,000" },
                        { value: "$10k - $25k", label: "$10,000 - $25,000" },
                        { value: "$25k - $50k", label: "$25,000 - $50,000" },
                        { value: "$50k+", label: "$50,000+" },
                        { value: "custom", label: "Custom Retainer" },
                      ]}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mb-6 sm:mb-8">
                  <label htmlFor="details" className="text-[var(--text-caption)] font-semibold text-text-secondary uppercase tracking-wider">
                    Project Details
                  </label>
                  <textarea 
                    id="details" 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your business goals, scope, and timeline..."
                    required
                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-surface-2/50 border border-[var(--color-border)] rounded-[16px] text-text-primary placeholder-text-muted focus:outline-none focus:border-[var(--color-accent)] focus:bg-surface-2 transition-all resize-none shadow-inner"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full justify-center group h-12 sm:h-14 text-base sm:text-lg rounded-[16px] min-h-[48px]" 
                  size="lg"
                >
                  {loading ? "Sending Message..." : "Submit Project Inquiry"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

