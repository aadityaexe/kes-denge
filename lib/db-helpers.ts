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

export const getClientsData = cache(async () => {
  try {
    await connectToDatabase();
    const data = await Client.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return serialize(data || []);
  } catch (err) {
    console.error("Failed to fetch clients data from DB:", err);
    return [];
  }
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
