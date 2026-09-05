import mongoose, { Schema, Document } from "mongoose";

export interface ISetting extends Document {
  siteName: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  faviconUrl?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  googleMapsUrl?: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    ctaPrimaryText: string;
    ctaPrimaryHref: string;
    ctaSecondaryText: string;
    ctaSecondaryHref: string;
  };
  about: {
    subtitle: string;
    mission: string;
    vision: string;
    story: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
    ogImageUrl?: string;
  };
  stats?: Array<{
    label: string;
    value: number;
    suffix: string;
  }>;
  whyChooseUs?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  processSteps?: Array<{
    number: number;
    title: string;
    description: string;
    icon: string;
  }>;
  technologies?: Array<{
    name: string;
    icon: string;
    category: "frontend" | "backend" | "database" | "devops" | "mobile" | "language";
  }>;
  footer: {
    copyrightText: string;
    disclaimer?: string;
  };
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    siteName: { type: String, default: "MARK Technologies" },
    tagline: { type: String, default: "We Build Digital Products That Scale" },
    description: {
      type: String,
      default:
        "A product-engineering agency that ships web apps, mobile apps, ERP/SaaS systems, and AI automation for startups and growing businesses.",
    },
    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },
    contactEmail: { type: String, default: "hello@mark2.in" },
    contactPhone: { type: String, default: "" },
    address: { type: String, default: "Mumbai, India & Global Remote" },
    googleMapsUrl: { type: String, default: "" },
    socialLinks: {
      linkedin: { type: String, default: "https://www.linkedin.com/company/mark2-technologies" },
      github: { type: String, default: "https://github.com/aadityaexe/mark" },
      twitter: { type: String, default: "https://x.com/mark2_in" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
    hero: {
      badge: { type: String, default: "PRODUCT ENGINEERING AGENCY" },
      headline: { type: String, default: "We build digital products that scale." },
      subheadline: {
        type: String,
        default:
          "From MVP to enterprise systems — we design, engineer, and ship high-performance web applications, mobile apps, and custom software.",
      },
      ctaPrimaryText: { type: String, default: "Start a Project" },
      ctaPrimaryHref: { type: String, default: "/contact" },
      ctaSecondaryText: { type: String, default: "Explore Work" },
      ctaSecondaryHref: { type: String, default: "/portfolio" },
    },
    about: {
      subtitle: {
        type: String,
        default:
          "MARK was founded with a single mission: to build scalable, maintainable software that solves real business problems. No shortcuts, no black boxes.",
      },
      mission: {
        type: String,
        default:
          "To empower businesses by building mission-critical software solutions with uncompromising engineering rigor.",
      },
      vision: {
        type: String,
        default:
          "To be the premier engineering partner for visionary founders and forward-thinking enterprises worldwide.",
      },
      story: {
        type: String,
        default:
          "Founded by engineers who spent years architecting high-traffic distributed systems, MARK was built on the belief that code quality and business velocity do not have to be trade-offs.",
      },
    },
    seo: {
      defaultTitle: { type: String, default: "MARK Technologies — We Build Digital Products That Scale" },
      defaultDescription: {
        type: String,
        default:
          "A product-engineering agency that ships web apps, mobile apps, ERP/SaaS systems, and AI automation for startups and growing businesses.",
      },
      keywords: [{ type: String }],
      ogImageUrl: { type: String, default: "" },
    },
    stats: [
      {
        label: { type: String, required: true },
        value: { type: Number, required: true },
        suffix: { type: String, default: "+" },
      },
    ],
    whyChooseUs: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
      },
    ],
    processSteps: [
      {
        number: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
      },
    ],
    technologies: [
      {
        name: { type: String, required: true },
        icon: { type: String, default: "" },
        category: { type: String, required: true },
      },
    ],
    footer: {
      copyrightText: { type: String, default: "© 2025 MARK Technologies. All rights reserved." },
      disclaimer: { type: String, default: "Engineered with precision for global teams." },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);
