"use client";

import { useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
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
      className="group relative flex items-start gap-4 sm:gap-5 overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-surface-1/50 backdrop-blur-sm p-4 sm:p-6 hover:shadow-2xl transition-all duration-500 w-full"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition duration-500 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(201, 169, 110, 0.08),
              transparent 80%
            )
          `,
        }}
      />
      <div className="absolute inset-0 border border-transparent group-hover:border-[var(--color-accent)]/20 rounded-[24px] transition-colors duration-500 pointer-events-none z-10" />

      <div className="relative z-20 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-surface-2 border border-[var(--color-border)] flex items-center justify-center text-text-secondary group-hover:bg-[var(--color-accent)]/10 group-hover:border-[var(--color-accent)]/30 group-hover:text-[var(--color-accent)] transition-all duration-500 group-hover:scale-105">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
      </div>
      <div className="relative z-20 flex flex-col justify-center min-h-[2.5rem] sm:min-h-[3rem] min-w-0">
        <h4 className="text-[11px] sm:text-xs font-bold text-text-primary mb-1 uppercase tracking-wider">{title}</h4>
        <div className="text-sm sm:text-base text-text-secondary group-hover:text-text-primary transition-colors leading-relaxed break-words font-medium">
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
    budgetRange: "₹1L - ₹5L",
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
        budgetRange: "₹1L - ₹5L",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-16 sm:py-24 md:py-32 bg-surface-1 border-t border-[var(--color-border)] overflow-hidden">
      {/* Subtle Background Elements matching theme */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-tr from-[var(--color-accent)]/5 to-transparent blur-[120px]" />
        <div className="absolute bottom-1/4 -left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-bl from-blue-500/5 to-transparent blur-[100px]" />
      </div>

      <div className="container-site relative z-10 w-full px-4 sm:px-6 md:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Contact Info */}
          <div ref={ref} className={`transition-all duration-[var(--transition-slow)] w-full max-w-xl mx-auto lg:mx-0 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-border)] bg-surface-1/50 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]"></span>
              </span>
              <span className="text-[11px] sm:text-xs uppercase tracking-widest text-text-secondary font-medium">Get in Touch</span>
            </div>
            
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight mb-4 sm:mb-6 leading-[1.04]">
              Let's build something <br />
              <span className="text-[var(--color-accent)] italic font-light">exceptional.</span>
            </h2>
            <p className="text-base sm:text-lg text-text-secondary mb-8 sm:mb-12 font-light leading-relaxed">
              Whether you have a fully documented spec or just a concept on a napkin, we're ready to engineer it into reality.
            </p>
            
            <div className="flex flex-col gap-3 sm:gap-4 w-full">
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
          <div className={`transition-all duration-[var(--transition-slow)] delay-300 w-full max-w-xl mx-auto lg:mx-0 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative group w-full">
              <form 
                className="relative bg-surface-1 border border-[var(--color-border)] rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-sm overflow-hidden w-full"
                onSubmit={handleSubmit}
              >
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">Start a Project</h3>
                  <p className="text-text-secondary text-sm">Fill out the form below and we'll get back to you within 24 hours.</p>
                </div>

                {success && (
                  <div className="mb-6 sm:mb-8 p-4 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Thank you! Your inquiry has been received. Our engineering lead will contact you soon.
                  </div>
                )}

                {error && (
                  <div className="mb-6 sm:mb-8 p-4 rounded-xl sm:rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5 w-full">
                  <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                    <label htmlFor="name" className="text-[10px] sm:text-[11px] font-bold text-text-secondary uppercase tracking-widest ml-1">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 sm:py-3.5 bg-surface-2 hover:bg-surface-2/80 border border-[var(--color-border)] rounded-xl text-text-primary text-sm sm:text-base placeholder-text-muted/60 focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all min-h-[48px]"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                    <label htmlFor="email" className="text-[10px] sm:text-[11px] font-bold text-text-secondary uppercase tracking-widest ml-1">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@company.com"
                      required
                      className="w-full px-4 py-3 sm:py-3.5 bg-surface-2 hover:bg-surface-2/80 border border-[var(--color-border)] rounded-xl text-text-primary text-sm sm:text-base placeholder-text-muted/60 focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all min-h-[48px]"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5 w-full">
                  <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                    <label htmlFor="project" className="text-[10px] sm:text-[11px] font-bold text-text-secondary uppercase tracking-widest ml-1">
                      Project Type
                    </label>
                    <CustomSelect
                      id="project"
                      value={formData.projectType}
                      onChange={(val) => setFormData({ ...formData, projectType: val })}
                      options={[
                        { value: "web", label: "Web Application" },
                        { value: "mobile", label: "Mobile App" },
                        { value: "erp", label: "ERP / SaaS System" },
                        { value: "ai", label: "AI Automation" },
                        { value: "other", label: "Other" },
                      ]}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
                    <label htmlFor="budget" className="text-[10px] sm:text-[11px] font-bold text-text-secondary uppercase tracking-widest ml-1">
                      Estimated Budget
                    </label>
                    <CustomSelect
                      id="budget"
                      value={formData.budgetRange}
                      onChange={(val) => setFormData({ ...formData, budgetRange: val })}
                      options={[
                        { value: "₹50k - ₹1L", label: "₹50k - ₹1L" },
                        { value: "₹1L - ₹5L", label: "₹1L - ₹5L" },
                        { value: "₹5L - ₹25L", label: "₹5L - ₹25L" },
                        { value: "₹25L+", label: "₹25L+" },
                        { value: "custom", label: "Custom Retainer" },
                      ]}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5 sm:gap-2 mb-6 sm:mb-8 w-full">
                  <label htmlFor="details" className="text-[10px] sm:text-[11px] font-bold text-text-secondary uppercase tracking-widest ml-1">
                    Project Details
                  </label>
                  <textarea 
                    id="details" 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your business goals, scope, and timeline..."
                    required
                    className="w-full px-4 py-3 sm:py-4 bg-surface-2 hover:bg-surface-2/80 border border-[var(--color-border)] rounded-xl text-text-primary text-sm sm:text-base placeholder-text-muted/60 focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full justify-center h-12 sm:h-14 text-sm sm:text-base rounded-full bg-text-primary text-white hover:bg-text-secondary" 
                  size="lg"
                >
                  {loading ? "Sending Message..." : "Submit Project Inquiry"}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

