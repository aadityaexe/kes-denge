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

export const FALLBACK_CLIENTS = [
  {
    id: "client-finflow",
    name: "FinFlow Labs",
    slug: "finflow-labs",
    industry: "Fintech & Banking",
    logoUrl: "",
    website: "https://finflow.example.com",
    tagline: "Autonomous financial reconciliation and real-time ledger intelligence.",
    description: "FinFlow is an institutional financial technology platform processing over $4B in cross-border reconciliations for multi-currency neo-banks and asset managers.",
    aboutPartnership: "MARK designed and built the high-throughput distributed transaction pipeline and audit console, handling 2,500+ requests per second with sub-10ms ledger guarantees and multi-tenant bank isolation.",
    servicesProvided: ["High-Throughput APIs", "Cloud Infrastructure", "Full-Stack Web App", "Security Auditing"],
    partnershipYear: "2023 - Present",
    companySize: "150+ Employees",
    location: "San Francisco, CA",
    keyAchievements: [
      "Scaled transaction engine to 2.5M daily ops",
      "Sub-10ms ledger confirmation SLA across regions",
      "Zero-downtime database migration for 12 enterprise banks",
    ],
    technologies: ["Next.js", "TypeScript", "Go", "PostgreSQL", "Kafka", "AWS"],
    caseStudySlug: "finflow-core",
    testimonialQuote: "MARK engineered our core reconciliation engine from scratch. Their systems engineering capability and attention to detail is unmatched.",
    testimonialAuthor: "David Vance",
    testimonialRole: "Chief Technology Officer, FinFlow Labs",
    isFeatured: true,
    isActive: true,
    order: 1,
  },
  {
    id: "client-horizon",
    name: "Horizon Cloud",
    slug: "horizon-cloud",
    industry: "Enterprise Cloud & DevOps",
    logoUrl: "",
    website: "https://horizoncloud.example.com",
    tagline: "Intelligent multi-cloud telemetry and automated Kubernetes orchestration.",
    description: "Horizon Cloud delivers centralized observability, telemetry pipelines, and automated policy compliance across AWS, GCP, and on-premises infrastructure.",
    aboutPartnership: "MARK partnered with Horizon Cloud's core platform team to engineer an ultra-responsive metrics visualizer, real-time alerting system, and developer dashboard that processes millions of log events per second.",
    servicesProvided: ["Observability UI", "Distributed Systems", "Kubernetes Management", "Telemetry Pipelines"],
    partnershipYear: "2023 - Present",
    companySize: "300+ Employees",
    location: "Seattle, WA",
    keyAchievements: [
      "70% reduction in query latency for real-time dashboards",
      "Seamless processing of 45M daily metrics events",
      "Enterprise SOC2 & ISO 27001 compliant architecture",
    ],
    technologies: ["Next.js", "TypeScript", "Rust", "ClickHouse", "GraphQL", "GCP"],
    caseStudySlug: "horizon-telemetry",
    testimonialQuote: "The frontend and telemetry pipelines MARK built for us set a brand new benchmark for cloud infrastructure consoles.",
    testimonialAuthor: "Elena Rostova",
    testimonialRole: "VP of Engineering, Horizon Cloud",
    isFeatured: true,
    isActive: true,
    order: 2,
  },
  {
    id: "client-aura",
    name: "Aura Health",
    slug: "aura-health",
    industry: "HealthTech & Telemedicine",
    logoUrl: "",
    website: "https://aurahealth.example.com",
    tagline: "HIPAA-compliant telemedicine, electronic records, and patient engagement platform.",
    description: "Aura Health connects over 600,000 active patients with verified healthcare specialists through secure video consultation and automated health tracking.",
    aboutPartnership: "MARK engineered Aura's next-generation patient portal, provider console, and real-time WebRTC consultation infrastructure with end-to-end encryption.",
    servicesProvided: ["HIPAA-Compliant Web & Mobile", "WebRTC Video Engine", "EHR Integrations", "UX/UI Design"],
    partnershipYear: "2024 - Present",
    companySize: "90+ Employees",
    location: "Boston, MA",
    keyAchievements: [
      "Over 600,000 successful video consultations completed",
      "HIPAA compliance with 100% data audit pass rate",
      "4.9/5 patient satisfaction score across mobile platforms",
    ],
    technologies: ["React Native", "Next.js", "Node.js", "WebRTC", "PostgreSQL", "AWS HealthLake"],
    caseStudySlug: "aura-telemedicine",
    testimonialQuote: "MARK built our telemedicine portal with such precision that we passed our security and HIPAA audits on the very first attempt.",
    testimonialAuthor: "Dr. Marcus Chen",
    testimonialRole: "Founder & Chief Medical Officer, Aura Health",
    isFeatured: true,
    isActive: true,
    order: 3,
  },
  {
    id: "client-nexus",
    name: "Nexus AI",
    slug: "nexus-ai",
    industry: "Artificial Intelligence & Robotics",
    logoUrl: "",
    website: "https://nexusai.example.com",
    tagline: "Autonomous warehouse robotics orchestration and vision AI software.",
    description: "Nexus AI deploys fleet robotics management and edge computer-vision models to automate fulfillment logistics for Fortune 500 retail networks.",
    aboutPartnership: "MARK built the centralized command and control dashboard for fleet telemetry, 3D warehouse visualization, and real-time obstacle routing overrides.",
    servicesProvided: ["Digital Twin 3D Visualization", "Edge Fleet Control", "Real-Time WebSockets", "Enterprise UI"],
    partnershipYear: "2024 - Present",
    companySize: "120+ Employees",
    location: "Austin, TX",
    keyAchievements: [
      "Orchestrated fleets of 500+ autonomous mobile robots simultaneously",
      "Rendered digital twins at 60 FPS in browser with Three.js",
      "Cut dispatch latency by 55%",
    ],
    technologies: ["Three.js", "Next.js", "WebSockets", "Python", "Docker", "AWS"],
    caseStudySlug: "nexus-fleet",
    testimonialQuote: "The 3D fleet monitoring dashboard MARK delivered exceeded our wildest expectations. Our enterprise customers are genuinely impressed.",
    testimonialAuthor: "Sarah Jenkins",
    testimonialRole: "Head of Product, Nexus AI",
    isFeatured: true,
    isActive: true,
    order: 4,
  },
  {
    id: "client-pulse",
    name: "Pulse Logistics",
    slug: "pulse-logistics",
    industry: "Supply Chain & Freight",
    logoUrl: "",
    website: "https://pulselogistics.example.com",
    tagline: "Global multimodal freight intelligence and real-time container tracking.",
    description: "Pulse Logistics provides end-to-end shipment visibility, customs documentation automation, and predictive route optimization across ocean, air, and ground carriers.",
    aboutPartnership: "MARK re-architected Pulse's legacy carrier booking engine into a modular cloud-native platform with automated document parsing and live IoT sensor integration.",
    servicesProvided: ["Carrier API Gateway", "IoT Telemetry Tracking", "Document Parsing", "Enterprise ERP"],
    partnershipYear: "2023 - Present",
    companySize: "450+ Employees",
    location: "Chicago, IL",
    keyAchievements: [
      "Processed over 1.2M international bills of lading",
      "Automated 80% of customs filing paperwork",
      "Reduced shipping exceptions and route delays by 28%",
    ],
    technologies: ["Next.js", "TypeScript", "FastAPI", "MongoDB", "Redis", "Azure"],
    caseStudySlug: "pulse-freight",
    testimonialQuote: "MARK completely revitalized our operational software. They operate with the speed of a startup and the rigor of an elite engineering consultancy.",
    testimonialAuthor: "Robert Sterling",
    testimonialRole: "Chief Operations Officer, Pulse Logistics",
    isFeatured: true,
    isActive: true,
    order: 5,
  },
  {
    id: "client-vanguard",
    name: "Vanguard Wealth",
    slug: "vanguard-wealth",
    industry: "Wealth Management & Private Equity",
    logoUrl: "",
    website: "https://vanguardwealth.example.com",
    tagline: "Private equity portfolio modeling, capital call automation, and LP reporting.",
    description: "Vanguard Wealth delivers wealth management and automated LP reporting platforms for boutique private equity funds and family offices managing over $2B in AUM.",
    aboutPartnership: "MARK created their investor reporting portal, automated waterfall calculation engine, and tax document delivery system.",
    servicesProvided: ["Financial Modeling Engine", "LP Investor Portal", "Automated Reporting", "Data Encryption"],
    partnershipYear: "2024 - Present",
    companySize: "80+ Employees",
    location: "New York, NY",
    keyAchievements: [
      "Automated quarterly waterfall distribution calculations for 40+ funds",
      "99.999% calculation accuracy verified by third-party auditors",
      "Saved 350+ partner hours per quarter on LP reporting",
    ],
    technologies: ["Next.js", "TypeScript", "Python", "PostgreSQL", "AWS KMS", "Tailwind CSS"],
    caseStudySlug: "vanguard-lp-portal",
    testimonialQuote: "The financial accuracy and cryptographic data protections MARK engineered gave our limited partners absolute confidence.",
    testimonialAuthor: "Julian Wright",
    testimonialRole: "Managing Partner, Vanguard Wealth",
    isFeatured: true,
    isActive: true,
    order: 6,
  },
];

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
          slug,
          tagline: client.tagline || `${client.name} — Industry innovation in ${client.industry || "modern tech"}.`,
          description: client.description || `${client.name} partners with MARK to engineer scalable digital systems and modern digital products.`,
          aboutPartnership: client.aboutPartnership || `MARK worked collaboratively with ${client.name}'s product leadership to design, engineer, and deploy high-reliability digital solutions built for enterprise scale.`,
          servicesProvided: (client.servicesProvided && client.servicesProvided.length > 0) ? client.servicesProvided : ["Full-Stack Engineering", "Cloud Infrastructure", "UI/UX Design"],
          partnershipYear: client.partnershipYear || "2023 - Present",
          companySize: client.companySize || "50-250 Employees",
          location: client.location || "Global / Remote",
          keyAchievements: (client.keyAchievements && client.keyAchievements.length > 0) ? client.keyAchievements : [
            "Accelerated product release velocity by 3x",
            "Achieved 99.99% system availability",
            "Modernized legacy systems to cloud-native microservices"
          ],
          technologies: (client.technologies && client.technologies.length > 0) ? client.technologies : ["Next.js", "TypeScript", "Node.js", "Tailwind CSS", "AWS"],
          testimonialQuote: client.testimonialQuote || client.testimonial?.quote || `Working with MARK transformed our development velocity and technical standards.`,
          testimonialAuthor: client.testimonialAuthor || client.testimonial?.authorName || "Engineering Director",
          testimonialRole: client.testimonialRole || client.testimonial?.authorRole || `${client.name}`,
        };
      });
    }
  } catch (err) {
    console.error("Failed to fetch clients data from DB:", err);
  }
  return FALLBACK_CLIENTS;
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
    contactEmail: "hello@mark.com",
    contactPhone: "+1 (555) 234-5678",
    address: "San Francisco, CA & Global Remote",
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
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
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
        slug: computedSlug,
        tagline: serialized.tagline || `${serialized.name} — Industry innovation in ${serialized.industry || "technology"}.`,
        description: serialized.description || `${serialized.name} partners with MARK to engineer scalable digital systems and modern digital products.`,
        aboutPartnership: serialized.aboutPartnership || `MARK worked collaboratively with ${serialized.name}'s product leadership to design, engineer, and deploy high-reliability digital solutions built for enterprise scale.`,
        servicesProvided: (serialized.servicesProvided && serialized.servicesProvided.length > 0) ? serialized.servicesProvided : ["Full-Stack Engineering", "Cloud Infrastructure", "UI/UX Design"],
        partnershipYear: serialized.partnershipYear || "2023 - Present",
        companySize: serialized.companySize || "50-250 Employees",
        location: serialized.location || "Global / Remote",
        keyAchievements: (serialized.keyAchievements && serialized.keyAchievements.length > 0) ? serialized.keyAchievements : [
          "Accelerated release cycle by 3x",
          "Achieved 99.99% system availability",
          "Implemented automated CI/CD and monitoring"
        ],
        technologies: (serialized.technologies && serialized.technologies.length > 0) ? serialized.technologies : ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
        testimonialQuote: serialized.testimonialQuote || serialized.testimonial?.quote || "Working with MARK transformed our development velocity and technical standards.",
        testimonialAuthor: serialized.testimonialAuthor || serialized.testimonial?.authorName || "VP of Engineering",
        testimonialRole: serialized.testimonialRole || serialized.testimonial?.authorRole || serialized.name,
      };
    }
  } catch (err) {
    console.error(`Failed to fetch client for slug ${slug} from DB:`, err);
  }

  return FALLBACK_CLIENTS.find((c) => c.slug === slug) || null;
});
