import { cache } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import Service from "@/models/Service";
import Product from "@/models/Product";
import PortfolioItem from "@/models/Portfolio";
import TeamMember from "@/models/Team";
import Client from "@/models/Client";
import Testimonial from "@/models/Testimonial";
import FAQItem from "@/models/FAQ";
import PricingTier from "@/models/Pricing";
import Setting from "@/models/Setting";
import BlogPost from "@/models/Blog";
import LegalDocument from "@/models/LegalDocument";

/**
 * Safely serialize Mongoose lean documents into plain JSON objects for RSC boundary passing.
 */
function serialize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data));
}

export const getServicesData = cache(async () => {
  try {
    await connectToDatabase();
    const data = await Service.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return serialize(data || []);
  } catch (err) {
    console.error("Failed to fetch services data from DB:", err);
    return [];
  }
});

export const getProductsData = cache(async () => {
  try {
    await connectToDatabase();
    const data = await Product.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return serialize(data || []);
  } catch (err) {
    console.error("Failed to fetch products data from DB:", err);
    return [];
  }
});

export const getPortfolioData = cache(async () => {
  try {
    await connectToDatabase();
    const data = await PortfolioItem.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return serialize(data || []);
  } catch (err) {
    console.error("Failed to fetch portfolio data from DB:", err);
    return [];
  }
});

export const getTeamData = cache(async () => {
  try {
    await connectToDatabase();
    const data = await TeamMember.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return serialize(data || []);
  } catch (err) {
    console.error("Failed to fetch team data from DB:", err);
    return [];
  }
});

function generateClientSlug(name: string): string {
  return (name || "client")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const getClientsData = cache(async () => {
  try {
    await connectToDatabase();
    const data = await Client.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    
    if (data && data.length > 0) {
      const serialized = serialize(data);
      return serialized.map((client: any) => {
        const slug = client.slug || generateClientSlug(client.name);
        return {
          ...client,
          id: client._id?.toString() || client.id || slug,
          slug,
          servicesProvided: client.servicesProvided || [],
          keyAchievements: client.keyAchievements || [],
          technologies: client.technologies || [],
          erpModules: client.erpModules || [],
          seoServices: client.seoServices || [],
          erpTechnologyStack: client.erpTechnologyStack || null,
        };
      });
    }
  } catch (err) {
    console.error("Failed to fetch clients data from DB:", err);
  }
  return [];
});


export const getTestimonialsData = cache(async () => {
  try {
    await connectToDatabase();
    const data = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return serialize(data || []);
  } catch (err) {
    console.error("Failed to fetch testimonials data from DB:", err);
    return [];
  }
});

export const getFAQsData = cache(async () => {
  try {
    await connectToDatabase();
    const data = await FAQItem.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return serialize(data || []);
  } catch (err) {
    console.error("Failed to fetch FAQ data from DB:", err);
    return [];
  }
});

export const getPricingData = cache(async () => {
  try {
    await connectToDatabase();
    const data = await PricingTier.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return serialize(data || []);
  } catch (err) {
    console.error("Failed to fetch pricing data from DB:", err);
    return [];
  }
});

export const getSettingsData = cache(async () => {
  try {
    await connectToDatabase();
    const data = await Setting.findOne().lean();
    if (data) {
      return serialize(data);
    }
  } catch (err) {
    console.error("Failed to fetch settings data from DB:", err);
  }

  // Graceful fallback structure if DB has no settings configured yet
  return {
    siteName: "MARK Technologies",
    tagline: "We Build Digital Products That Scale",
    description: "A product-engineering agency that ships web apps, mobile apps, ERP/SaaS systems, and AI automation for startups and growing businesses.",
    contactEmail: "hello@mark2.in",
    contactPhone: "",
    address: "Mumbai, India & Global Remote",
    hero: {
      badge: "PRODUCT ENGINEERING AGENCY",
      headline: "We build digital products that scale.",
      subheadline: "From MVP to enterprise systems — we design, engineer, and ship high-performance web applications, mobile apps, and custom software.",
      ctaPrimaryText: "Start a Project",
      ctaPrimaryHref: "/contact",
      ctaSecondaryText: "Explore Work",
      ctaSecondaryHref: "/portfolio",
    },
    about: {
      subtitle: "MARK was founded with a single mission: to build scalable, maintainable software that solves real business problems. No shortcuts, no black boxes.",
      mission: "To empower businesses by building mission-critical software solutions with uncompromising engineering rigor.",
      vision: "To be the premier engineering partner for visionary founders and forward-thinking enterprises worldwide.",
      story: "Founded by engineers who spent years architecting high-traffic distributed systems, MARK was built on the belief that code quality and business velocity do not have to be trade-offs.",
    },
    stats: [],
    whyChooseUs: [],
    processSteps: [],
    technologies: [],
    socialLinks: {
      linkedin: "https://www.linkedin.com/company/mark2-technologies",
      github: "https://github.com/aadityaexe/mark",
      twitter: "https://x.com/mark2_in",
    },
    footer: {
      copyrightText: "© 2025 MARK Technologies. All rights reserved.",
      disclaimer: "Engineered with precision for global teams.",
    },
  };
});

export const getBlogsData = cache(async () => {
  try {
    await connectToDatabase();
    const data = await BlogPost.find({ status: "published" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();
    return serialize(data || []);
  } catch (err) {
    console.error("Failed to fetch blog data from DB:", err);
    return [];
  }
});

export const getServiceBySlug = cache(async (slug: string) => {
  try {
    await connectToDatabase();
    const data = await Service.findOne({ slug, isActive: true }).lean();
    return serialize(data);
  } catch (err) {
    console.error(`Failed to fetch service for slug ${slug} from DB:`, err);
    return null;
  }
});

export const getProductBySlug = cache(async (slug: string) => {
  try {
    await connectToDatabase();
    const data = await Product.findOne({ slug, isActive: true }).lean();
    return serialize(data);
  } catch (err) {
    console.error(`Failed to fetch product for slug ${slug} from DB:`, err);
    return null;
  }
});

export const getPortfolioBySlug = cache(async (slug: string) => {
  try {
    await connectToDatabase();
    const data = await PortfolioItem.findOne({ slug, isActive: true }).lean();
    return serialize(data);
  } catch (err) {
    console.error(`Failed to fetch portfolio for slug ${slug} from DB:`, err);
    return null;
  }
});

export const getRelatedPortfolioForService = cache(async (serviceSlug: string, limit = 3) => {
  try {
    await connectToDatabase();
    let items = await PortfolioItem.find({
      isActive: true,
      $or: [
        { relatedServiceSlugs: serviceSlug },
        { "techStack": { $regex: new RegExp(serviceSlug.replace("-", " "), "i") } },
      ],
    })
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    if (!items || items.length === 0) {
      items = await PortfolioItem.find({ isActive: true })
        .sort({ isFeatured: -1, order: 1 })
        .limit(limit)
        .lean();
    }

    return serialize(items || []);
  } catch (err) {
    console.error(`Failed to fetch related portfolio for service ${serviceSlug}:`, err);
    return [];
  }
});

export const getRelatedPortfolioItems = cache(async (currentSlug: string, category?: string, limit = 3) => {
  try {
    await connectToDatabase();
    const query: Record<string, unknown> = { slug: { $ne: currentSlug }, isActive: true };
    if (category) {
      query.category = category;
    }

    let items = await PortfolioItem.find(query)
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    if (items.length < limit) {
      const moreItems = await PortfolioItem.find({
        slug: { $nin: [currentSlug, ...items.map((i: any) => i.slug)] },
        isActive: true,
      })
        .sort({ isFeatured: -1, order: 1 })
        .limit(limit - items.length)
        .lean();

      items = [...items, ...moreItems];
    }

    return serialize(items || []);
  } catch (err) {
    console.error(`Failed to fetch related portfolio items for ${currentSlug}:`, err);
    return [];
  }
});

export const getServicesBySlugs = cache(async (slugs: string[]) => {
  if (!slugs || slugs.length === 0) return [];
  try {
    await connectToDatabase();
    const data = await Service.find({ slug: { $in: slugs }, isActive: true })
      .sort({ order: 1 })
      .lean();
    return serialize(data || []);
  } catch (err) {
    console.error("Failed to fetch services by slugs:", err);
    return [];
  }
});

export const getTeamMemberBySlug = cache(async (slug: string) => {
  try {
    await connectToDatabase();
    const data = await TeamMember.findOne({ slug, isActive: true }).lean();
    return serialize(data);
  } catch (err) {
    console.error(`Failed to fetch team member for slug ${slug} from DB:`, err);
    return null;
  }
});

export const getBlogBySlug = cache(async (slug: string) => {
  try {
    await connectToDatabase();
    const data = await BlogPost.findOne({ slug, status: "published" }).lean();
    return serialize(data);
  } catch (err) {
    console.error(`Failed to fetch blog for slug ${slug} from DB:`, err);
    return null;
  }
});

export const getClientBySlug = cache(async (slug: string) => {
  try {
    await connectToDatabase();
    let client = await Client.findOne({ slug, isActive: true }).lean();
    if (!client) {
      const all = await Client.find({ isActive: true }).lean();
      client = all.find((c: any) => (c.slug || generateClientSlug(c.name)) === slug);
    }
    if (client) {
      const serialized = serialize(client);
      const computedSlug = serialized.slug || generateClientSlug(serialized.name);
      return {
        ...serialized,
        id: serialized._id?.toString() || serialized.id || computedSlug,
        slug: computedSlug,
        servicesProvided: serialized.servicesProvided || [],
        keyAchievements: serialized.keyAchievements || [],
        technologies: serialized.technologies || [],
        erpModules: serialized.erpModules || [],
        seoServices: serialized.seoServices || [],
        erpTechnologyStack: serialized.erpTechnologyStack || null,
      };
    }
  } catch (err) {
    console.error(`Failed to fetch client for slug ${slug} from DB:`, err);
  }

  return null;
});

export const defaultPrivacyDocument = {
  type: "privacy" as const,
  title: "Privacy Policy",
  subtitle: "Last updated: September 2026. How we collect, safeguard, and respect your data.",
  badge: "Legal & Security",
  lastUpdated: "September 2026",
  contactEmail: "hello@mark2.in",
  sections: [
    {
      title: "1. Overview & Commitment",
      content:
        "MARK Technologies (\"MARK\", \"we\", \"us\", or \"our\") provides product-engineering, software architecture, and custom application development services. We respect your personal data and maintain strict technical and operational controls to protect client information, project codebases, and visitor data.",
      order: 1,
    },
    {
      title: "2. Information We Collect",
      content:
        "When you interact with our website or enter an engineering contract, we may collect: Contact Information (name, work email address, phone number, and company name provided via our inquiry forms), Project Specifications (technical scopes, architectural diagrams, and NDA-protected business criteria), and Technical Logs (IP address, browser type, device information, and interaction metrics collected automatically via secure server logs for operational security).",
      order: 2,
    },
    {
      title: "3. How We Use Information",
      content:
        "We use your information solely to evaluate project requirements, prepare proposals, and deliver software engineering services, communicate regarding ongoing architectural sprints and releases, and comply with regulatory obligations and maintain cybersecurity defense against unauthorized access. We never sell, rent, or monetize your personal or commercial data.",
      order: 3,
    },
    {
      title: "4. Intellectual Property & Confidentiality",
      content:
        "All client codebases, architectures, and intellectual property developed under engagement contracts remain the sole property of our clients as specified in individual Master Services Agreements (MSA). Non-disclosure agreements (NDAs) are executed prior to reviewing proprietary source materials.",
      order: 4,
    },
    {
      title: "5. Data Retention & Security",
      content:
        "We implement industry-standard encryption in transit (TLS 1.3) and at rest (AES-256), least-privilege role-based access control (RBAC), and continuous threat monitoring. Client data is retained strictly as long as necessary to fulfill contractual commitments.",
      order: 5,
    },
    {
      title: "6. Contact Our Security & Legal Team",
      content:
        "For questions regarding this Privacy Policy or to request deletion of your information, reach out to our team at hello@mark2.in.",
      order: 6,
    },
  ],
};

export const defaultTermsDocument = {
  type: "terms" as const,
  title: "Terms & Conditions",
  subtitle: "Last updated: September 2026. Legal framework governing our client partnerships, contracts, and engineering deliverables.",
  badge: "Legal & Contracts",
  lastUpdated: "September 2026",
  contactEmail: "hello@mark2.in",
  sections: [
    {
      title: "1. Engagement Framework",
      content:
        "By accessing our website or retaining MARK Technologies (\"MARK\", \"we\", \"us\") for custom software engineering, cloud architecture, or digital product development, you agree to comply with and be bound by these Terms of Service in conjunction with applicable Statements of Work (SOW) or Master Services Agreements (MSA).",
      order: 1,
    },
    {
      title: "2. Engineering Services & Deliverables",
      content:
        "MARK provides specialized software development including web applications, native mobile applications, enterprise ERP/CRM platforms, and AI automation systems. Specific deliverables, milestone schedules, acceptance criteria, and warranties are defined in individual project SOWs signed by both parties.",
      order: 2,
    },
    {
      title: "3. Intellectual Property Assignment",
      content:
        "Upon receipt of full payment for contracted milestones, all custom source code, documentation, UI designs, and database architectures created specifically for the client are assigned exclusively to the client. MARK retains ownership of general developer utilities, open-source dependencies, and reusable framework components.",
      order: 3,
    },
    {
      title: "4. Client Responsibilities & Collaboration",
      content:
        "Successful project delivery requires timely access to project stakeholders, third-party API credentials, domain configurations, and prompt milestone review. Delays caused by third-party vendor downtime or pending approvals may adjust estimated release timelines.",
      order: 4,
    },
    {
      title: "5. Confidentiality & Non-Disclosure",
      content:
        "Both parties agree to treat all business data, technical architecture blueprints, pricing schedules, and proprietary source code as strictly confidential. This obligation survives the completion or termination of any active service agreement.",
      order: 5,
    },
    {
      title: "6. Governing Law & Inquiries",
      content:
        "These terms are governed by and construed in accordance with applicable corporate and commercial law. For contractual or legal inquiries, please contact our legal operations team at hello@mark2.in.",
      order: 6,
    },
  ],
};

export const getLegalDocument = cache(async (type: "privacy" | "terms") => {
  const fallback = type === "privacy" ? defaultPrivacyDocument : defaultTermsDocument;
  try {
    await connectToDatabase();
    let doc = await LegalDocument.findOne({ type }).lean();
    if (!doc) {
      // Auto-initialize in database if not present
      const created = await LegalDocument.create(fallback);
      return serialize(created.toObject ? created.toObject() : created);
    }
    return serialize(doc);
  } catch (err) {
    console.error(`Failed to fetch ${type} legal document from DB:`, err);
    return fallback;
  }
});

