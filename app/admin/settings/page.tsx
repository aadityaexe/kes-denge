"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";
import { FormField } from "@/components/admin/FormField";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Save, Globe, Info, Share2, Layout, Search, Sliders, Plus, Trash2 } from "lucide-react";

export default function SettingsAdminPage() {
  const [activeTab, setActiveTab] = useState<"general" | "hero" | "about" | "sections" | "social" | "seo" | "footer">("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    siteName: "MARK Technologies",
    tagline: "We Build Digital Products That Scale",
    description: "A product-engineering agency that ships web apps, mobile apps, ERP/SaaS systems, and AI automation.",
    logoUrl: "",
    faviconUrl: "",
    contactEmail: "hello@mark2.in",
    contactPhone: "",
    address: "Mumbai, India & Global Remote",
    googleMapsUrl: "",
    socialLinks: {
      linkedin: "https://www.linkedin.com/company/mark2-technologies",
      github: "https://github.com/aadityaexe/kes-denge",
      twitter: "https://x.com/mark2_in",
      instagram: "",
      facebook: "",
    },
    hero: {
      badge: "PRODUCT ENGINEERING AGENCY",
      headline: "We build digital products that scale.",
      subheadline:
        "From MVP to enterprise systems — we design, engineer, and ship high-performance web applications, mobile apps, and custom software.",
      ctaPrimaryText: "Start a Project",
      ctaPrimaryHref: "/contact",
      ctaSecondaryText: "Explore Work",
      ctaSecondaryHref: "/portfolio",
    },
    about: {
      subtitle:
        "MARK was founded with a single mission: to build scalable, maintainable software that solves real business problems. No shortcuts, no black boxes.",
      mission:
        "To empower businesses by building mission-critical software solutions with uncompromising engineering rigor.",
      vision:
        "To be the premier engineering partner for visionary founders and forward-thinking enterprises worldwide.",
      story:
        "Founded by engineers who spent years architecting high-traffic distributed systems, MARK was built on the belief that code quality and business velocity do not have to be trade-offs.",
    },
    seo: {
      defaultTitle: "MARK Technologies — We Build Digital Products That Scale",
      defaultDescription:
        "A product-engineering agency that ships web apps, mobile apps, ERP/SaaS systems, and AI automation for startups and growing businesses.",
      keywords: ["web development", "react", "nextjs", "mobile apps", "custom software"],
      ogImageUrl: "",
    },
    footer: {
      copyrightText: "© 2025 MARK Technologies. All rights reserved.",
      disclaimer: "Engineered with precision for global teams.",
    },
    stats: [
      { label: "Projects Shipped", value: 150, suffix: "+" },
      { label: "Happy Clients", value: 85, suffix: "+" },
      { label: "Satisfaction Rate", value: 98, suffix: "%" },
      { label: "Years Experience", value: 6, suffix: "+" },
    ],
    whyChooseUs: [
      { title: "Zero Technical Debt", description: "Clean modular code built with strict types.", icon: "Code2" },
    ],
    processSteps: [
      { number: 1, title: "Discovery", description: "Architectural blueprint and data modeling.", icon: "Search" },
    ],
    technologies: [
      { name: "Next.js", icon: "", category: "frontend" },
    ],
  });

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (res.ok && data.settings) {
        setFormData((prev) => ({
          ...prev,
          ...data.settings,
          socialLinks: { ...prev.socialLinks, ...(data.settings.socialLinks || {}) },
          hero: { ...prev.hero, ...(data.settings.hero || {}) },
          about: { ...prev.about, ...(data.settings.about || {}) },
          seo: { ...prev.seo, ...(data.settings.seo || {}) },
          footer: { ...prev.footer, ...(data.settings.footer || {}) },
          stats: Array.isArray(data.settings.stats) && data.settings.stats.length > 0 ? data.settings.stats : prev.stats,
          whyChooseUs: Array.isArray(data.settings.whyChooseUs) && data.settings.whyChooseUs.length > 0 ? data.settings.whyChooseUs : prev.whyChooseUs,
          processSteps: Array.isArray(data.settings.processSteps) && data.settings.processSteps.length > 0 ? data.settings.processSteps : prev.processSteps,
          technologies: Array.isArray(data.settings.technologies) && data.settings.technologies.length > 0 ? data.settings.technologies : prev.technologies,
        }));
      }
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(data.error || "Failed to update settings");
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "General & Contact", icon: Globe },
    { id: "hero", label: "Hero Banner", icon: Layout },
    { id: "about", label: "About Page", icon: Info },
    { id: "sections", label: "Sections & Metrics", icon: Sliders },
    { id: "social", label: "Social Profiles", icon: Share2 },
    { id: "seo", label: "SEO & OpenGraph", icon: Search },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Website Settings & CMS"
        description="Configure dynamic website titles, hero texts, mission statements, contact info, and SEO"
        onRefresh={fetchSettings}
        isLoading={isLoading}
      />

      <div className="p-6 sm:p-8 max-w-5xl space-y-6">
        {saveSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Website settings updated successfully! Public pages will reflect changes immediately.</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-surface-1 text-text-primary border border-[var(--color-border)] shadow-sm"
                    : "text-text-muted hover:text-text-primary hover:bg-surface-1/50"
                }`}
              >
                <Icon size={15} className={isActive ? "text-[var(--color-accent-dark)]" : ""} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSave} className="bg-surface-1 border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* 1. General & Contact Settings */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary pb-2 border-b border-[var(--color-border)]">
                General Company Info
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Website Name"
                  tooltip="Brand title displayed in browser tab titles, header logos, and legal copyright."
                >
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <FormField
                  label="Tagline"
                  tooltip="Brand motto used in search snippets and hero sub-lines."
                >
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>
              </div>

              <FormField
                label="Company Description"
                tooltip="Primary elevator pitch rendered in footer and social embeds."
              >
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </FormField>

              <h3 className="text-sm font-bold text-text-primary pt-4 pb-2 border-b border-[var(--color-border)]">
                Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Public Contact Email"
                  tooltip="The inbound destination email for client leads from contact forms and footer links."
                >
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <FormField
                  label="Contact Phone Number"
                  tooltip="Direct contact line shown in header and contact inquiry cards."
                >
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>
              </div>

              <FormField
                label="Office / Headquarters Address"
                tooltip="Physical location or remote hub rendered in footer and /contact page."
              >
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </FormField>
            </div>
          )}

          {/* 2. Hero Section Customizer */}
          {activeTab === "hero" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary pb-2 border-b border-[var(--color-border)]">
                Homepage Hero Section
              </h3>

              <FormField
                label="Top Eyebrow Badge"
                tooltip="Pill badge rendered directly above the primary hero headline on the homepage."
              >
                <input
                  type="text"
                  value={formData.hero.badge}
                  onChange={(e) =>
                    setFormData({ ...formData, hero: { ...formData.hero, badge: e.target.value } })
                  }
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </FormField>

              <FormField
                label="Main Headline"
                tooltip="Primary H1 hero statement on the homepage with high-contrast typography."
              >
                <input
                  type="text"
                  value={formData.hero.headline}
                  onChange={(e) =>
                    setFormData({ ...formData, hero: { ...formData.hero, headline: e.target.value } })
                  }
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary font-display text-base font-bold focus:outline-none focus:border-[var(--color-accent)]"
                />
              </FormField>

              <FormField
                label="Subheadline / Paragraph Copy"
                tooltip="Sub-hero explanatory paragraph driving visitors to explore case studies or contact."
              >
                <textarea
                  rows={3}
                  value={formData.hero.subheadline}
                  onChange={(e) =>
                    setFormData({ ...formData, hero: { ...formData.hero, subheadline: e.target.value } })
                  }
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-surface-2 rounded-xl border border-[var(--color-border)] space-y-2">
                  <span className="text-[11px] font-bold text-text-primary uppercase block">Primary CTA Button</span>
                  <input
                    type="text"
                    placeholder="Text"
                    value={formData.hero.ctaPrimaryText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, ctaPrimaryText: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Link (e.g. /contact)"
                    value={formData.hero.ctaPrimaryHref}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, ctaPrimaryHref: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-md font-mono"
                  />
                </div>

                <div className="p-3 bg-surface-2 rounded-xl border border-[var(--color-border)] space-y-2">
                  <span className="text-[11px] font-bold text-text-primary uppercase block">Secondary CTA Button</span>
                  <input
                    type="text"
                    placeholder="Text"
                    value={formData.hero.ctaSecondaryText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, ctaSecondaryText: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Link (e.g. /portfolio)"
                    value={formData.hero.ctaSecondaryHref}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, ctaSecondaryHref: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-surface-1 border border-[var(--color-border)] rounded-md font-mono"
                  />
                </div>
              </div>

              {/* Stats Counters */}
              <div className="pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                      Hero Stats Counters
                    </h4>
                    <p className="text-[11px] text-text-muted">
                      Configure the live metrics displayed on the homepage hero section.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        stats: [
                          ...formData.stats,
                          { label: "New Metric", value: 10, suffix: "+" },
                        ],
                      });
                    }}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
                  >
                    + Add Stat
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.stats.map((stat, sIndex) => (
                    <div
                      key={sIndex}
                      className="p-3 bg-surface-2 rounded-xl border border-[var(--color-border)] flex flex-col gap-2 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-text-muted uppercase">
                          Stat #{sIndex + 1}
                        </span>
                        {formData.stats.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.stats.filter((_, idx) => idx !== sIndex);
                              setFormData({ ...formData, stats: updated });
                            }}
                            className="text-[10px] text-rose-500 hover:text-rose-600 font-bold"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-text-secondary uppercase mb-0.5">Value (Number)</label>
                          <input
                            type="number"
                            value={stat.value}
                            onChange={(e) => {
                              const updated = [...formData.stats];
                              updated[sIndex] = { ...updated[sIndex], value: Number(e.target.value) || 0 };
                              setFormData({ ...formData, stats: updated });
                            }}
                            className="w-full px-2 py-1 text-xs bg-surface-1 border border-[var(--color-border)] rounded-md font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-text-secondary uppercase mb-0.5">Suffix (e.g. +, %)</label>
                          <input
                            type="text"
                            value={stat.suffix}
                            onChange={(e) => {
                              const updated = [...formData.stats];
                              updated[sIndex] = { ...updated[sIndex], suffix: e.target.value };
                              setFormData({ ...formData, stats: updated });
                            }}
                            className="w-full px-2 py-1 text-xs bg-surface-1 border border-[var(--color-border)] rounded-md"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-text-secondary uppercase mb-0.5">Label</label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const updated = [...formData.stats];
                            updated[sIndex] = { ...updated[sIndex], label: e.target.value };
                            setFormData({ ...formData, stats: updated });
                          }}
                          placeholder="e.g. Projects Shipped"
                          className="w-full px-2 py-1 text-xs bg-surface-1 border border-[var(--color-border)] rounded-md"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. About Page Copy */}
          {activeTab === "about" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary pb-2 border-b border-[var(--color-border)]">
                About Us Page Content
              </h3>

              <FormField
                label="Page Subtitle / Mission Statement"
                tooltip="Introductory headline statement displayed at the top of the /about page."
              >
                <textarea
                  rows={2}
                  value={formData.about.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, about: { ...formData.about, subtitle: e.target.value } })
                  }
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Our Mission"
                  tooltip="Our Mission statement card displayed on the /about page."
                >
                  <textarea
                    rows={4}
                    value={formData.about.mission}
                    onChange={(e) =>
                      setFormData({ ...formData, about: { ...formData.about, mission: e.target.value } })
                    }
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>

                <FormField
                  label="Our Vision"
                  tooltip="Our Vision statement card displayed on the /about page."
                >
                  <textarea
                    rows={4}
                    value={formData.about.vision}
                    onChange={(e) =>
                      setFormData({ ...formData, about: { ...formData.about, vision: e.target.value } })
                    }
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </FormField>
              </div>

              <FormField
                label="Our Founding Story"
                tooltip="Founding story narrative detailing company origin, engineering pedigree, and philosophy."
              >
                <textarea
                  rows={4}
                  value={formData.about.story}
                  onChange={(e) =>
                    setFormData({ ...formData, about: { ...formData.about, story: e.target.value } })
                  }
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </FormField>
            </div>
          )}

          {/* 3.5. Sections & Metrics (Dynamic Database-Backed Site Content) */}
          {activeTab === "sections" && (
            <div className="space-y-8">
              {/* Dynamic Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">Hero & Company Statistics</h3>
                    <p className="text-[11px] text-text-muted">Dynamic metric counters displayed in hero and about sections.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        stats: [...formData.stats, { label: "New Stat", value: 100, suffix: "+" }],
                      })
                    }
                    className="text-xs font-semibold text-[var(--color-accent-dark)] hover:underline flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Metric
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-surface-2 border border-[var(--color-border)] rounded-lg">
                      <input
                        type="text"
                        placeholder="Label"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...formData.stats];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setFormData({ ...formData, stats: updated });
                        }}
                        className="flex-1 px-2 py-1 text-xs bg-surface-1 border border-[var(--color-border)] rounded text-text-primary"
                      />
                      <input
                        type="number"
                        placeholder="Value"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...formData.stats];
                          updated[idx] = { ...updated[idx], value: Number(e.target.value) };
                          setFormData({ ...formData, stats: updated });
                        }}
                        className="w-20 px-2 py-1 text-xs bg-surface-1 border border-[var(--color-border)] rounded text-text-primary"
                      />
                      <input
                        type="text"
                        placeholder="Suffix"
                        value={stat.suffix}
                        onChange={(e) => {
                          const updated = [...formData.stats];
                          updated[idx] = { ...updated[idx], suffix: e.target.value };
                          setFormData({ ...formData, stats: updated });
                        }}
                        className="w-14 px-2 py-1 text-xs bg-surface-1 border border-[var(--color-border)] rounded text-text-primary text-center"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.stats.filter((_, i) => i !== idx);
                          setFormData({ ...formData, stats: updated });
                        }}
                        className="p-1 text-text-muted hover:text-red-500"
                        title="Remove Stat"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us Items */}
              <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">Why Choose Us Capabilities</h3>
                    <p className="text-[11px] text-text-muted">Engineering differentiators rendered on home and about pages.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        whyChooseUs: [
                          ...formData.whyChooseUs,
                          { title: "New Feature", description: "Description of capability", icon: "Zap" },
                        ],
                      })
                    }
                    className="text-xs font-semibold text-[var(--color-accent-dark)] hover:underline flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Feature
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {formData.whyChooseUs.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-surface-2 border border-[var(--color-border)] rounded-lg">
                      <input
                        type="text"
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...formData.whyChooseUs];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setFormData({ ...formData, whyChooseUs: updated });
                        }}
                        className="w-1/3 px-2 py-1 text-xs bg-surface-1 border border-[var(--color-border)] rounded text-text-primary font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...formData.whyChooseUs];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setFormData({ ...formData, whyChooseUs: updated });
                        }}
                        className="flex-1 px-2 py-1 text-xs bg-surface-1 border border-[var(--color-border)] rounded text-text-primary"
                      />
                      <input
                        type="text"
                        placeholder="Icon"
                        value={item.icon}
                        onChange={(e) => {
                          const updated = [...formData.whyChooseUs];
                          updated[idx] = { ...updated[idx], icon: e.target.value };
                          setFormData({ ...formData, whyChooseUs: updated });
                        }}
                        className="w-24 px-2 py-1 text-xs bg-surface-1 border border-[var(--color-border)] rounded text-text-primary font-mono text-center"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.whyChooseUs.filter((_, i) => i !== idx);
                          setFormData({ ...formData, whyChooseUs: updated });
                        }}
                        className="p-1 text-text-muted hover:text-red-500"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process Steps */}
              <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">How We Build Process Steps</h3>
                    <p className="text-[11px] text-text-muted">Workflow timeline steps displayed across the site.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        processSteps: [
                          ...formData.processSteps,
                          {
                            number: formData.processSteps.length + 1,
                            title: "New Step",
                            description: "Process step details",
                            icon: "Code2",
                          },
                        ],
                      })
                    }
                    className="text-xs font-semibold text-[var(--color-accent-dark)] hover:underline flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Step
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {formData.processSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-surface-2 border border-[var(--color-border)] rounded-lg">
                      <input
                        type="number"
                        placeholder="#"
                        value={step.number}
                        onChange={(e) => {
                          const updated = [...formData.processSteps];
                          updated[idx] = { ...updated[idx], number: Number(e.target.value) };
                          setFormData({ ...formData, processSteps: updated });
                        }}
                        className="w-12 px-2 py-1 text-xs bg-surface-1 border border-[var(--color-border)] rounded text-text-primary text-center font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Title"
                        value={step.title}
                        onChange={(e) => {
                          const updated = [...formData.processSteps];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setFormData({ ...formData, processSteps: updated });
                        }}
                        className="w-1/3 px-2 py-1 text-xs bg-surface-1 border border-[var(--color-border)] rounded text-text-primary font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={step.description}
                        onChange={(e) => {
                          const updated = [...formData.processSteps];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setFormData({ ...formData, processSteps: updated });
                        }}
                        className="flex-1 px-2 py-1 text-xs bg-surface-1 border border-[var(--color-border)] rounded text-text-primary"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.processSteps.filter((_, i) => i !== idx);
                          setFormData({ ...formData, processSteps: updated });
                        }}
                        className="p-1 text-text-muted hover:text-red-500"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">Core Technology Stack</h3>
                    <p className="text-[11px] text-text-muted">Technologies and frameworks categorized for the Tech Stack section.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        technologies: [
                          ...formData.technologies,
                          { name: "New Tech", icon: "", category: "frontend" },
                        ],
                      })
                    }
                    className="text-xs font-semibold text-[var(--color-accent-dark)] hover:underline flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Tech
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {formData.technologies.map((tech, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-surface-2 border border-[var(--color-border)] rounded-lg">
                      <input
                        type="text"
                        placeholder="Tech Name (e.g. Next.js)"
                        value={tech.name}
                        onChange={(e) => {
                          const updated = [...formData.technologies];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setFormData({ ...formData, technologies: updated });
                        }}
                        className="flex-1 px-2 py-1 text-xs bg-surface-1 border border-[var(--color-border)] rounded text-text-primary"
                      />
                      <select
                        value={tech.category}
                        onChange={(e) => {
                          const updated = [...formData.technologies];
                          updated[idx] = { ...updated[idx], category: e.target.value as any };
                          setFormData({ ...formData, technologies: updated });
                        }}
                        className="w-28 px-2 py-1 text-xs bg-surface-1 border border-[var(--color-border)] rounded text-text-primary"
                      >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">Database</option>
                        <option value="devops">DevOps</option>
                        <option value="mobile">Mobile</option>
                        <option value="language">Language</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.technologies.filter((_, i) => i !== idx);
                          setFormData({ ...formData, technologies: updated });
                        }}
                        className="p-1 text-text-muted hover:text-red-500"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. Social Links */}
          {activeTab === "social" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary pb-2 border-b border-[var(--color-border)]">
                Social Media Profiles
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                      })
                    }
                    placeholder="https://linkedin.com/company/..."
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, github: e.target.value },
                      })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                    Twitter / X
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                      })
                    }
                    placeholder="https://twitter.com/..."
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1 uppercase tracking-wider">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary font-mono focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. SEO Defaults */}
          {activeTab === "seo" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary pb-2 border-b border-[var(--color-border)]">
                Global SEO & Meta Defaults
              </h3>

              <FormField
                label="Default Meta Title"
                tooltip="Global fallback title tag for search engines and browser tabs."
                charCount={{ current: formData.seo.defaultTitle.length, optimal: { min: 40, max: 65 }, max: 80 }}
              >
                <input
                  type="text"
                  value={formData.seo.defaultTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, seo: { ...formData.seo, defaultTitle: e.target.value } })
                  }
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </FormField>

              <FormField
                label="Default Meta Description"
                tooltip="Global fallback description snippet in Google search results (120-160 chars recommended)."
                charCount={{ current: formData.seo.defaultDescription.length, optimal: { min: 120, max: 160 }, max: 200 }}
              >
                <textarea
                  rows={3}
                  value={formData.seo.defaultDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, defaultDescription: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary focus:outline-none focus:border-[var(--color-accent)]"
                />
              </FormField>

              <ImageUploadInput
                label="Open Graph Image (Social Sharing Banner)"
                value={formData.seo.ogImageUrl || ""}
                onChange={(url) =>
                  setFormData({ ...formData, seo: { ...formData.seo, ogImageUrl: url } })
                }
                helperText="Primary social card banner displayed on Twitter, LinkedIn, and Facebook previews."
                recommendedDimension="1200x630px (16:9 / OG)"
              />
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-[var(--color-border)]">
            <Button type="submit" disabled={isSaving} className="flex items-center gap-2 text-xs font-semibold">
              <Save size={15} />
              <span>{isSaving ? "Saving Changes..." : "Save All Settings"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
