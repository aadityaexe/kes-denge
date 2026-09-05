import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Load environment variables from .env or .env.local if not loaded
function loadEnv() {
  if (process.env.MONGODB_URI) return;
  try {
    const envFiles = [".env.local", ".env"];
    for (const file of envFiles) {
      const fullPath = path.resolve(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        content.split("\n").forEach((line) => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith("#")) {
            const [key, ...valParts] = trimmed.split("=");
            if (key && valParts.length > 0 && !process.env[key.trim()]) {
              process.env[key.trim()] = valParts.join("=").trim().replace(/(^"|"$|^'|'$)/g, "");
            }
          }
        });
      }
    }
  } catch {
    // Ignore in bundled contexts
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/kas-denge";

// Schemas & Models
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
  },
  { timestamps: true }
);

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tagline: { type: String, default: "" },
    heroBadge: { type: String, default: "ENGINEERING & DEVELOPMENT" },
    icon: { type: String, default: "Globe" },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    targetAudience: [{ type: String }],
    problemsSolved: [
      {
        problem: { type: String, required: true },
        solution: { type: String, required: true },
      },
    ],
    features: [{ type: mongoose.Schema.Types.Mixed }],
    deliverables: [{ type: String }],
    benefits: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        metric: { type: String, default: "" },
        icon: { type: String, default: "CheckCircle2" },
      },
    ],
    process: [
      {
        step: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        duration: { type: String, default: "" },
      },
    ],
    technologies: [
      {
        name: { type: String, required: true },
        category: { type: String, required: true },
        icon: { type: String, default: "" },
      },
    ],
    whyChooseUs: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, default: "Shield" },
      },
    ],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    relatedServiceSlugs: [{ type: String }],
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    keywords: [{ type: String }],
    featuredImage: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    fullDescription: { type: String, default: "" },
    category: {
      type: String,
      enum: ["ERP", "CRM", "HRMS", "POS", "School", "Hospital", "Inventory", "Custom"],
      default: "ERP",
    },
    heroBadge: { type: String, default: "ENTERPRISE PLATFORM" },
    features: [{ type: mongoose.Schema.Types.Mixed }],
    modules: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, default: "Blocks" },
        capabilities: [{ type: String }],
      },
    ],
    benefits: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        metric: { type: String, default: "" },
        icon: { type: String, default: "CheckCircle2" },
      },
    ],
    useCases: [
      {
        title: { type: String, required: true },
        industry: { type: String, required: true },
        problem: { type: String, required: true },
        solution: { type: String, required: true },
        outcome: { type: String, required: true },
      },
    ],
    technologies: [
      {
        name: { type: String, required: true },
        category: { type: String, required: true },
        icon: { type: String, default: "" },
      },
    ],
    integrations: [{ type: String }],
    targetIndustries: [{ type: String }],
    deploymentOptions: [{ type: String }],
    securityCompliance: [{ type: String }],
    specifications: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    images: [{ type: String }],
    demoUrl: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    keywords: [{ type: String }],
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PortfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    clientName: { type: String, required: true },
    clientLogo: { type: String, default: "" },
    industry: { type: String, required: true },
    oneLiner: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    fullDescription: { type: String, default: "" },
    overview: { type: String, default: "" },
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    challenges: [{ type: String }],
    solutions: [{ type: String }],
    keyFeatures: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, default: "Layers" },
      },
    ],
    results: [{ type: String }],
    impactMetrics: [
      {
        metric: { type: String, required: true },
        label: { type: String, required: true },
        description: { type: String, default: "" },
      },
    ],
    techStack: [{ type: String }],
    technologies: [
      {
        name: { type: String, required: true },
        category: { type: String, default: "Tech Stack" },
        icon: { type: String, default: "Code2" },
      },
    ],
    startDate: { type: String, required: true },
    launchDate: { type: String, required: true },
    durationLabel: { type: String, required: true },
    status: { type: String, required: true, default: "completed" },
    teamMembers: [
      {
        teamMemberSlug: String,
        teamMemberName: String,
        teamMemberPhoto: String,
        roleOnProject: String,
      },
    ],
    coverImage: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    screenshots: [{ type: String }],
    galleryImages: [{ type: String }],
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    relatedServiceSlugs: [{ type: String }],
    testimonial: {
      quote: String,
      authorName: String,
      authorRole: String,
      company: String,
    },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    keywords: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    specialization: { type: String, required: true },
    photo: { type: String, default: "" },
    bio: { type: String, required: true },
    techTags: [{ type: String }],
    socialLinks: { linkedin: String, github: String, twitter: String },
    yearsExperience: { type: Number, required: true },
    joinedDate: { type: String, required: true },
    certifications: [{ type: String }],
    currentlyWorkingOn: String,
    quote: String,
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logoUrl: { type: String, default: "" },
    industry: { type: String, default: "Enterprise / SaaS" },
    website: { type: String, default: "" },
    projectSlugs: [{ type: String }],
    isFeatured: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TestimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    company: { type: String, required: true },
    role: { type: String, default: "Chief Executive Officer" },
    photo: { type: String, default: "" },
    review: { type: String, required: true },
    rating: { type: Number, default: 5 },
    isFeatured: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const FAQSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PricingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    period: { type: String, default: "project" },
    description: { type: String, required: true },
    features: [{ text: String, included: Boolean }],
    isPopular: { type: Boolean, default: false },
    ctaText: { type: String, default: "Get Started" },
    ctaHref: { type: String, default: "/contact" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: { type: String, default: "" },
    category: { type: String, default: "Engineering" },
    tags: [{ type: String }],
    author: {
      name: { type: String, default: "Kas Denge Team" },
      role: { type: String, default: "Technical Architect" },
      avatar: { type: String, default: "" },
    },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    publishedAt: { type: Date, default: Date.now },
    metaTitle: String,
    metaDescription: String,
    readTime: { type: String, default: "5 min read" },
  },
  { timestamps: true }
);

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    projectType: { type: String, required: true },
    budgetRange: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "in_progress", "completed", "spam", "contacted", "closed"],
      default: "new",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const SettingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Kas Denge Technologies" },
    tagline: { type: String, default: "We Build Digital Products That Scale" },
    description: {
      type: String,
      default:
        "A product-engineering agency that ships web apps, mobile apps, ERP/SaaS systems, and AI automation for startups and growing businesses.",
    },
    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },
    contactEmail: { type: String, default: "hello@kasdenge.com" },
    contactPhone: { type: String, default: "+1 (555) 234-5678" },
    address: { type: String, default: "San Francisco, CA & Global Remote" },
    googleMapsUrl: { type: String, default: "" },
    socialLinks: {
      linkedin: { type: String, default: "https://linkedin.com" },
      github: { type: String, default: "https://github.com" },
      twitter: { type: String, default: "https://twitter.com" },
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
          "Kas Denge was founded with a single mission: to build scalable, maintainable software that solves real business problems. No shortcuts, no black boxes.",
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
          "Founded by engineers who spent years architecting high-traffic distributed systems, Kas Denge was built on the belief that code quality and business velocity do not have to be trade-offs.",
      },
    },
    seo: {
      defaultTitle: { type: String, default: "Kas Denge Technologies — We Build Digital Products That Scale" },
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
      copyrightText: { type: String, default: "© 2025 Kas Denge Technologies. All rights reserved." },
      disclaimer: { type: String, default: "Engineered with precision for global teams." },
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const PortfolioItem = mongoose.models.PortfolioItem || mongoose.model("PortfolioItem", PortfolioSchema);
const TeamMember = mongoose.models.TeamMember || mongoose.model("TeamMember", TeamSchema);
const Client = mongoose.models.Client || mongoose.model("Client", ClientSchema);
const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);
const FAQItem = mongoose.models.FAQItem || mongoose.model("FAQItem", FAQSchema);
const PricingTier = mongoose.models.PricingTier || mongoose.model("PricingTier", PricingSchema);
const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", BlogSchema);
const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);
const Setting = mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

export async function runSeed() {
  console.log("🌱 Connecting to MongoDB:", MONGODB_URI.replace(/:([^:@]+)@/, ":****@"));
  await mongoose.connect(MONGODB_URI);
  console.log(" Connected to MongoDB successfully.");

  // 1. Admin User
  console.log("👤 Ensuring Administrator account...");
  const adminEmail = "admin@kasdenge.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("admin123456", 10);
    await User.create({
      email: adminEmail,
      passwordHash,
      name: "Kas Denge Administrator",
      role: "admin",
    });
    console.log("   Created admin user (admin@kasdenge.com / admin123456)");
  } else {
    console.log("   Admin account already exists.");
  }

  // 2. Services
  // 2. Services
  console.log("🛠️ Seeding Services...");
  const initialServices = [
    {
      title: "Web Development",
      slug: "web-development",
      tagline: "Scalable, Edge-Rendered Web Applications Built for High-Growth Teams",
      heroBadge: "FULL-STACK ENGINEERING",
      icon: "Globe",
      shortDescription: "Responsive, performant web applications built with React, Next.js, and modern frontend frameworks.",
      fullDescription: "We build web applications that don't just look good, but perform exceptionally well under high traffic. Using modern architectures like Next.js and React, we ensure server-side rendering for optimal SEO, lightning-fast edge delivery, and interactive user experiences that rival native applications. Our frontend code is rigorously tested, fully typed, and built on robust design systems to guarantee consistency across every screen size.",
      targetAudience: [
        "High-growth startups launching MVPs or scaling customer portals",
        "Mid-market enterprises modernizing legacy monolithic web apps",
        "SaaS product companies requiring high-conversion user onboarding & dashboards",
        "Digital brands demanding sub-second page speeds and 99+ Core Web Vitals",
      ],
      problemsSolved: [
        {
          problem: "Slow page loads and sluggish UI interactions leading to high bounce rates and lost conversions.",
          solution: "We implement React Server Components (RSC), intelligent edge caching, and bundle optimization to achieve sub-second TTFB and seamless 60fps transitions.",
        },
        {
          problem: "Spaghetti codebases that become brittle and impossible to scale as engineering teams grow.",
          solution: "We establish clean modular architectures with strict TypeScript typing, Atomic design tokens, and comprehensive automated test coverage.",
        },
        {
          problem: "Poor search visibility due to client-side single-page applications (SPAs) blocking search engine crawlers.",
          solution: "We engineer hybrid SSR/SSG rendering pipelines with dynamic Schema.org JSON-LD and automated sitemaps for maximum organic search dominance.",
        },
      ],
      features: [
        {
          title: "Full-Stack Next.js Architecture",
          description: "Server-side rendering, streaming SSR, and edge compute for near-instant response times globally.",
          icon: "Layers",
        },
        {
          title: "Design System & Component Library",
          description: "Custom tokenized UI system with strict accessibility (WCAG 2.1 AA) and fluid responsiveness.",
          icon: "Paintbrush",
        },
        {
          title: "Automated CI/CD & Cloud Infrastructure",
          description: "Zero-downtime deployment workflows on AWS/Vercel with automated preview environments and rollback safety.",
          icon: "Server",
        },
        {
          title: "Robust API Integration & State Sync",
          description: "Real-time WebSockets, GraphQL, and resilient REST pipelines with optimistic UI updates.",
          icon: "Database",
        },
      ],
      deliverables: [
        "Production-ready, fully typed TypeScript codebase with zero technical debt",
        "Custom design system tokenized in Tailwind CSS / CSS variables",
        "Comprehensive automated testing suite (Unit, Integration, and E2E with Playwright)",
        "Automated CI/CD deployment pipelines configured for staging and production",
        "Interactive API documentation & architectural system diagrams",
        "Full intellectual property transfer with complete GitHub repository access",
      ],
      benefits: [
        {
          title: "Ultra-Fast Page Speeds",
          description: "Sub-second global TTFB and 95+ Google Core Web Vitals score across mobile and desktop.",
          metric: "< 450ms TTFB",
          icon: "Zap",
        },
        {
          title: "Higher Conversion Rates",
          description: "Optimized user journeys, frictionless checkout flows, and responsive micro-interactions.",
          metric: "+38% Avg Lift",
          icon: "TrendingUp",
        },
        {
          title: "Zero-Downtime Reliability",
          description: "Fault-tolerant edge CDN caching and multi-region deployment redundancy.",
          metric: "99.99% Uptime",
          icon: "Shield",
        },
        {
          title: "Maintainable Codebase",
          description: "Standardized code structure that lets your internal team ship features twice as fast.",
          metric: "2x Velocity",
          icon: "Cpu",
        },
      ],
      process: [
        {
          step: 1,
          title: "Technical Discovery & Architecture",
          description: "We audit requirements, user personas, database schemas, and integration points to create a comprehensive blueprint.",
          duration: "Week 1 - 2",
        },
        {
          step: 2,
          title: "UI/UX Design & Design Tokens",
          description: "We create interactive Figma prototypes, component design tokens, and establish the visual design system.",
          duration: "Week 2 - 3",
        },
        {
          step: 3,
          title: "Agile Sprint Engineering",
          description: "Bi-weekly sprint deliverables with live staging previews, code reviews, and strict TypeScript verification.",
          duration: "Week 4 - 8",
        },
        {
          step: 4,
          title: "QA, Security & Performance Audit",
          description: "Rigorous automated testing, penetration verification, cross-browser audits, and Core Web Vitals optimization.",
          duration: "Week 9",
        },
        {
          step: 5,
          title: "Zero-Downtime Production Launch",
          description: "DNS routing, SSL provisioning, edge caching configuration, telemetry instrumentation, and team onboarding.",
          duration: "Week 10",
        },
        {
          step: 6,
          title: "Ongoing SLA & Growth Support",
          description: "Continuous performance monitoring, security patches, proactive scaling, and iterative feature development.",
          duration: "Ongoing",
        },
      ],
      technologies: [
        { name: "Next.js 15", category: "Frontend", icon: "Globe" },
        { name: "React 19", category: "Frontend", icon: "Code2" },
        { name: "TypeScript", category: "Language", icon: "Code2" },
        { name: "Tailwind CSS", category: "Styling", icon: "Paintbrush" },
        { name: "Node.js", category: "Backend", icon: "Server" },
        { name: "PostgreSQL", category: "Database", icon: "Database" },
        { name: "MongoDB", category: "Database", icon: "Database" },
        { name: "Redis", category: "Caching", icon: "Zap" },
        { name: "Docker", category: "DevOps", icon: "Layers" },
        { name: "AWS & Vercel", category: "Cloud", icon: "Cloud" },
      ],
      whyChooseUs: [
        {
          title: "Senior Engineers Only",
          description: "No junior hand-offs. Every line of code is authored and reviewed by battle-tested product engineers.",
          icon: "Users",
        },
        {
          title: "Zero Vendor Lock-in",
          description: "Clean code with full source repository ownership, comprehensive documentation, and zero proprietary runtime dependencies.",
          icon: "ShieldCheck",
        },
        {
          title: "Transparent Sprint Cadence",
          description: "Weekly async video updates, dedicated Slack channel, and working preview URLs on every git commit.",
          icon: "Megaphone",
        },
      ],
      faqs: [
        {
          question: "How long does a typical web application project take?",
          answer: "Most production-ready web applications are designed, developed, and deployed within 6 to 10 weeks depending on feature complexity and third-party integration requirements. We provide a milestone-backed timeline during discovery.",
        },
        {
          question: "Do you build custom design systems or use generic templates?",
          answer: "We build 100% bespoke design systems tailored to your brand identity. We leverage modern CSS tokens and headless component primitives to achieve maximum accessibility and custom visual appeal without generic template bloat.",
        },
        {
          question: "How do you handle post-launch support and maintenance?",
          answer: "Every project includes 30 days of post-launch warranty support covering bug fixes, tuning, and monitoring. We also provide dedicated monthly SLA retainers for continuous feature shipping and infrastructure scaling.",
        },
        {
          question: "Can you migrate our legacy web application to Next.js without downtime?",
          answer: "Yes. We frequently execute strangler-pattern migrations, routing traffic incrementally between legacy backends and new Next.js micro-frontends with zero user disruption.",
        },
      ],
      relatedServiceSlugs: ["custom-software", "mobile-apps", "seo-optimization", "ai-automation"],
      metaTitle: "Web Development Services | Kas Denge Technologies",
      metaDescription: "Enterprise-grade web application development using React, Next.js, and TypeScript. Lightning-fast edge delivery, 99+ Core Web Vitals, and scalable architectures.",
      keywords: ["web development", "nextjs development agency", "react web apps", "frontend engineering", "full stack typescript", "enterprise web applications"],
      order: 1,
      isActive: true,
    },
    {
      title: "Mobile Apps",
      slug: "mobile-apps",
      tagline: "Native-Caliber iOS & Android Mobile Experiences Engineered from a Unified Codebase",
      heroBadge: "MOBILE ENGINEERING",
      icon: "Smartphone",
      shortDescription: "Cross-platform mobile applications using React Native and Flutter that feel native on every device.",
      fullDescription: "We engineer mobile experiences that users actually want to keep on their home screens. Instead of building separate codebases for iOS and Android, we leverage React Native and Flutter to ship faster without compromising on 60fps animations or native device capabilities. From offline-first architectures to real-time socket integrations, our mobile apps are built to handle edge-case network conditions and complex state management flawlessly.",
      targetAudience: [
        "Product startups looking to launch simultaneously on App Store & Google Play",
        "Enterprises seeking custom internal employee or field-ops mobile tools",
        "SaaS companies extending their web applications to native mobile ecosystems",
        "E-commerce brands striving to boost customer retention with push notifications",
      ],
      problemsSolved: [
        {
          problem: "Excessive development costs and delayed schedules from building duplicate native codebases for iOS and Android.",
          solution: "We build unified cross-platform architectures that share up to 90% of business logic while maintaining pixel-perfect native fidelity and platform UI conventions.",
        },
        {
          problem: "App instability and data loss when users enter tunnels, elevators, or low-connectivity zones.",
          solution: "We engineer offline-first local SQLite / WatermelonDB stores with background sync queues that reconcile data seamlessly when connectivity returns.",
        },
        {
          problem: "Rejected app submissions and long approval delays on the Apple App Store and Google Play Store.",
          solution: "Our team manages end-to-end store compliance, privacy manifests, certificate signing, and automated TestFlight / Fastlane release tracks.",
        },
      ],
      features: [
        {
          title: "Unified Cross-Platform Core",
          description: "Shared TypeScript / Dart logic for iOS and Android with zero compromise on native gesture handling.",
          icon: "Smartphone",
        },
        {
          title: "Offline-First Data Sync",
          description: "Resilient local storage with automatic background synchronization and conflict resolution.",
          icon: "Database",
        },
        {
          title: "Deep Native Device Integrations",
          description: "Biometrics (FaceID/TouchID), Bluetooth BLE, Camera, Push Notifications, and Background Geolocation.",
          icon: "Cpu",
        },
        {
          title: "Automated Release Pipeline",
          description: "Fastlane CI/CD automation for instant TestFlight builds, Google Internal tracks, and production rollouts.",
          icon: "Layers",
        },
      ],
      deliverables: [
        "Complete source code repository for iOS and Android with automated Fastlane scripts",
        "App Store & Google Play Store submission management and compliance approval",
        "Design system & mobile component library built for multi-screen densities",
        "Backend API integration layer with JWT authentication and push notification service",
        "Crashlytics, telemetry instrumentation, and real-time error tracking setup",
      ],
      benefits: [
        {
          title: "50% Faster Time to Market",
          description: "Ship simultaneously to iOS and Android from a single battle-tested codebase.",
          metric: "2x Faster Launch",
          icon: "Zap",
        },
        {
          title: "Silky 60fps Animations",
          description: "Hardware-accelerated native animations using React Native Reanimated and Skia.",
          metric: "60 FPS Smooth",
          icon: "TrendingUp",
        },
        {
          title: "Offline Reliability",
          description: "Users continue interacting with zero UI blocking even when completely offline.",
          metric: "100% Offline Ready",
          icon: "Shield",
        },
        {
          title: "Cost Efficiency",
          description: "Halve ongoing maintenance and engineering overhead with a single mobile team.",
          metric: "-40% Dev Costs",
          icon: "Cpu",
        },
      ],
      process: [
        {
          step: 1,
          title: "Mobile UX & Prototype Design",
          description: "Platform-specific UX patterns (Human Interface & Material Design) wireframed and prototyped in Figma.",
          duration: "Week 1 - 2",
        },
        {
          step: 2,
          title: "Core Architecture & Data Layer",
          description: "State management, local offline database schema, and secure authentication flow setup.",
          duration: "Week 3 - 4",
        },
        {
          step: 3,
          title: "Feature Engineering & Native Bridges",
          description: "Building UI screens, hardware device integrations, and real-time push event listeners.",
          duration: "Week 5 - 8",
        },
        {
          step: 4,
          title: "Device Testing & Performance Tuning",
          description: "Rigorous testing across 30+ physical iOS and Android device screen sizes, memory profiling, and battery audits.",
          duration: "Week 9",
        },
        {
          step: 5,
          title: "App Store & Play Store Launch",
          description: "Store asset generation, privacy manifests, metadata optimization, and final review submission.",
          duration: "Week 10",
        },
        {
          step: 6,
          title: "Over-the-Air (OTA) Updates & Maintenance",
          description: "Deploying rapid JS bundle updates via EAS/CodePush without waiting for store review cycles.",
          duration: "Ongoing",
        },
      ],
      technologies: [
        { name: "React Native", category: "Framework", icon: "Smartphone" },
        { name: "Flutter", category: "Framework", icon: "Smartphone" },
        { name: "TypeScript", category: "Language", icon: "Code2" },
        { name: "Expo / EAS", category: "Tooling", icon: "Layers" },
        { name: "WatermelonDB", category: "Database", icon: "Database" },
        { name: "Firebase", category: "Cloud & Auth", icon: "Cloud" },
        { name: "Fastlane", category: "DevOps", icon: "Server" },
        { name: "Swift / Kotlin", category: "Native Bridges", icon: "Code2" },
      ],
      whyChooseUs: [
        {
          title: "Proven App Store Success",
          description: "Our engineered mobile apps maintain average 4.8+ star ratings across tens of thousands of downloads.",
          icon: "ShieldCheck",
        },
        {
          title: "Hardware-Level Expertise",
          description: "Deep experience writing custom Swift/Kotlin native bridges when off-the-shelf packages fall short.",
          icon: "Cpu",
        },
        {
          title: "Fast OTA Updates",
          description: "We configure instant Over-The-Air bug fixes so your team can deploy urgent patches in minutes.",
          icon: "Zap",
        },
      ],
      faqs: [
        {
          question: "Do cross-platform apps perform as well as pure native Swift/Kotlin apps?",
          answer: "Yes. Modern React Native and Flutter utilize compiled native components, JSI direct memory bridges, and Skia rendering pipelines. To end users, they are indistinguishable from Swift or Kotlin in performance and responsiveness.",
        },
        {
          question: "Will you manage the App Store and Google Play submission process?",
          answer: "Absolutely. We configure provisioning profiles, certificates, privacy disclosures, store screenshots, and handle any app reviewer inquiries until full approval is achieved.",
        },
        {
          question: "Can our mobile app share APIs with our existing web application?",
          answer: "Yes. We design unified backend API gateways that serve both web and mobile clients efficiently, ensuring synchronized state and reduced server overhead.",
        },
      ],
      relatedServiceSlugs: ["web-development", "custom-software", "ai-automation"],
      metaTitle: "Mobile App Development Services | React Native & Flutter | Kas Denge",
      metaDescription: "High-performance cross-platform mobile application engineering for iOS and Android using React Native and Flutter. 60fps animations and offline-first data sync.",
      keywords: ["mobile app development", "react native agency", "flutter developers", "cross-platform mobile", "ios android app development"],
      order: 2,
      isActive: true,
    },
    {
      title: "ERP Software",
      slug: "erp-software",
      tagline: "Custom Enterprise Resource Planning Systems Engineered for Mission-Critical Agility",
      heroBadge: "ENTERPRISE SYSTEMS",
      icon: "Building2",
      shortDescription: "Custom enterprise resource planning systems that streamline operations and reduce manual overhead.",
      fullDescription: "Off-the-shelf ERPs force your business to adapt to their software. We build custom ERPs that adapt to your business. Our systems seamlessly integrate HR, finance, inventory, and operations into a single source of truth. With multi-tenant architectures, fine-grained role-based access control, and real-time data pipelines, we replace your fragmented spreadsheets with a scalable, highly secure centralized nervous system for your enterprise.",
      targetAudience: [
        "Multi-location supply chain, logistics, and manufacturing operations",
        "Mid-market enterprises held back by rigid legacy software (SAP/Oracle customization costs)",
        "Growing retail and wholesale chains struggling with fragmented inventory spreadsheets",
        "Healthcare and corporate organizations demanding strict audit trails and RBAC compliance",
      ],
      problemsSolved: [
        {
          problem: "Fragmented software tools causing data silos between accounting, warehouse inventory, and sales teams.",
          solution: "We build a centralized operational nervous system where inventory updates, invoice disbursements, and order fulfillments sync in real-time.",
        },
        {
          problem: "Exorbitant per-seat licensing fees and rigid workflows forced by generic off-the-shelf ERP suites.",
          solution: "We engineer bespoke, self-hosted or private-cloud ERP systems tailored to your exact workflows with zero per-user recurring license fees.",
        },
        {
          problem: "Security vulnerabilities and lack of compliance audit logging during sensitive corporate transactions.",
          solution: "We implement immutable SOC2-ready audit logs, multi-factor authentication, and multi-level role-based authorization matrices.",
        },
      ],
      features: [
        {
          title: "Multi-Module Command Center",
          description: "Unified dashboards for Inventory, Double-Entry Accounting, HRMS, Supply Chain, and CRM.",
          icon: "Layers",
        },
        {
          title: "Real-Time Event Pipelines",
          description: "Asynchronous worker queues and event sourcing for lightning-fast transaction throughput.",
          icon: "Zap",
        },
        {
          title: "Fine-Grained RBAC & Security",
          description: "Custom role permissions down to the individual field level with cryptographic audit logging.",
          icon: "Shield",
        },
        {
          title: "Automated Reporting & BI Exports",
          description: "Scheduled executive summaries, cash flow forecasts, automated tax calculations, and PDF/CSV pipelines.",
          icon: "Database",
        },
      ],
      deliverables: [
        "Enterprise-grade custom ERP web platform with mobile-responsive interfaces",
        "Relational database schema with automated replication, backup, and failover",
        "Complete Role-Based Access Control (RBAC) permission configuration panel",
        "REST/GraphQL integration layer connecting legacy accounting and third-party logistics APIs",
        "System administrator guides, operator user manuals, and technical runbooks",
        "30-day post-launch hyper-care and data migration validation support",
      ],
      benefits: [
        {
          title: "Save Hundreds of Labor Hours",
          description: "Eliminate repetitive manual spreadsheet reconciliations and paperwork workflows.",
          metric: "80% Time Saved",
          icon: "TrendingUp",
        },
        {
          title: "Zero Per-Seat License Fees",
          description: "Scale from 50 to 5,000 employees without paying escalating SaaS license penalties.",
          metric: "$0 Per-Seat Fees",
          icon: "Zap",
        },
        {
          title: "Real-Time Data Visibility",
          description: "Gain live visibility into stock inventory levels, revenue velocity, and operating margins.",
          metric: "Live Telemetry",
          icon: "Database",
        },
        {
          title: "Strict Compliance & Security",
          description: "Complete trace logs for every financial transaction and inventory adjustment.",
          metric: "SOC2 Ready",
          icon: "Shield",
        },
      ],
      process: [
        {
          step: 1,
          title: "Business Process Mapping",
          description: "We map out existing departmental workflows, data flows, legacy systems, and compliance constraints.",
          duration: "Week 1 - 3",
        },
        {
          step: 2,
          title: "Data Architecture & Schema Design",
          description: "Designing relational database models, transaction locks, and event bus architectures.",
          duration: "Week 3 - 4",
        },
        {
          step: 3,
          title: "Core Module Engineering",
          description: "Iterative sprint delivery of Inventory, Accounting, HR, and Operations modules with weekly stakeholder demos.",
          duration: "Week 5 - 12",
        },
        {
          step: 4,
          title: "Legacy Data Migration & ETL",
          description: "Sanitizing, mapping, and migrating millions of historical records from legacy databases with zero data loss.",
          duration: "Week 13",
        },
        {
          step: 5,
          title: "Parallel Run & User Training",
          description: "Side-by-side verification alongside legacy systems to ensure 100% financial calculation accuracy.",
          duration: "Week 14",
        },
        {
          step: 6,
          title: "Cutover & Dedicated SLA Support",
          description: "Production switchover during low-traffic window, followed by 24/7 dedicated engineering coverage.",
          duration: "Week 15+",
        },
      ],
      technologies: [
        { name: "PostgreSQL", category: "Database", icon: "Database" },
        { name: "Node.js / Go", category: "Backend", icon: "Server" },
        { name: "Next.js", category: "Frontend", icon: "Globe" },
        { name: "Redis", category: "Cache & Queues", icon: "Zap" },
        { name: "Kafka", category: "Event Bus", icon: "Layers" },
        { name: "Docker & Kubernetes", category: "DevOps", icon: "Cloud" },
        { name: "TimescaleDB", category: "Time Series", icon: "Database" },
      ],
      whyChooseUs: [
        {
          title: "Zero Disruption Cutover",
          description: "Our structured migration frameworks guarantee zero downtime and zero lost transactions during cutover.",
          icon: "ShieldCheck",
        },
        {
          title: "Built for High Concurrency",
          description: "Engineered to handle hundreds of thousands of concurrent database reads and writes with sub-second response times.",
          icon: "Cpu",
        },
        {
          title: "Complete Code Ownership",
          description: "You own all source code and infrastructure scripts with no perpetual vendor lock-in.",
          icon: "Shield",
        },
      ],
      faqs: [
        {
          question: "How do we migrate existing data from our legacy ERP or Excel sheets?",
          answer: "We develop custom ETL (Extract, Transform, Load) pipelines that sanitize, validate, and migrate your historical data. We perform dry runs in staging environments until every transaction balances down to the penny.",
        },
        {
          question: "Can the custom ERP integrate with our external logistics carriers and payment gateways?",
          answer: "Yes. We build native API webhooks and integrations for FedEx, UPS, Stripe, QuickBooks, Shopify, and any proprietary EDI/custom endpoints your business relies on.",
        },
        {
          question: "How do you protect sensitive financial and employee HR data?",
          answer: "We implement AES-256 encryption at rest, TLS 1.3 in transit, strict row-level security (RLS) in the database, and mandatory multi-factor authentication (MFA).",
        },
      ],
      relatedServiceSlugs: ["custom-software", "web-development", "ai-automation"],
      metaTitle: "Custom ERP Software Development Services | Kas Denge",
      metaDescription: "Bespoke ERP software development for mid-market and enterprise businesses. Streamline inventory, accounting, HR, and operations with zero per-seat licensing fees.",
      keywords: ["custom erp development", "enterprise software", "erp systems agency", "custom accounting software", "inventory management software"],
      order: 3,
      isActive: true,
    },
    {
      title: "Custom Software",
      slug: "custom-software",
      tagline: "Bespoke Digital Systems & High-Throughput Microservices Architected for Your Exact Domain",
      heroBadge: "BESPOKE ENGINEERING",
      icon: "Code2",
      shortDescription: "Bespoke software solutions engineered for your exact business processes and workflow requirements.",
      fullDescription: "When SaaS platforms can't solve your unique operational bottlenecks, custom software is the only answer. We architect bespoke digital products from the ground up, tailored precisely to your workflow. Whether you need a complex internal dashboard, a proprietary matching algorithm, or a high-frequency trading interface, we deliver clean, modular code that acts as a true multiplier for your team's productivity.",
      targetAudience: [
        "Companies building proprietary algorithmic or workflow advantages that off-the-shelf SaaS cannot deliver",
        "Founders launching new tech-enabled business models requiring custom infrastructure",
        "Organizations scaling beyond standard cloud tier limitations and looking to optimize server costs",
        "Hardware and IoT companies requiring custom telemetry ingestion pipelines and dashboards",
      ],
      problemsSolved: [
        {
          problem: "Attempting to stitch together 10 different SaaS tools with brittle Zapier/webhook integrations that constantly fail.",
          solution: "We build a cohesive custom backend engine that executes your unique business logic with sub-millisecond reliability and unified reporting.",
        },
        {
          problem: "Scalability bottlenecks and high cloud hosting bills from inefficient monolithic architectures.",
          solution: "We design lean, containerized microservices and serverless architectures optimized for high throughput and ultra-low compute overhead.",
        },
        {
          problem: "Technical debt created by previous contractors who wrote unmaintainable code with zero documentation.",
          solution: "We refactor and engineer clean, modular, fully typed systems accompanied by automated tests and clear architectural documentation.",
        },
      ],
      features: [
        {
          title: "High-Throughput Microservices",
          description: "Distributed backends built with Go, Node.js, and Rust for maximum raw performance and concurrency.",
          icon: "Server",
        },
        {
          title: "Custom Data Engines & Algorithms",
          description: "Proprietary matching, ranking, and calculation engines built specifically for your domain.",
          icon: "Cpu",
        },
        {
          title: "Resilient Event-Driven Architecture",
          description: "Kafka/RabbitMQ message brokers ensuring zero data loss and asynchronous decoupled processing.",
          icon: "Layers",
        },
        {
          title: "Enterprise API Gateways",
          description: "Secure, rate-limited, and token-authenticated API layers with auto-generated OpenAPI documentation.",
          icon: "Database",
        },
      ],
      deliverables: [
        "Modular, clean-architecture backend codebase with 90%+ automated test coverage",
        "Fully automated Docker containerization and Kubernetes / AWS ECS deployment scripts",
        "OpenAPI / Swagger interactive API specifications",
        "Distributed tracing and Prometheus / Grafana observability dashboard setup",
        "Full intellectual property ownership and developer onboarding handover sessions",
      ],
      benefits: [
        {
          title: "Sub-50ms Global Response",
          description: "Optimized database indexing and compiled microservices for lightning-fast execution.",
          metric: "< 50ms Latency",
          icon: "Zap",
        },
        {
          title: "Drastically Lower Cloud Costs",
          description: "Efficient resource utilization that cuts monthly AWS / GCP infrastructure expenses.",
          metric: "40-60% Cost Cut",
          icon: "TrendingUp",
        },
        {
          title: "Infinite Scalability",
          description: "Horizontally scalable stateless services capable of processing tens of thousands of requests per second.",
          metric: "10k+ Req/Sec",
          icon: "Cpu",
        },
        {
          title: "Competitive Moat",
          description: "Build proprietary software capabilities that your competitors cannot purchase off the shelf.",
          metric: "100% Proprietary",
          icon: "Shield",
        },
      ],
      process: [
        {
          step: 1,
          title: "Domain Analysis & System Blueprint",
          description: "Deep-dive workshops to extract domain models, edge cases, throughput targets, and security policies.",
          duration: "Week 1 - 2",
        },
        {
          step: 2,
          title: "Proof of Concept (PoC) Validation",
          description: "Building the core algorithmic engine or high-risk integration first to validate performance metrics early.",
          duration: "Week 3",
        },
        {
          step: 3,
          title: "Iterative Sprint Engineering",
          description: "Continuous integration development with bi-weekly deliverables, load benchmarking, and automated linting.",
          duration: "Week 4 - 8",
        },
        {
          step: 4,
          title: "Chaos & Load Testing",
          description: "Simulating peak concurrency traffic surges and network failure scenarios to ensure self-healing resiliency.",
          duration: "Week 9",
        },
        {
          step: 5,
          title: "Production Staged Rollout",
          description: "Canary deployments, blue-green cutover, and synthetic health monitoring activation.",
          duration: "Week 10",
        },
        {
          step: 6,
          title: "Handover & Knowledge Transfer",
          description: "Comprehensive code walkthroughs, recorded architecture debriefs, and ongoing Tier-3 escalation support.",
          duration: "Ongoing",
        },
      ],
      technologies: [
        { name: "Go / Golang", category: "Backend", icon: "Server" },
        { name: "Node.js & NestJS", category: "Backend", icon: "Server" },
        { name: "Python", category: "Data / AI", icon: "Code2" },
        { name: "PostgreSQL", category: "Database", icon: "Database" },
        { name: "Redis", category: "In-Memory Cache", icon: "Zap" },
        { name: "Kafka & RabbitMQ", category: "Message Broker", icon: "Layers" },
        { name: "Docker & AWS", category: "Cloud Infrastructure", icon: "Cloud" },
      ],
      whyChooseUs: [
        {
          title: "Systems-Level Rigor",
          description: "Our engineers come from high-frequency and distributed systems backgrounds where reliability is non-negotiable.",
          icon: "ShieldCheck",
        },
        {
          title: "Pragmatic Architecture",
          description: "We avoid unnecessary over-engineering, choosing the simplest, most performant tool for your exact requirements.",
          icon: "Cpu",
        },
        {
          title: "Transparent Knowledge Sharing",
          description: "We work alongside your internal developers, upskilling your team and leaving behind clean, readable code.",
          icon: "Users",
        },
      ],
      faqs: [
        {
          question: "Why should we build custom software instead of buying existing SaaS tools?",
          answer: "Commercial SaaS works well for generic workflows (like basic CRM), but forces you into standard operational boxes. Custom software is essential when your business model relies on proprietary workflows, strict compliance, or unique algorithms that give you a competitive edge.",
        },
        {
          question: "Who owns the code and intellectual property?",
          answer: "You do. 100% of the source code, architecture designs, database models, and documentation belong to your company upon milestone completion. We claim zero proprietary rights.",
        },
        {
          question: "How do you ensure the software can handle high traffic spikes?",
          answer: "We design stateless microservices backed by distributed caching, connection pooling, and autoscaling container groups. We run rigorous load simulation tests before launch to verify stability.",
        },
      ],
      relatedServiceSlugs: ["web-development", "erp-software", "ai-automation"],
      metaTitle: "Custom Software Engineering Services | Kas Denge",
      metaDescription: "Bespoke software development, high-throughput microservices, and distributed systems engineering tailored to your exact business workflows.",
      keywords: ["custom software development", "backend engineering", "microservices architecture", "bespoke software solutions", "go backend developers"],
      order: 4,
      isActive: true,
    },
    {
      title: "SEO Optimization",
      slug: "seo-optimization",
      tagline: "Engineering-First Technical SEO, Core Web Vitals Mastery & Search Dominance",
      heroBadge: "SEARCH ARCHITECTURE",
      icon: "Search",
      shortDescription: "Technical SEO, Core Web Vitals optimization, and content architecture to dominate search rankings.",
      fullDescription: "SEO is an engineering discipline, not just keyword stuffing. We optimize the technical foundation of your site — Core Web Vitals, structured data, canonicalization, crawl budgets, and edge caching — so that search engines can easily index and prioritize your pages. The result: organic traffic that compounds over time and converts into paying customers.",
      targetAudience: [
        "High-traffic content portals and publications seeking to maximize Google search impressions",
        "E-commerce stores struggling with slow product page indexation and ranking drops",
        "B2B SaaS companies striving to dominate high-intent programmatic search terms",
        "Web applications suffering from Google Core Web Vitals algorithmic penalties",
      ],
      problemsSolved: [
        {
          problem: "Client-side JavaScript rendering preventing search engine bots from properly indexing dynamic content.",
          solution: "We implement dynamic Server-Side Rendering (SSR) and edge-rendered HTML prerendering to ensure Googlebot crawls 100% of your content instantly.",
        },
        {
          problem: "Failing Core Web Vitals metrics (LCP, INP, CLS) resulting in lower Google search ranking priority.",
          solution: "We optimize critical rendering paths, eliminate layout shifts, implement modern AVIF/WebP image pipelines, and defer non-critical JavaScript to guarantee green 90+ scores.",
        },
        {
          problem: "Missing rich search results (snippets, FAQ carousels, breadcrumbs) that reduce organic click-through rates.",
          solution: "We engineer programmatic Schema.org JSON-LD structured data pipelines across your entire domain.",
        },
      ],
      features: [
        {
          title: "Core Web Vitals Perfection",
          description: "Sub-second Largest Contentful Paint (LCP) and zero Interaction to Next Paint (INP) latency.",
          icon: "Zap",
        },
        {
          title: "Programmatic Schema.org JSON-LD",
          description: "Rich snippet schemas for Organization, Breadcrumbs, FAQs, Products, and Articles.",
          icon: "Database",
        },
        {
          title: "Edge Caching & Crawl Budget Optimization",
          description: "Instant bot response times and intelligent sitemap segmentation for deep indexation.",
          icon: "Server",
        },
        {
          title: "Canonicalization & International Hreflang",
          description: "Clean URL structure, self-referencing canonicals, and multi-region localization headers.",
          icon: "Globe",
        },
      ],
      deliverables: [
        "Complete technical SEO architectural audit with prioritized code remediation roadmap",
        "Production implementation of Schema.org JSON-LD structured data generators",
        "Automated XML sitemaps, robots.txt, and canonical URL routing configurations",
        "Google Search Console & Bing Webmaster Tools verification and indexation monitoring",
        "Core Web Vitals performance benchmark dashboard showing before/after metrics",
      ],
      benefits: [
        {
          title: "95+ PageSpeed & CWV Scores",
          description: "Guaranteed green scores on Google PageSpeed Insights across mobile and desktop.",
          metric: "95+ Lighthouse",
          icon: "Zap",
        },
        {
          title: "Higher Organic Click-Through",
          description: "Rich snippets and FAQ cards command more search real estate and double CTR.",
          metric: "+45% Organic CTR",
          icon: "TrendingUp",
        },
        {
          title: "Faster Search Indexation",
          description: "New pages and updates indexed by Google within hours instead of weeks.",
          metric: "10x Faster Indexing",
          icon: "Search",
        },
        {
          title: "Compounding ROI",
          description: "Unlike paid search ads, organic search rankings provide sustainable long-term inbound leads.",
          metric: "Zero Ad Spend",
          icon: "Shield",
        },
      ],
      process: [
        {
          step: 1,
          title: "Comprehensive Technical SEO Audit",
          description: "We crawl your entire website, identifying broken canonicals, duplicate content, 404s, and rendering bottlenecks.",
          duration: "Week 1",
        },
        {
          step: 2,
          title: "Core Web Vitals Engineering",
          description: "Eliminating render-blocking assets, lazy-loading offscreen elements, and optimizing font loading.",
          duration: "Week 2",
        },
        {
          step: 3,
          title: "Schema.org & Semantic HTML Implementation",
          description: "Injecting validated JSON-LD schema markup and refining HTML heading hierarchies.",
          duration: "Week 3",
        },
        {
          step: 4,
          title: "Crawl Budget & Sitemap Optimization",
          description: "Rebuilding dynamic XML sitemaps and configuring edge cache headers for search bots.",
          duration: "Week 4",
        },
        {
          step: 5,
          title: "Search Console Monitoring & Indexation Acceleration",
          description: "Submitting sitemaps, tracking coverage errors, and verifying rich snippet rendering.",
          duration: "Week 5",
        },
        {
          step: 6,
          title: "Monthly Algorithm Monitoring & Ranking Growth",
          description: "Continuous monitoring for Google search updates, link health, and index status.",
          duration: "Ongoing",
        },
      ],
      technologies: [
        { name: "Next.js SSR / SSG", category: "Rendering", icon: "Globe" },
        { name: "Schema.org JSON-LD", category: "Structured Data", icon: "Database" },
        { name: "Google Search Console", category: "Telemetry", icon: "Search" },
        { name: "Lighthouse CI", category: "Performance Audit", icon: "Zap" },
        { name: "Cloudflare Edge", category: "CDN Caching", icon: "Cloud" },
        { name: "Screaming Frog", category: "Crawler Audit", icon: "Layers" },
      ],
      whyChooseUs: [
        {
          title: "Engineers, Not Just Marketers",
          description: "We write actual production code to fix underlying technical bottlenecks that standard SEO agencies can't touch.",
          icon: "Cpu",
        },
        {
          title: "Data-Driven Verification",
          description: "Every optimization is verified through real Googlebot crawl logs and synthetic lab benchmarks.",
          icon: "ShieldCheck",
        },
        {
          title: "White-Hat & Future-Proof",
          description: "We strictly follow Google Webmaster guidelines to protect your domain from search penalty risks.",
          icon: "Shield",
        },
      ],
      faqs: [
        {
          question: "How is Technical SEO different from standard content SEO?",
          answer: "Content SEO focuses on keywords and copywriting, while Technical SEO ensures search bots can discover, render, and index that content without errors. If your technical foundation is slow or broken, great content will never rank.",
        },
        {
          question: "How quickly can we see improvements after Technical SEO remediation?",
          answer: "Core Web Vitals scores improve immediately upon code deployment. Google search ranking improvements typically reflect within 3 to 6 weeks as search engines re-crawl your updated pages.",
        },
        {
          question: "Do you fix JavaScript rendering issues for Single Page Applications (SPAs)?",
          answer: "Yes. We specialize in converting client-rendered SPAs to server-side or edge-rendered architectures so search bots see 100% of your HTML without relying on fragile JavaScript execution.",
        },
      ],
      relatedServiceSlugs: ["web-development", "custom-software", "ai-automation"],
      metaTitle: "Technical SEO & Core Web Vitals Optimization Services | Kas Denge",
      metaDescription: "Engineering-grade Technical SEO optimization. Master Google Core Web Vitals, implement rich Schema.org structured data, and dominate organic search rankings.",
      keywords: ["technical seo agency", "core web vitals optimization", "schema org json ld", "nextjs seo", "website speed optimization"],
      order: 5,
      isActive: true,
    },
    {
      title: "AI Automation",
      slug: "ai-automation",
      tagline: "Applied Enterprise AI, Retrieval-Augmented Generation (RAG) & Autonomous Workflows",
      heroBadge: "APPLIED INTELLIGENCE",
      icon: "Cpu",
      shortDescription: "LLM integration, automated workflows, and intelligent agents that multiply team productivity.",
      fullDescription: "We help businesses harness the power of artificial intelligence through practical, high-ROI implementations. From custom RAG pipelines that query your internal knowledge base to autonomous agents that handle customer support and document processing, we integrate state-of-the-art models into your daily operations securely and cost-effectively.",
      targetAudience: [
        "Enterprises seeking to automate repetitive back-office document processing and verification",
        "SaaS companies looking to build native AI copilot features into their existing software products",
        "Customer support teams aiming to resolve 70%+ of routine inquiries with intelligent agents",
        "Healthcare, legal, and financial firms requiring privacy-preserving, self-hosted LLM solutions",
      ],
      problemsSolved: [
        {
          problem: "High employee overhead spent manually summarizing documents, classifying emails, and entering data.",
          solution: "We build autonomous multi-step AI agents that extract, validate, and write data directly into your database with human-in-the-loop controls.",
        },
        {
          problem: "Off-the-shelf AI models hallucinating or leaking confidential corporate data to public model providers.",
          solution: "We architect private RAG pipelines with localized vector databases, strict permission filtering, and privacy-preserving gateways.",
        },
        {
          problem: "High API costs and slow response latencies when integrating large language models directly.",
          solution: "We implement prompt caching, model quantization, and hybrid routing between fast small models and heavy reasoning models.",
        },
      ],
      features: [
        {
          title: "Custom RAG & Vector Search",
          description: "High-accuracy semantic search querying your internal PDFs, databases, and Notion/Confluence docs.",
          icon: "Database",
        },
        {
          title: "Autonomous Multi-Step Agents",
          description: "LangChain / LlamaIndex agents capable of tool-calling, API execution, and structured reasoning.",
          icon: "Cpu",
        },
        {
          title: "Privacy-Preserving AI Gateways",
          description: "Zero data retention enterprise integrations with OpenAI, Anthropic, and self-hosted Ollama/vLLM models.",
          icon: "Shield",
        },
        {
          title: "Streaming UI & Copilot Dashboards",
          description: "Real-time token streaming interfaces with markdown rendering, syntax highlighting, and citation tracking.",
          icon: "Zap",
        },
      ],
      deliverables: [
        "Production AI agent backend integrated with your existing databases and APIs",
        "Custom Vector Database (Pinecone / Pgvector / Qdrant) with automated ingestion pipeline",
        "Real-time streaming chat / copilot interface embedded directly in your web app",
        "Model evaluation benchmarks and automated prompt regression test suites",
        "Data privacy compliance documentation and self-hosting runbooks",
      ],
      benefits: [
        {
          title: "70% Ticket Deflection",
          description: "Resolve routine customer support and internal IT inquiries automatically without human intervention.",
          metric: "70% Automated",
          icon: "TrendingUp",
        },
        {
          title: "Sub-Second Semantic Retrieval",
          description: "Retrieve exact corporate knowledge and citations from millions of unstructured documents in milliseconds.",
          metric: "< 200ms Vector Search",
          icon: "Zap",
        },
        {
          title: "100% Data Confidentiality",
          description: "Guaranteed zero training on your corporate IP with enterprise encryption.",
          metric: "Zero Data Leaks",
          icon: "Shield",
        },
        {
          title: "Immediate Operational ROI",
          description: "Multiply individual employee output without expanding headcount.",
          metric: "5x Team Output",
          icon: "Cpu",
        },
      ],
      process: [
        {
          step: 1,
          title: "AI Feasibility & ROI Assessment",
          description: "We audit your data sources, accuracy requirements, latency targets, and compute budget.",
          duration: "Week 1",
        },
        {
          step: 2,
          title: "Data Pipeline & Vector Ingestion",
          description: "Parsing, chunking, and embedding unstructured documents into an optimized vector database.",
          duration: "Week 2 - 3",
        },
        {
          step: 3,
          title: "Agent Architecture & Prompt Engineering",
          description: "Designing multi-agent workflows, tool integrations, and fallback safety guards.",
          duration: "Week 4 - 6",
        },
        {
          step: 4,
          title: "Evaluation & Ground Truth Benchmarking",
          description: "Testing accuracy against hundreds of real-world queries to eliminate hallucinations.",
          duration: "Week 7",
        },
        {
          step: 5,
          title: "Frontend Integration & Streaming UI",
          description: "Embedding the AI copilot into your production web or mobile app with real-time token streaming.",
          duration: "Week 8",
        },
        {
          step: 6,
          title: "Production Monitoring & Fine-Tuning",
          description: "Tracking token spend, latency, user feedback loops, and fine-tuning model parameters.",
          duration: "Ongoing",
        },
      ],
      technologies: [
        { name: "OpenAI & Anthropic", category: "Foundation Models", icon: "Cpu" },
        { name: "Llama 3 / vLLM", category: "Open Source / Self-Hosted", icon: "Server" },
        { name: "LangChain & LlamaIndex", category: "Agent Framework", icon: "Layers" },
        { name: "Pgvector & Pinecone", category: "Vector Database", icon: "Database" },
        { name: "Python & FastAPI", category: "Backend", icon: "Code2" },
        { name: "Next.js AI SDK", category: "Frontend Streaming", icon: "Globe" },
      ],
      whyChooseUs: [
        {
          title: "Practical, ROI-First AI",
          description: "We don't build AI toys or gimmicks. We engineer mission-critical automations that solve real operational bottlenecks.",
          icon: "ShieldCheck",
        },
        {
          title: "Security & Privacy Experts",
          description: "We design compliant architectures that protect your proprietary data from model training risks.",
          icon: "Shield",
        },
        {
          title: "Hybrid Model Routing",
          description: "We optimize your token costs by routing simple tasks to lightweight models and complex reasoning to frontier LLMs.",
          icon: "Zap",
        },
      ],
      faqs: [
        {
          question: "Will our proprietary business data be used to train public AI models?",
          answer: "No. We utilize enterprise API agreements with zero-data-retention guarantees, or deploy completely private open-source models (like Llama 3) inside your own isolated cloud VPC.",
        },
        {
          question: "How do you prevent hallucinations in AI-generated answers?",
          answer: "We implement Retrieval-Augmented Generation (RAG) with strict semantic chunking, re-ranking, and prompt constraints that instruct the model to answer only using verified context with exact citations.",
        },
        {
          question: "Can the AI agent take actions in our existing software tools?",
          answer: "Yes. Through function calling and API tool integration, our agents can update database records, send emails, generate invoices, and trigger backend workflows securely.",
        },
      ],
      relatedServiceSlugs: ["custom-software", "web-development", "erp-software"],
      metaTitle: "AI Automation & Custom RAG Development Services | Kas Denge",
      metaDescription: "Enterprise AI automation, custom RAG pipelines, and intelligent multi-step agents. Secure, private LLM integrations that multiply team productivity.",
      keywords: ["ai automation agency", "custom rag development", "enterprise llm integration", "ai agents", "langchain developers"],
      order: 6,
      isActive: true,
    },
  ];

  for (const svc of initialServices) {
    await Service.findOneAndUpdate({ slug: svc.slug }, { $set: svc }, { upsert: true, returnDocument: 'after' });
  }
  console.log(`   Processed ${initialServices.length} services.`);

  // 3. Products
  console.log("📦 Seeding Products...");
  const initialProducts = [
    {
      name: "Nexus ERP",
      slug: "nexus-erp",
      tagline: "All-in-One Enterprise Resource Planning Built for Modern Operational Agility",
      description: "Nexus ERP provides mid-market and enterprise businesses with a modern, real-time command center. Eliminate data silos between accounting, supply chain, inventory, and human capital with intelligent automated workflows.",
      fullDescription: "Nexus ERP transforms fragmented enterprise operations into a unified, synchronized command center. Engineered on event-driven microservices and high-throughput transactional databases, Nexus eliminates spreadsheet bottlenecks across multi-location supply chains, automated double-entry accounting, real-time warehouse inventory management, and vendor procurement. With custom role-based access control, cryptographic audit logs, and self-hosted private cloud deployment options, Nexus delivers enterprise-grade power without perpetual per-seat license penalties.",
      category: "ERP",
      heroBadge: "ENTERPRISE OPERATIONS HUB",
      features: [
        {
          title: "Multi-Warehouse Inventory Matrix",
          description: "Real-time stock tracking across dozens of global locations with automated replenishment thresholds and lot tracking.",
          icon: "Package",
        },
        {
          title: "Double-Entry Financial Ledger",
          description: "Automated accounts payable/receivable, multi-currency reconciliations, tax calculations, and instant balance sheet exports.",
          icon: "Banknote",
        },
        {
          title: "Autonomous Procurement Routing",
          description: "Automated vendor purchase order generation, supplier scorecards, and multi-tier approval authorization trees.",
          icon: "Factory",
        },
        {
          title: "Real-Time BI Telemetry Engine",
          description: "Live executive analytics dashboards, hourly revenue velocity tracking, and customizable CSV/PDF financial reporting.",
          icon: "BarChart3",
        },
      ],
      modules: [
        {
          name: "Financial Command",
          description: "Automated general ledger, accounts payable/receivable, and multi-currency tax reconciliation.",
          icon: "Banknote",
          capabilities: ["General Ledger & Chart of Accounts", "Automated Invoice Generation", "Multi-Currency Reconciliation", "Tax Filing & Audit Exports"],
        },
        {
          name: "Inventory Matrix",
          description: "Multi-warehouse stock tracking, bin management, and intelligent automated reorder triggers.",
          icon: "Package",
          capabilities: ["Multi-Location SKU Matrix", "Barcoding & Lot/Serial Tracking", "Automated Safety Stock Reordering", "Cross-Warehouse Transfer Queues"],
        },
        {
          name: "Procurement & Supply Chain",
          description: "Supplier management, vendor PO tracking, and automated multi-tier approval workflows.",
          icon: "Factory",
          capabilities: ["Vendor Portal & Scorecards", "Automated PO Generation", "Three-Way Invoice Matching", "Fulfillment Route Tracking"],
        },
        {
          name: "Human Capital & Roles",
          description: "Employee role matrix, departmental permissions, and granular action authorization logs.",
          icon: "Users",
          capabilities: ["Granular Field-Level RBAC", "SOC2 Compliance Audit Trail", "Single Sign-On (SAML/Okta)", "Session IP White-Listing"],
        },
      ],
      benefits: [
        {
          title: "80% Reduction in Admin Overhead",
          description: "Eliminate manual spreadsheet entry and redundant inter-departmental email approvals.",
          metric: "80% Time Saved",
          icon: "Zap",
        },
        {
          title: "Zero Per-Seat License Fees",
          description: "Scale your organization from 50 to 10,000 operators with zero escalating software seat penalties.",
          metric: "$0 Per-Seat Fees",
          icon: "TrendingUp",
        },
        {
          title: "Sub-Second Data Synchronization",
          description: "All transactions and inventory shifts reflect across worldwide facilities in under 200ms.",
          metric: "< 200ms Sync",
          icon: "Database",
        },
        {
          title: "SOC2 Type II Ready Architecture",
          description: "Cryptographic audit logging, encrypted storage at rest, and field-level role authorizations.",
          metric: "SOC2 Compliant",
          icon: "Shield",
        },
      ],
      useCases: [
        {
          title: "Multi-Location Wholesale Distribution",
          industry: "Logistics & Wholesale",
          problem: "A distributor with 6 regional warehouses was losing hundreds of thousands due to inventory discrepancies and delayed order fulfillments.",
          solution: "Nexus ERP centralized stock counts with real-time barcode scanning and automated inter-warehouse transfer orders.",
          outcome: "Decreased stockout events by 74% and accelerated order fulfillment cycles from 48 hours to under 6 hours.",
        },
        {
          title: "Precision Discrete Manufacturing",
          industry: "Industrial Manufacturing",
          problem: "Bill-of-materials (BOM) tracking and supplier purchase orders were managed across fragmented Excel sheets, causing production line halts.",
          solution: "Implemented Nexus ERP with automated three-way invoice matching and production floor job routing.",
          outcome: "Reduced factory downtime by 91% and cut raw material carrying costs by $240,000 in the first fiscal year.",
        },
        {
          title: "High-Growth Omnichannel Retail Brand",
          industry: "Retail & E-Commerce",
          problem: "Selling across Shopify, physical boutiques, and Amazon caused frequent inventory overselling and manual bookkeeping chaos.",
          solution: "Deployed Nexus ERP with bidirectional POS & e-commerce API webhooks and automated general ledger posting.",
          outcome: "Achieved 100% stock accuracy across all sales channels with zero manual reconciliations required at month-end.",
        },
      ],
      technologies: [
        { name: "Next.js 15", category: "Frontend Core", icon: "Globe" },
        { name: "TypeScript", category: "Language", icon: "Code2" },
        { name: "PostgreSQL", category: "Primary Relational DB", icon: "Database" },
        { name: "Redis", category: "In-Memory Cache & Queues", icon: "Zap" },
        { name: "Kafka", category: "Event Streaming", icon: "Layers" },
        { name: "Docker & Kubernetes", category: "Container Orchestration", icon: "Cloud" },
        { name: "Go Microservices", category: "High-Throughput Backend", icon: "Server" },
      ],
      integrations: ["Stripe", "QuickBooks", "Shopify Plus", "Amazon SP-API", "Salesforce", "FedEx / UPS Webhooks", "Okta SSO", "Slack Alerts"],
      targetIndustries: ["Manufacturing & Assembly", "Wholesale & Logistics", "Retail Chains", "Healthcare Supply", "E-Commerce Brands"],
      deploymentOptions: ["Private Cloud VPC (AWS / GCP / Azure)", "Dedicated Self-Hosted Kubernetes", "Managed Cloud Enterprise"],
      securityCompliance: ["SOC2 Type II Ready", "GDPR & CCPA Compliant", "TLS 1.3 & AES-256 Encryption", "Immutable Cryptographic Audit Trails", "Multi-Factor Authentication (MFA)"],
      specifications: [
        { label: "Architecture", value: "Event-Driven Distributed Microservices" },
        { label: "Database Engine", value: "PostgreSQL 16 + Redis Cluster" },
        { label: "API Protocol", value: "RESTful JSON + GraphQL + WebSocket Pub/Sub" },
        { label: "Throughput Capacity", value: "15,000+ concurrent transactions / sec" },
        { label: "Deployment Footprint", value: "Docker / Helm Charts / Terraform" },
        { label: "Code Ownership", value: "100% Full IP Transfer & Source Code Rights" },
      ],
      faqs: [
        {
          question: "Can Nexus ERP be customized to match our exact departmental workflows?",
          answer: "Yes. Nexus is architected with a modular plugin system and fully accessible TypeScript code. We customize schemas, workflow approval chains, and external API connectors to mirror your exact business rules.",
        },
        {
          question: "How do you migrate historical data from SAP, Oracle, or QuickBooks?",
          answer: "We develop dedicated ETL data pipelines that sanitize, validate, and migrate your chart of accounts, historical transactions, customer records, and vendor catalogs with zero data loss and automated balancing checks.",
        },
        {
          question: "Can Nexus run in our private AWS or GCP cloud environment?",
          answer: "Absolutely. We provide production-ready Terraform scripts and Kubernetes Helm charts to deploy Nexus directly within your private VPC with complete database sovereignty.",
        },
      ],
      images: [],
      demoUrl: "https://demo.kasdenge.com/nexus-erp",
      metaTitle: "Nexus ERP — Modern Enterprise Resource Planning Platform | Kas Denge",
      metaDescription: "All-in-one customizable enterprise ERP system. Unify inventory, accounting, supply chain, and HR operations with zero per-seat licensing fees.",
      keywords: ["custom erp software", "enterprise resource planning", "inventory management system", "open erp platform", "supply chain erp"],
      isActive: true,
      order: 1,
    },
    {
      name: "Pulse HRMS",
      slug: "pulse-hrms",
      tagline: "Next-Generation Human Capital Management & Automated People Operations",
      description: "Transform your people operations with automated onboarding, biometric time tracking, continuous performance reviews, and self-service payroll portals designed for distributed teams.",
      fullDescription: "Pulse HRMS is an intuitive, all-in-one people operations platform engineered for modern remote, hybrid, and in-office organizations. Pulse replaces messy HR paperwork with digital document e-signatures, automated self-service onboarding, configurable leave policy workflows, biometric and geo-fenced attendance logging, 360-degree performance review cycles, and one-click localized payroll calculations. Built with enterprise security and strict role-based access control, Pulse keeps employee data safe while saving HR teams dozens of hours every payroll cycle.",
      category: "HRMS",
      heroBadge: "PEOPLE OPERATIONS SUITE",
      features: [
        {
          title: "Self-Guided Digital Onboarding",
          description: "Paperless employee onboarding with automated document collection, e-signatures, and IT asset allocation checklists.",
          icon: "Users",
        },
        {
          title: "Biometric & Geo-Fenced Time Tracking",
          description: "Real-time attendance logging supporting physical biometric terminals, mobile GPS fencing, and shift scheduling.",
          icon: "Clock",
        },
        {
          title: "Multi-Tier Payroll & Tax Engine",
          description: "Automated salary disbursements, overtime calculations, tax deductions, and one-click payslip distribution.",
          icon: "Banknote",
        },
        {
          title: "360-Degree Continuous Reviews",
          description: "Quarterly OKR tracking, peer feedback rubrics, and automated performance appraisal summaries.",
          icon: "TrendingUp",
        },
      ],
      modules: [
        {
          name: "Onboarding & Lifecycle",
          description: "Digital offer letters, automated compliance paperwork collection, and asset tracking.",
          icon: "Users",
          capabilities: ["E-Signature Document Signoff", "Automated Welcome Portals", "Hardware & IT Asset Tagging", "Emergency Contact Registry"],
        },
        {
          name: "Payroll & Compensation",
          description: "One-click salary disbursement, direct deposit exports, tax deductions, and bonuses.",
          icon: "Banknote",
          capabilities: ["Multi-Currency Salary Disbursement", "Tax & Statutory Benefit Calculations", "Automated PDF Payslip Generation", "Expense Reimbursement Approvals"],
        },
        {
          name: "Time & Attendance",
          description: "Geo-fenced mobile clock-in, shift scheduling matrices, and leave balances.",
          icon: "Clock",
          capabilities: ["Biometric Hardware Integration", "Configurable PTO & Sick Leave Policies", "Shift Rotation Scheduling", "Overtime & Holiday Automation"],
        },
        {
          name: "Talent & Performance",
          description: "Goal alignment, 360 peer feedback, and structured promotion ladders.",
          icon: "Briefcase",
          capabilities: ["OKR & KPI Goal Tracking", "Quarterly Review Cycles", "Anonymous 360 Feedback", "Skills Matrix & Training Logs"],
        },
      ],
      benefits: [
        {
          title: "15+ Hours Saved Per Pay Period",
          description: "Automate manual timecard verification, tax withholding calculations, and payslip generation.",
          metric: "15 hrs Saved",
          icon: "Zap",
        },
        {
          title: "100% Paperless HR Workflows",
          description: "Eliminate physical file cabinets with secure digital document storage and audit logs.",
          metric: "100% Digital",
          icon: "CheckCircle2",
        },
        {
          title: "Zero Payroll Discrepancies",
          description: "Direct integration between biometric attendance and payroll math guarantees zero human error.",
          metric: "0% Math Errors",
          icon: "Shield",
        },
        {
          title: "Higher Employee Satisfaction",
          description: "Self-service mobile portals empower staff to request PTO and view tax forms in seconds.",
          metric: "94% Employee NPS",
          icon: "TrendingUp",
        },
      ],
      useCases: [
        {
          title: "Distributed Remote Tech Workforce",
          industry: "Technology & Professional Services",
          problem: "Managing international contractors and full-time staff across 12 time zones with separate spreadsheets created payroll chaos.",
          solution: "Pulse HRMS unified team onboarding, multi-currency payouts, and digital PTO approvals into a single dashboard.",
          outcome: "Reduced payroll processing time from 4 days to 45 minutes with zero cross-border tax calculation errors.",
        },
        {
          title: "Multi-Branch Healthcare Clinic Group",
          industry: "Healthcare & Clinics",
          problem: "Scheduling rotating nursing shifts and tracking overtime compliance across 8 clinic locations was causing labor disputes.",
          solution: "Deployed Pulse HRMS with biometric fingerprint clock-ins and automated overtime alert rules.",
          outcome: "Eliminated buddy-punching, recovered $180,000 in unverified overtime claims, and achieved 100% labor audit compliance.",
        },
        {
          title: "Retail & Hospitality Chain",
          industry: "Retail & Hospitality",
          problem: "High employee turnover required HR staff to spend entire weeks manually re-entering new hire documents into legacy payroll.",
          solution: "Introduced self-guided mobile onboarding where new hires complete profiles on their smartphones prior to day one.",
          outcome: "Cut HR onboarding admin time by 85% and increased day-one employee readiness to 100%.",
        },
      ],
      technologies: [
        { name: "React 19 & Next.js", category: "Frontend Framework", icon: "Globe" },
        { name: "TypeScript", category: "Language", icon: "Code2" },
        { name: "Node.js", category: "Backend Engine", icon: "Server" },
        { name: "PostgreSQL", category: "Employee Database", icon: "Database" },
        { name: "Redis", category: "Session & Event Cache", icon: "Zap" },
        { name: "AWS S3 Encrypted", category: "Secure Document Vault", icon: "Cloud" },
      ],
      integrations: ["Slack Notifications", "Google Workspace", "Microsoft 365", "Stripe Connect", "QuickBooks Payroll", "Biometric Terminal Webhooks", "DocuSign API"],
      targetIndustries: ["Technology Companies", "Healthcare & Clinics", "Retail & Hospitality", "Professional Services", "Financial Institutions"],
      deploymentOptions: ["Secure Managed Cloud", "Dedicated Private VPC", "On-Premises Corporate Server"],
      securityCompliance: ["HIPAA Ready for Healthcare HR", "GDPR & CCPA Compliant", "AES-256 Encrypted Vault", "Granular Role-Based Permissions", "Two-Factor Authentication (2FA)"],
      specifications: [
        { label: "Deployment Architecture", value: "Modular Cloud-Native Web Application" },
        { label: "Database Technology", value: "PostgreSQL with Row-Level Security" },
        { label: "Document Storage", value: "AES-256 Server-Side Encrypted S3 Vault" },
        { label: "Authentication Support", value: "SAML 2.0 / OAuth2 / Okta / Azure AD" },
        { label: "Mobile Support", value: "Progressive Web App + Responsive Mobile UI" },
      ],
      faqs: [
        {
          question: "Can Pulse HRMS integrate with our existing biometric time clocks?",
          answer: "Yes. Pulse provides native webhook receivers and IP-based hardware connectors for major biometric fingerprint and facial recognition attendance terminals.",
        },
        {
          question: "How does Pulse protect sensitive employee compensation and tax records?",
          answer: "All document files are stored in AES-256 encrypted object vaults with strict row-level security. Salary numbers and SSN/tax IDs are masked by default and accessible only by authorized HR administrators.",
        },
        {
          question: "Can employees access Pulse on mobile phones?",
          answer: "Yes. Pulse is built with a mobile-first responsive architecture that allows employees to check in with GPS geo-fencing, request leaves, and download payslips directly on iOS and Android devices.",
        },
      ],
      images: [],
      demoUrl: "https://demo.kasdenge.com/pulse-hrms",
      metaTitle: "Pulse HRMS — Next-Gen People Operations & Payroll Platform | Kas Denge",
      metaDescription: "All-in-one HRMS software for modern distributed teams. Automate employee onboarding, biometric attendance, performance reviews, and payroll disbursements.",
      keywords: ["hrms software", "human resource management system", "payroll software", "employee onboarding platform", "attendance tracking software"],
      isActive: true,
      order: 2,
    },
    {
      name: "Apex POS",
      slug: "apex-pos",
      tagline: "Ultra-Fast Cloud Point of Sale Engineered for High-Volume Retail & Hospitality",
      description: "Keep lines moving and customers delighted with sub-second order processing, offline transaction queuing, unified multi-store inventory synchronization, and omnichannel loyalty programs.",
      fullDescription: "Apex POS is a blazing fast cloud point-of-sale platform built specifically for high-velocity retail stores, multi-location restaurant franchises, and omnichannel brands. Engineered with an offline-first local database, Apex continues processing credit card transactions, barcode scans, and kitchen ticket printing even during complete internet blackouts. With sub-second barcode recognition, real-time multi-store inventory updates, and integrated contactless payment terminals, Apex ensures you never lose a sale during peak rushes.",
      category: "POS",
      heroBadge: "POINT OF SALE ENGINE",
      features: [
        {
          title: "Offline-First Resilient Architecture",
          description: "Continue scanning items, ringing transactions, and printing kitchen tickets with zero internet connectivity.",
          icon: "Shield",
        },
        {
          title: "Sub-Second Barcode & NFC Checkout",
          description: "Ultra-responsive touch terminal with instant barcode recognition and integrated contactless EMV/Apple Pay support.",
          icon: "ShoppingCart",
        },
        {
          title: "Real-Time Multi-Store Inventory",
          description: "Live cross-store stock lookups, instant inter-store item transfers, and automated low-stock reorder alerts.",
          icon: "Package",
        },
        {
          title: "Kitchen Display (KDS) & Order Routing",
          description: "Intelligent ticket routing to kitchen prep stations with color-coded countdown timers and table management.",
          icon: "Factory",
        },
      ],
      modules: [
        {
          name: "Register Terminal",
          description: "Blazing fast checkout interface optimized for capacitive touchscreens, barcoding, and split payments.",
          icon: "ShoppingCart",
          capabilities: ["Sub-Second Item Lookup", "Split Tender & Custom Discounts", "Offline Transaction Cache", "Thermal & Digital Receipt Delivery"],
        },
        {
          name: "Kitchen Display (KDS)",
          description: "Real-time kitchen order ticket routing and food prep timing management.",
          icon: "Factory",
          capabilities: ["Station-Based Ticket Splitting", "Color-Coded Rush Timers", "Order Modifier Highlighting", "Expo Station Recall"],
        },
        {
          name: "Omnichannel Inventory",
          description: "Unified stock synchronization across physical registers, e-commerce stores, and backroom storage.",
          icon: "Package",
          capabilities: ["Live Multi-Store Stock Lookups", "Barcode Generation & Printing", "Automated Low-Stock POs", "Inventory Variance Audit Logs"],
        },
        {
          name: "Analytics & Loyalty",
          description: "Hourly sales velocity analysis, gross margin reporting, and automated customer reward points.",
          icon: "Banknote",
          capabilities: ["Hourly Sales & Peak Rush Metrics", "Employee Commission Tracking", "Customer Loyalty Points Engine", "Custom Product Margin Reporting"],
        },
      ],
      benefits: [
        {
          title: "Sub-30 Second Transaction Time",
          description: "Process long lines twice as fast with instant barcode lookups and split payments.",
          metric: "< 30s Checkout",
          icon: "Zap",
        },
        {
          title: "100% Zero Outage Downtime",
          description: "Offline-first queuing ensures sales continue seamlessly during internet disruptions.",
          metric: "Zero Downtime",
          icon: "Shield",
        },
        {
          title: "Real-Time Multi-Store Visibility",
          description: "Monitor live sales figures, margin velocity, and stock across all stores from any device.",
          metric: "Live Telemetry",
          icon: "Database",
        },
        {
          title: "28% Lift in Repeat Customer Spend",
          description: "Automated SMS/email receipt loyalty rewards drive predictable recurring visits.",
          metric: "+28% Repeat Spend",
          icon: "TrendingUp",
        },
      ],
      useCases: [
        {
          title: "Multi-Location Retail Fashion Chain",
          industry: "Retail & Apparel",
          problem: "Customers frequently left stores when sizes were out of stock because cashiers had no way to check other branch inventory.",
          solution: "Apex POS enabled cross-store stock lookups and click-and-collect orders directly on the register screen.",
          outcome: "Captured $320,000 in previously lost cross-store sales in the first 6 months of rollout.",
        },
        {
          title: "High-Volume Quick Service Restaurant (QSR)",
          industry: "Hospitality & QSR",
          problem: "Lunch rush internet drops crashed traditional cloud POS tablets, leaving hundreds of customers unable to pay.",
          solution: "Deployed Apex POS with offline transaction queuing and local WebSocket kitchen display routing.",
          outcome: "Zero lost sales recorded across 14 months and reduced average drive-thru ticket times by 42 seconds.",
        },
        {
          title: "Omnichannel Boutique & E-Commerce",
          industry: "Boutique & Specialty Retail",
          problem: "Selling on Shopify while ringing sales in-store caused daily overselling and inventory count headaches.",
          solution: "Integrated Apex POS with bidirectional Shopify inventory webhooks for real-time SKU stock deductions.",
          outcome: "Achieved 100% inventory synchronization with zero overselling incidents.",
        },
      ],
      technologies: [
        { name: "React 19 & TypeScript", category: "Terminal Interface", icon: "Globe" },
        { name: "SQLite / IndexedDB", category: "Offline Local Store", icon: "Database" },
        { name: "Node.js & WebSockets", category: "Real-Time Sync", icon: "Server" },
        { name: "PostgreSQL", category: "Cloud Database", icon: "Database" },
        { name: "Redis", category: "Pub/Sub Queues", icon: "Zap" },
        { name: "Docker", category: "Cloud Backend", icon: "Cloud" },
      ],
      integrations: ["Stripe Terminal", "Square Hardware", "Shopify Plus", "WooCommerce", "Star Micronics Printers", "Epson Thermal KDS", "QuickBooks POS"],
      targetIndustries: ["Retail & Boutiques", "Quick Service Restaurants (QSR)", "Cafes & Bars", "Wholesale Showrooms", "Franchise Chains"],
      deploymentOptions: ["Cloud-Synchronized Hybrid", "On-Premises Local Server", "Dedicated Franchise Cloud"],
      securityCompliance: ["PCI-DSS Level 1 Compliant", "End-to-End Payment Encryption (P2PE)", "Role-Based Cash Drawer Authorization", "Blind Cash Drop Audit Logs"],
      specifications: [
        { label: "Offline Capability", value: "Full Local SQLite Transaction Caching" },
        { label: "Peripheral Support", value: "Thermal Printers, Barcode Scanners, EMV Terminals, Cash Drawers" },
        { label: "Hardware Compatibility", value: "iPad, Android Tablets, Windows Touch Terminals, Mac" },
        { label: "Sync Latency", value: "< 150ms WebSocket Broadcast" },
        { label: "Payment Processing", value: "Stripe Terminal, Adyen, Square, Worldpay, EMV Contactless" },
      ],
      faqs: [
        {
          question: "What happens if our store loses internet connectivity during peak business hours?",
          answer: "Apex POS continues operating 100% uninterrupted. It scans barcodes, processes credit card charges in secure offline store-and-forward mode, and prints tickets locally. When internet returns, all transactions sync automatically.",
        },
        {
          question: "Which hardware devices and receipt printers does Apex support?",
          answer: "Apex supports industry-standard peripherals including Epson and Star Micronics thermal receipt printers, Zebra/Honeywell barcode scanners, APG cash drawers, and Stripe Terminal/Square payment readers.",
        },
        {
          question: "Can Apex synchronize inventory with our existing Shopify or WooCommerce online store?",
          answer: "Yes. Apex has native bidirectional synchronization for Shopify and WooCommerce. When an item is sold in your physical store, online stock updates instantly to prevent overselling.",
        },
      ],
      images: [],
      demoUrl: "https://demo.kasdenge.com/apex-pos",
      metaTitle: "Apex POS — Ultra-Fast Cloud Point of Sale Platform | Kas Denge",
      metaDescription: "High-performance cloud POS system with offline-first transaction support, real-time multi-store inventory synchronization, and integrated kitchen display routing.",
      keywords: ["cloud pos system", "point of sale software", "offline pos software", "multi-store inventory pos", "restaurant kitchen display system"],
      isActive: true,
      order: 3,
    },
    {
      name: "Clarity CRM",
      slug: "clarity-crm",
      tagline: "High-Velocity Revenue Intelligence & Unified B2B Customer Operations",
      description: "Supercharge sales pipelines with automated contact discovery, AI email sequence generation, real-time deal stage tracking, and bidirectional communication sync.",
      fullDescription: "Clarity CRM is an enterprise-grade revenue engine designed for high-growth B2B sales teams and client service agencies. Clarity unifies fragmented customer interactions across email, calendar, WhatsApp, and phone calls into a single real-time timeline. With automated lead enrichment, predictive win-rate scoring, visual drag-and-drop pipeline stages, and seamless CPQ (Configure, Price, Quote) proposal generators, Clarity empowers revenue teams to close deals 3x faster without administrative fatigue.",
      category: "CRM",
      heroBadge: "REVENUE ENGINE",
      features: [
        {
          title: "Automated Communication Timeline",
          description: "Zero manual data entry. Auto-syncs inbound and outbound emails, Zoom recordings, calendar invites, and SMS chats directly to contact cards.",
          icon: "Zap",
        },
        {
          title: "Visual Deal Pipeline & Stage Automation",
          description: "Customizable multi-stage kanban pipelines with automated task reminders, stage stagnation alerts, and probability weighting.",
          icon: "TrendingUp",
        },
        {
          title: "AI Lead Scoring & Enrichment",
          description: "Enriches incoming leads with company headcount, revenue estimates, and tech stack tags to prioritize high-intent accounts.",
          icon: "Cpu",
        },
        {
          title: "Integrated CPQ & Proposal Engine",
          description: "Generate professional branded quotes, contracts, and proposals with e-signature tracking directly from the opportunity card.",
          icon: "Briefcase",
        },
      ],
      modules: [
        {
          name: "Pipeline & Deals",
          description: "Multi-currency deal tracking, stage customization, and visual revenue velocity forecasting.",
          icon: "TrendingUp",
          capabilities: ["Custom Kanban Pipelines", "Deal Stagnation Triggers", "Weighted Revenue Forecasting", "Competitor Win/Loss Analytics"],
        },
        {
          name: "Contact & Account 360",
          description: "Unified relationship intelligence with automatic email timeline sync and firmographic enrichment.",
          icon: "Users",
          capabilities: ["Two-Way Gmail / Outlook Sync", "Firmographic Data Enrichment", "Relationship Hierarchy Mapping", "Custom Property Fields"],
        },
        {
          name: "CPQ & Contract Vault",
          description: "Instant quote generation, price book management, and legally binding digital e-signatures.",
          icon: "Briefcase",
          capabilities: ["Tiered Price Book Catalogs", "One-Click PDF Proposal Builder", "Embedded E-Signatures", "Automated Stripe Invoicing"],
        },
        {
          name: "Omnichannel Sequences",
          description: "Automated multi-step outreach across email, SMS, and LinkedIn task reminders.",
          icon: "Zap",
          capabilities: ["Dynamic Liquid Tag Templates", "A/B Subject Line Testing", "Deliverability Health Tracking", "Spam Filter Verification"],
        },
      ],
      benefits: [
        {
          title: "3x Faster Deal Velocity",
          description: "Automated followup alerts and CPQ proposal generation accelerate average deal closing cycles.",
          metric: "3x Deal Velocity",
          icon: "Zap",
        },
        {
          title: "Zero Manual Data Logging",
          description: "Email, calendar, and phone logs automatically sync in background without salesperson input.",
          metric: "100% Automated Sync",
          icon: "CheckCircle2",
        },
        {
          title: "42% Higher Win Rates",
          description: "AI lead enrichment and deal health indicators pinpoint exactly when to engage key decision makers.",
          metric: "+42% Win Rate",
          icon: "TrendingUp",
        },
        {
          title: "Full Account Governance",
          description: "Role-based visibility permissions protect sensitive commission structures and VIP client terms.",
          metric: "Enterprise RBAC",
          icon: "Shield",
        },
      ],
      useCases: [
        {
          title: "B2B SaaS Sales Organization",
          industry: "Software & Technology",
          problem: "Sales representatives spent 8 hours per week logging email notes and updating opportunity stages manually in a clunky legacy CRM.",
          solution: "Deployed Clarity CRM with native Google Workspace sync, automated stage transition triggers, and AI proposal generation.",
          outcome: "Recovered 7.5 hours per rep weekly for active prospecting and increased quarterly pipeline conversion by 36%.",
        },
        {
          title: "Global Consulting & Advisory Practice",
          industry: "Professional Services",
          problem: "Managing client engagements across multiple partners led to duplicated outreach, missed contract renewals, and fragmented communication history.",
          solution: "Implemented Clarity CRM Account 360 with cross-departmental relationship mapping and automated contract expiration alerts.",
          outcome: "Eliminated client communication overlap and boosted annual retainer renewal rate to 96%.",
        },
        {
          title: "Commercial Real Estate Brokerage",
          industry: "Real Estate & Asset Management",
          problem: "High-value property deals required complex multi-party negotiations involving buyers, lenders, attorneys, and escrow officers.",
          solution: "Leveraged Clarity CRM CPQ document vault with multi-signer e-signatures and encrypted milestone tracking.",
          outcome: "Reduced transaction closing turnaround from 45 days to 18 days with 100% audit compliance.",
        },
      ],
      technologies: [
        { name: "Next.js 15 & React 19", category: "Frontend Core", icon: "Globe" },
        { name: "TypeScript", category: "Language", icon: "Code2" },
        { name: "PostgreSQL", category: "Relational Database", icon: "Database" },
        { name: "Redis", category: "Event Cache & Webhooks", icon: "Zap" },
        { name: "Elasticsearch", category: "Fast Full-Text Search", icon: "Search" },
        { name: "Node.js Microservices", category: "Backend Engine", icon: "Server" },
      ],
      integrations: ["Google Workspace", "Microsoft 365", "Zoom API", "Slack Alerts", "Stripe Billing", "DocuSign", "HubSpot Data Importer", "Zapier Webhooks"],
      targetIndustries: ["B2B SaaS & Tech", "Professional Services & Agencies", "Financial Consulting", "Commercial Real Estate", "Enterprise Sales"],
      deploymentOptions: ["Private Cloud VPC (AWS / Azure)", "Dedicated Kubernetes Cluster", "Secure Managed SaaS"],
      securityCompliance: ["SOC2 Type II Certified", "GDPR & CCPA Compliant", "End-to-End TLS 1.3 Encryption", "Role-Based Field Visibility", "Audit Activity Logging"],
      specifications: [
        { label: "Search Latency", value: "< 50ms across millions of contacts via Elasticsearch" },
        { label: "Email Protocol", value: "Native IMAP/SMTP & OAuth2 Graph API" },
        { label: "E-Signature Standard", value: "ESIGN Act & eIDAS Compliant Cryptographic Hashes" },
        { label: "Custom Fields", value: "Unlimited JSONB dynamic property schema definitions" },
        { label: "API Capabilities", value: "Full REST & GraphQL endpoints with rate-limit guards" },
      ],
      faqs: [
        {
          question: "Can we import our existing contact and deal database from HubSpot or Salesforce?",
          answer: "Yes. Clarity CRM includes automated CSV, HubSpot, and Salesforce migration wizards that map custom fields, historical activity notes, and deal stages with zero data loss.",
        },
        {
          question: "How does the two-way email and calendar synchronization work?",
          answer: "Clarity connects directly via secure OAuth2 tokens to your Google Workspace or Microsoft 365 tenant. Inbound and outbound emails matching contact records are automatically attached to the timeline in real-time.",
        },
        {
          question: "Can we configure different pipeline visibility rules for individual sales teams?",
          answer: "Yes. Clarity features granular Role-Based Access Control (RBAC) that restricts deal access by department, region, seniority, or custom user tags.",
        },
      ],
      images: [],
      demoUrl: "https://demo.kasdenge.com/clarity-crm",
      metaTitle: "Clarity CRM — High-Velocity Revenue & B2B Customer Operations | Kas Denge",
      metaDescription: "Enterprise-grade B2B CRM with automated communication timeline sync, visual pipeline tracking, AI lead enrichment, and built-in CPQ proposal generation.",
      keywords: ["b2b crm software", "sales pipeline management", "revenue intelligence platform", "cpq proposal software", "customer relationship management"],
      isActive: true,
      order: 4,
    },
    {
      name: "Zenith HMS",
      slug: "zenith-hms",
      tagline: "HIPAA-Compliant Hospital Management & Unified Clinical Information System",
      description: "Empower healthcare facilities with integrated electronic health records (EHR), outpatient/inpatient management, digital pharmacy dispensing, and smart doctor scheduling.",
      fullDescription: "Zenith HMS is a comprehensive, mission-critical healthcare operating platform engineered for multi-specialty hospitals, outpatient surgery centers, and regional clinic networks. Built with strict HIPAA and HL7/FHIR compliance, Zenith bridges clinical documentation, patient electronic health records (EHR), digital lab order fulfillment, pharmacy inventory dispensing, and automated insurance claim billing into an encrypted, fault-tolerant unified system. Zenith eliminates clinical documentation delays, protects patient data privacy, and elevates overall standard of care.",
      category: "Hospital",
      heroBadge: "CLINICAL HEALTHCARE OS",
      features: [
        {
          title: "HL7/FHIR Electronic Health Records (EHR)",
          description: "Standardized longitudinal patient health records with clinical charting, allergy alerts, ICD-10 diagnostic codes, and lab results.",
          icon: "ShieldCheck",
        },
        {
          title: "Inpatient Bed & Ward Management",
          description: "Visual real-time bed allocation matrix, ICU occupancy monitors, nurse shift handoffs, and admission/discharge workflows.",
          icon: "Building",
        },
        {
          title: "Closed-Loop Pharmacy & Medication Barcoding",
          description: "E-prescriptions with automated drug interaction checks, barcode-verified dispensing, and batch/expiry inventory tracking.",
          icon: "Package",
        },
        {
          title: "Insurance Claims & Medical Billing Engine",
          description: "Automated EDI 837/835 insurance claim generation, pre-authorization workflows, copay reconciliation, and patient invoicing.",
          icon: "Banknote",
        },
      ],
      modules: [
        {
          name: "Patient EHR & Clinical Portal",
          description: "Longitudinal health records, doctor consultation notes, ICD-10 diagnostics, and digital consent forms.",
          icon: "Users",
          capabilities: ["ICD-10 & SNOMED-CT Diagnosis Codes", "E-Prescriptions & Dosage Calculators", "Vital Signs Trend Visualizer", "Patient Telehealth Video Calls"],
        },
        {
          name: "Inpatient & Bed Allocation",
          description: "Real-time hospital ward occupancy, surgery scheduling, and dietary meal management.",
          icon: "Building",
          capabilities: ["Color-Coded Ward Bed Map", "OT & Surgery Room Scheduling", "Nurse Shift Handoff Notes", "Admission & Discharge Gateways"],
        },
        {
          name: "Laboratory & Radiology (LIS/RIS)",
          description: "Diagnostic test orders, barcode specimen tracking, and DICOM medical imaging viewer integration.",
          icon: "Zap",
          capabilities: ["Barcode Specimen Labeling", "Automated Analyzer Device Sync", "DICOM Web Image Previews", "Critical Value Alert SMS"],
        },
        {
          name: "Pharmacy & Formulary",
          description: "Medication dispensing, batch inventory tracking, and drug-to-drug allergy warnings.",
          icon: "Package",
          capabilities: ["Automated Drug Interaction Checks", "Batch Number & Expiry Audit", "Pharmacy POS & Dispensing Logs", "Emergency Reorder Alerts"],
        },
      ],
      benefits: [
        {
          title: "100% HIPAA & HL7 Compliance",
          description: "Cryptographically encrypted at rest and in transit with comprehensive immutable access audit trails.",
          metric: "HIPAA Compliant",
          icon: "Shield",
        },
        {
          title: "65% Faster Patient Registration",
          description: "Digital self-check-in kiosks and insurance card OCR streamline front desk admissions.",
          metric: "65% Faster Triage",
          icon: "Zap",
        },
        {
          title: "Zero Medication Dispensing Errors",
          description: "Closed-loop barcode verification ensures the right patient receives the exact prescribed dosage.",
          metric: "0% Medication Errors",
          icon: "CheckCircle2",
        },
        {
          title: "92% First-Pass Insurance Claim Acceptance",
          description: "Built-in claim scrubbing and ICD-10 rule validators eliminate costly billing rejections.",
          metric: "92% Claim Acceptance",
          icon: "TrendingUp",
        },
      ],
      useCases: [
        {
          title: "Multi-Specialty 300-Bed Regional Hospital",
          industry: "Healthcare & Inpatient Care",
          problem: "Paper-based patient charts caused delayed lab results, bed allocation bottlenecks, and communication gaps during nursing shift changes.",
          solution: "Deployed Zenith HMS with tablet-based doctor rounding, visual bed management, and automated lab analyzer integrations.",
          outcome: "Reduced average patient admission time by 52 minutes and eliminated nursing handoff documentation errors completely.",
        },
        {
          title: "Outpatient Surgery & Diagnostic Clinic Network",
          industry: "Specialty Surgery Centers",
          problem: "Surgical suite scheduling conflicts and insurance pre-authorization delays led to underutilized operating rooms and lost revenue.",
          solution: "Implemented Zenith HMS Operating Room (OR) scheduler with automated insurance pre-auth tracking and digital consent signing.",
          outcome: "Increased surgical suite utilization by 27% and reduced pre-authorization wait times from 5 days to 24 hours.",
        },
        {
          title: "Diagnostic Imaging & Clinical Pathology Laboratory",
          industry: "Medical Laboratories",
          problem: "Manual transcription of test results from pathology analyzers caused typing errors and delayed physician treatment plans.",
          solution: "Integrated Zenith LIS module with direct TCP/IP analyzer interfaces and automated critical value SMS alerts to doctors.",
          outcome: "Accelerated lab turnaround time by 70% with zero transcription discrepancies recorded.",
        },
      ],
      technologies: [
        { name: "Next.js 15 & React 19", category: "Clinical Frontend", icon: "Globe" },
        { name: "TypeScript", category: "Language", icon: "Code2" },
        { name: "PostgreSQL with RLS", category: "HIPAA Patient DB", icon: "Database" },
        { name: "Redis", category: "Real-Time Bed State", icon: "Zap" },
        { name: "HL7 / FHIR Gateway", category: "Healthcare Interop", icon: "Layers" },
        { name: "DICOM Web Viewer", category: "Medical Imaging", icon: "Server" },
      ],
      integrations: ["HL7 / FHIR APIs", "DICOM PACS Servers", "Epic / Cerner Interop", "Stripe Healthcare", "Twilio HIPAA SMS", "Lab Analyzer Device Drivers", "Change Healthcare EDI"],
      targetIndustries: ["Multi-Specialty Hospitals", "Outpatient Surgery Centers", "Diagnostic Pathology Labs", "Specialty Medical Clinics", "Telehealth Networks"],
      deploymentOptions: ["Isolated Private Cloud VPC (AWS / Azure)", "On-Premises High-Availability Server", "Hybrid Cloud Backup"],
      securityCompliance: ["HIPAA & HITECH Certified", "HL7 v2 / v3 & FHIR R4 Compliant", "SOC2 Type II Healthcare Certified", "AES-256 Patient Data Encryption", "Role-Based Break-Glass Audit Trail"],
      specifications: [
        { label: "Healthcare Interoperability", value: "HL7 v2.x, HL7 v3, FHIR R4, DICOM v3.0" },
        { label: "Security Encryption", value: "FIPS 140-2 validated AES-256 at rest, TLS 1.3 in transit" },
        { label: "Audit Logging", value: "Immutable cryptographic ledger tracking every patient chart access" },
        { label: "Uptime SLA", value: "99.999% High-Availability Multi-Region Failover" },
        { label: "Disaster Recovery", value: "Sub-5 minute Recovery Point Objective (RPO) with continuous replication" },
      ],
      faqs: [
        {
          question: "Is Zenith HMS fully compliant with HIPAA regulations and data encryption standards?",
          answer: "Yes. Zenith HMS is architected from the ground up for strict HIPAA/HITECH compliance. All Protected Health Information (PHI) is encrypted with AES-256 at rest, protected by role-based row-level database security, and tracked with immutable access audit logs.",
        },
        {
          question: "Can Zenith integrate with medical lab analyzers and radiology PACS imaging systems?",
          answer: "Yes. Zenith supports standard HL7, FHIR, and DICOM communication protocols. It connects directly to laboratory diagnostic machines and PACS servers for instantaneous lab result posting and imaging previews.",
        },
        {
          question: "How does Zenith handle hospital deployments during emergency offline scenarios?",
          answer: "Zenith offers hybrid on-premises server clustering with automatic local caching. If the external internet connection goes down, clinical staff can continue charting, admitting patients, and dispensing medications locally without interruption.",
        },
      ],
      images: [],
      demoUrl: "https://demo.kasdenge.com/zenith-hms",
      metaTitle: "Zenith HMS — HIPAA-Compliant Hospital Management Platform | Kas Denge",
      metaDescription: "Comprehensive hospital operating system featuring HL7/FHIR EHR, real-time bed allocation, closed-loop pharmacy dispensing, and automated insurance billing.",
      keywords: ["hospital management software", "ehr electronic health records", "hipaa compliant hms", "clinical information system", "pharmacy dispensing software"],
      isActive: true,
      order: 5,
    },
  ];

  for (const prod of initialProducts) {
    await Product.findOneAndUpdate({ slug: prod.slug }, { $set: prod }, { upsert: true, returnDocument: 'after' });
  }
  console.log(`   Processed ${initialProducts.length} products.`);

  // 4. Portfolio Projects
  console.log("💼 Seeding Portfolio Projects...");
  const initialPortfolio = [
    {
      title: "FinFlow — Real-Time Wealth Analytics",
      slug: "finflow-wealth-analytics",
      category: "Dashboard",
      clientName: "FinEdge Capital",
      industry: "Financial Services & WealthTech",
      oneLiner: "A high-frequency institutional wealth analytics engine streaming millions of live market tickers with sub-15ms latency.",
      shortDescription: "High-frequency wealth management and algorithmic portfolio rebalancing dashboard engineered for institutional hedge funds and family offices.",
      fullDescription: "FinEdge Capital required an ultra-low-latency analytics platform capable of streaming live global ticker data, computing multi-factor risk models, and executing algorithmic portfolio rebalancing without UI frame drops. Kas Denge architected a distributed event-driven system combining Next.js 15, WebGL-accelerated charting, WebSockets, TimescaleDB, and a compiled Go ticker processing pipeline.",
      overview: "FinEdge Capital manages over $420M in alternative assets across multiple sovereign funds. Their existing legacy system suffered from noticeable latency spikes during high-volatility trading hours, leading to delayed decision-making. The mandate was clear: engineer a resilient, sub-second telemetry platform that delivers uncompromised speed, military-grade security, and an executive-level user experience.",
      problem: "FinEdge Capital was struggling with a legacy monolithic portal that lagged during high-volatility market events, dropping frames during live tick bursts, frustrating institutional investors, and creating severe operational risks during rebalancing.",
      solution: "We engineered an edge-rendered Next.js dashboard backed by distributed WebSockets, WebGL chart rendering, and an ultra-low-latency Go microservice layer capable of processing 120,000 events/sec with zero browser freezing.",
      challenges: [
        "Processing burst volumes of up to 120,000 tick updates per second without saturating client-side CPU or causing UI stutter.",
        "Ensuring sub-15ms WebSocket message serialization and distributed synchronization across global trading desks.",
        "Implementing strict SOC2 compliance, encrypted audit trails, and multi-tenant Role-Based Access Control (RBAC).",
      ],
      solutions: [
        "Engineered a dedicated Go microservice for binary WebSocket compression and message deduplication.",
        "Built custom WebGL and Canvas-based financial chart renderers capable of rendering 100k data points at sustained 60 FPS.",
        "Designed a hybrid database architecture utilizing TimescaleDB for time-series tick data and PostgreSQL for relational user models.",
        "Implemented Redis clustering for sub-millisecond session state synchronization across distributed instances.",
      ],
      keyFeatures: [
        {
          title: "Sub-15ms Live Ticker Streaming",
          description: "Binary WebSocket pipeline delivering real-time quotes, depth of market (Level 2), and order book data with zero stutter.",
          icon: "Zap",
        },
        {
          title: "WebGL 60FPS Charting Engine",
          description: "High-performance visual canvas supporting multi-indicator overlays, Fibonacci retracements, and tick-by-tick zoom.",
          icon: "TrendingUp",
        },
        {
          title: "Algorithmic Rebalancing Engine",
          description: "One-click portfolio rebalancing with automated tax-loss harvesting calculations and smart order routing.",
          icon: "Cpu",
        },
        {
          title: "Institutional Audit & RBAC",
          description: "Cryptographically signed compliance audit logs, trader permissions, and granular multi-sign transaction verification.",
          icon: "Shield",
        },
      ],
      results: [
        "Sub-15ms data streaming latency achieved during peak global market trading hours",
        "400% increase in daily active institutional trader engagement",
        "100% zero downtime recorded across 12 consecutive months of continuous operation",
        "Reduced server compute overhead by 62% through binary stream optimization",
      ],
      impactMetrics: [
        { metric: "< 15ms", label: "Stream Latency", description: "Sub-15ms tick latency during peak volatility" },
        { metric: "120k", label: "Events/sec", description: "Sustained event processing throughput" },
        { metric: "99.999%", label: "Uptime SLA", description: "Zero downtime across 12 months" },
        { metric: "62%", label: "Compute Savings", description: "Reduction in cloud infrastructure costs" },
      ],
      techStack: ["Next.js", "TypeScript", "Go", "WebSockets", "TimescaleDB", "PostgreSQL", "Redis", "Tailwind CSS"],
      technologies: [
        { name: "Next.js 15 & React 19", category: "Frontend Core", icon: "Globe" },
        { name: "TypeScript", category: "Language", icon: "Code2" },
        { name: "Go (Golang)", category: "High-Frequency Backend", icon: "Server" },
        { name: "WebSockets / WSS", category: "Real-Time Protocol", icon: "Zap" },
        { name: "TimescaleDB", category: "Time-Series DB", icon: "Database" },
        { name: "PostgreSQL", category: "Relational DB", icon: "Database" },
        { name: "Redis Cluster", category: "Memory Cache", icon: "Layers" },
        { name: "Docker & AWS ECS", category: "Cloud Infrastructure", icon: "Shield" },
      ],
      startDate: "2024-01-15",
      launchDate: "2024-06-30",
      durationLabel: "5.5 Months",
      status: "completed",
      teamMembers: [
        {
          teamMemberSlug: "alex-rivera",
          teamMemberName: "Alex Rivera",
          teamMemberPhoto: "",
          roleOnProject: "Lead Architect & Distributed Systems",
        },
        {
          teamMemberSlug: "marcus-vance",
          teamMemberName: "Marcus Vance",
          teamMemberPhoto: "",
          roleOnProject: "Principal Database Specialist",
        },
      ],
      coverImage: "",
      heroImage: "",
      screenshots: [],
      galleryImages: [],
      liveUrl: "https://finflow.example.com",
      githubUrl: "",
      relatedServiceSlugs: ["web-development", "custom-software", "ai-solutions"],
      testimonial: {
        quote: "Kas Denge took our slow, outdated analytics portal and transformed it into a lightning-fast powerhouse. Their engineering discipline and technical execution are truly world-class.",
        authorName: "David Sterling",
        authorRole: "Chief Technology Officer",
        company: "FinEdge Capital",
      },
      metaTitle: "FinFlow — Real-Time Wealth Analytics Case Study | Kas Denge",
      metaDescription: "How Kas Denge engineered a sub-15ms real-time wealth analytics dashboard processing 120,000 market events per second with Next.js and Go.",
      keywords: ["wealth analytics dashboard", "real-time trading platform", "nextjs financial dashboard", "fintech software engineering"],
      isFeatured: true,
      isActive: true,
      order: 1,
    },
    {
      title: "Aura Commerce — Luxury Headless Storefront",
      slug: "aura-commerce",
      category: "Website",
      clientName: "Aura Paris",
      industry: "Luxury Fashion & E-Commerce",
      oneLiner: "Ultra-fast headless commerce platform with 3D product customization, sub-second global edge caching, and 99+ Core Web Vitals.",
      shortDescription: "A bespoke headless digital storefront for a premier Parisian luxury maison, featuring interactive 3D product customization and global edge delivery.",
      fullDescription: "Aura Paris required an immaculate digital experience matching the heritage of their physical boutiques on Rue Saint-Honoré. Kas Denge built an ultra-fast headless commerce platform on Next.js 15, Shopify Plus GraphQL APIs, Three.js WebGL 3D customization, and Cloudflare Workers global edge caching.",
      overview: "With customers across 34 countries, Aura Paris needed to eliminate sluggish page transitions and high mobile bounce rates while elevating brand perception through interactive 3D product models and flawless checkout ergonomics.",
      problem: "Aura Paris needed an immaculate luxury digital storefront that felt as premium as their physical boutiques, while achieving instantaneous global page loads across 30+ countries without degrading visual fidelity.",
      solution: "We designed a bespoke headless commerce experience with Three.js interactive 3D product customization, sub-second global edge caching, and localized checkout flows that lifted conversion by 42%.",
      challenges: [
        "Rendering interactive, photorealistic 3D luxury leather goods in browser without slowing mobile page load speeds.",
        "Managing multi-currency pricing, VAT calculations, and regional inventory across 34 global fulfillment centers.",
        "Attaining 99+ Performance scores across mobile and desktop devices on Google PageSpeed Insights.",
      ],
      solutions: [
        "Created custom GLTF 3D model compression pipelines reducing asset weights by 74% with progressive LOD (Level of Detail) loading.",
        "Implemented Shopify Plus Storefront GraphQL caching with stale-while-revalidate edge workers on Cloudflare.",
        "Designed fluid, editorial typography and silky smooth 60fps micro-animations powered by GSAP and Lenis smooth scrolling.",
      ],
      keyFeatures: [
        {
          title: "Interactive 3D Customizer",
          description: "WebGL-powered 360-degree rotation, leather texture switching, and custom monogram previews in real time.",
          icon: "Layers",
        },
        {
          title: "Sub-450ms Global Edge Delivery",
          description: "Static and dynamic asset optimization via Cloudflare Workers for near-instantaneous page loads worldwide.",
          icon: "Zap",
        },
        {
          title: "Seamless One-Click Checkout",
          description: "Localized checkout flows supporting Apple Pay, Klarna, WeChat Pay, and multi-currency conversion.",
          icon: "ShoppingCart",
        },
        {
          title: "Omnichannel Stock Sync",
          description: "Real-time stock synchronization between physical Parisian flagships and digital distribution centers.",
          icon: "Layers",
        },
      ],
      results: [
        "99 Performance score on Google PageSpeed Insights mobile and desktop",
        "42% lift in mobile checkout conversion rate within 60 days of launch",
        "Global average page load under 450ms across North America, Europe, and Asia",
        "310% increase in average time spent on product detail pages with 3D models",
      ],
      impactMetrics: [
        { metric: "99/100", label: "PageSpeed Score", description: "Green Core Web Vitals on mobile" },
        { metric: "+42%", label: "Conversion Lift", description: "Mobile checkout completion increase" },
        { metric: "< 450ms", label: "Global Load Time", description: "Average edge response latency" },
        { metric: "3.1x", label: "Dwell Time", description: "Engagement boost with 3D configurator" },
      ],
      techStack: ["Next.js", "Three.js", "Shopify Plus", "GSAP", "Tailwind CSS", "Cloudflare Workers", "TypeScript"],
      technologies: [
        { name: "Next.js 15 (App Router)", category: "Frontend Framework", icon: "Globe" },
        { name: "Three.js & WebGL", category: "3D Product Engine", icon: "Layers" },
        { name: "Shopify Plus GraphQL", category: "Commerce Backend", icon: "ShoppingCart" },
        { name: "GSAP & Framer Motion", category: "Animation Engine", icon: "Zap" },
        { name: "Cloudflare Workers", category: "Edge Caching", icon: "Server" },
        { name: "Tailwind CSS", category: "Design System", icon: "Paintbrush" },
      ],
      startDate: "2024-03-01",
      launchDate: "2024-08-15",
      durationLabel: "5.5 Months",
      status: "completed",
      teamMembers: [
        {
          teamMemberSlug: "elena-rostova",
          teamMemberName: "Elena Rostova",
          teamMemberPhoto: "",
          roleOnProject: "VP Product Engineering & 3D Lead",
        },
      ],
      coverImage: "",
      heroImage: "",
      screenshots: [],
      galleryImages: [],
      liveUrl: "https://aura-paris.example.com",
      githubUrl: "",
      relatedServiceSlugs: ["web-development", "seo-optimization"],
      testimonial: {
        quote: "Our mobile conversion rate increased by 42% immediately after launching the new platform. They understood our luxury aesthetic and backed it up with incredible technical execution.",
        authorName: "Sophie Martin",
        authorRole: "Head of Digital Commerce",
        company: "Aura Paris",
      },
      metaTitle: "Aura Commerce — Luxury Headless Storefront Case Study | Kas Denge",
      metaDescription: "How Kas Denge built a 99 PageSpeed luxury headless storefront with 3D product customization and 42% conversion lift for Aura Paris.",
      keywords: ["luxury ecommerce case study", "headless shopify nextjs", "threejs product customizer", "high performance ecommerce"],
      isFeatured: true,
      isActive: true,
      order: 2,
    },
    {
      title: "Kore — Distributed Logistics & Fleet OS",
      slug: "kore-logistics-os",
      category: "ERP",
      clientName: "LogiFlow Global",
      industry: "Logistics & Supply Chain",
      oneLiner: "Autonomous fleet tracking, IoT sensor ingestion, and AI dispatch optimization system managing 10,000+ commercial vehicles.",
      shortDescription: "Enterprise-scale fleet operating system with live GPS tracking, IoT telemetry processing, automated dispatch routing, and preventative maintenance schedules.",
      fullDescription: "LogiFlow Global coordinates a multimodal logistics network of over 10,000 trucks and cargo vans across North America. Kas Denge built Kore — a mission-critical fleet management platform with real-time Kafka event streaming, Mapbox GL route visualizers, automated dispatch algorithms, and offline driver tablet applications.",
      overview: "Before partnering with Kas Denge, LogiFlow's dispatchers spent thousands of hours manually assigning routes on static spreadsheets, leading to deadhead miles, high fuel burn, and delayed customer ETAs. Kore replaced six disjointed vendor tools with a unified single-pane-of-glass operating system.",
      problem: "Fragmented GPS trackers, manual dispatch routing spreadsheets, and delayed delivery updates were causing route inefficiencies, communication breakdowns, and tens of thousands in fuel waste every week.",
      solution: "We built a centralized Logistics OS featuring real-time AI route optimization, automated driver dispatching, Mapbox GL telemetry layers, and IoT vehicle sensor ingestion that reduced fuel costs by 28%.",
      challenges: [
        "Ingesting continuous IoT telemetry (GPS, speed, engine temp, tire pressure) from 10,000+ moving trucks every 3 seconds.",
        "Solving NP-hard Vehicle Routing Problems (VRP) dynamically when drivers encounter unexpected traffic or road closures.",
        "Providing an offline-capable mobile companion app for drivers traveling through dead zones.",
      ],
      solutions: [
        "Architected an Apache Kafka streaming pipeline with Redis caching for instant real-time telemetry processing.",
        "Integrated AI route-optimization heuristics recalculating optimal waypoints in under 2 seconds.",
        "Engineered an offline-first PWA with IndexedDB local transaction caching and background sync.",
      ],
      keyFeatures: [
        {
          title: "Real-Time Fleet Telemetry",
          description: "Live GPS mapping with 1-meter precision, vehicle speed tracking, and automated geofence entry/exit alerts.",
          icon: "Navigation",
        },
        {
          title: "AI Dynamic Dispatch Routing",
          description: "Multi-stop route planning optimized for fuel efficiency, driver hours-of-service compliance, and delivery windows.",
          icon: "Cpu",
        },
        {
          title: "IoT Engine Health Diagnostics",
          description: "OBD-II vehicle sensor ingestion predicting engine failures before breakdowns occur on the highway.",
          icon: "Shield",
        },
        {
          title: "Driver Mobile Companion",
          description: "Offline-first driver app with turn-by-turn navigation, digital proof-of-delivery signatures, and barcode scanning.",
          icon: "Smartphone",
        },
      ],
      results: [
        "28% reduction in overall fleet fuel expenditures across the first 6 months",
        "Automated 92% of routine dispatch scheduling workflows without dispatcher intervention",
        "Real-time GPS tracking accuracy achieved within 1 meter tolerance",
        "Eliminated 1.4 million miles of deadhead driving in year one",
      ],
      impactMetrics: [
        { metric: "-28%", label: "Fuel Expenses", description: "Direct reduction in diesel fleet costs" },
        { metric: "10,000+", label: "Active Vehicles", description: "Connected trucks tracked in real-time" },
        { metric: "92%", label: "Automated Dispatch", description: "Automated route assignment" },
        { metric: "1.4M", label: "Deadhead Miles Saved", description: "Waste elimination in year one" },
      ],
      techStack: ["React", "Node.js", "PostgreSQL", "Redis", "Kafka", "Mapbox GL", "Docker", "TypeScript"],
      technologies: [
        { name: "React 19 & TypeScript", category: "Dispatcher Frontend", icon: "Globe" },
        { name: "Node.js Microservices", category: "Backend Services", icon: "Server" },
        { name: "Apache Kafka", category: "IoT Telemetry Stream", icon: "Zap" },
        { name: "PostgreSQL & PostGIS", category: "Geospatial DB", icon: "Database" },
        { name: "Redis", category: "In-Memory State", icon: "Layers" },
        { name: "Mapbox GL JS", category: "Mapping & Geo-routing", icon: "Navigation" },
        { name: "Docker & Kubernetes", category: "Infrastructure", icon: "Shield" },
      ],
      startDate: "2024-02-10",
      launchDate: "2024-10-01",
      durationLabel: "8 Months",
      status: "completed",
      teamMembers: [
        {
          teamMemberSlug: "marcus-vance",
          teamMemberName: "Marcus Vance",
          teamMemberPhoto: "",
          roleOnProject: "Principal Systems Engineer & Kafka Lead",
        },
        {
          teamMemberSlug: "alex-rivera",
          teamMemberName: "Alex Rivera",
          teamMemberPhoto: "",
          roleOnProject: "Lead Architect",
        },
      ],
      coverImage: "",
      heroImage: "",
      screenshots: [],
      galleryImages: [],
      liveUrl: "",
      githubUrl: "",
      relatedServiceSlugs: ["erp-systems", "custom-software"],
      testimonial: {
        quote: "The custom ERP and fleet dispatch system built by Kas Denge saved us tens of thousands in operational waste in the first quarter alone. Highly recommended.",
        authorName: "Vikram Mehta",
        authorRole: "VP of Operations",
        company: "LogiFlow Global",
      },
      metaTitle: "Kore — Distributed Logistics & Fleet OS Case Study | Kas Denge",
      metaDescription: "How Kas Denge built an autonomous fleet management and IoT dispatching system for 10,000+ commercial vehicles saving 28% in fuel expenses.",
      keywords: ["fleet management software case study", "custom logistics erp", "kafka iot tracking system", "enterprise supply chain platform"],
      isFeatured: true,
      isActive: true,
      order: 3,
    },
    {
      title: "Pulse Health — Cloud Patient Telehealth Suite",
      slug: "pulse-telehealth-suite",
      category: "App",
      clientName: "MedHealth Digital",
      industry: "Healthcare & Telemedicine",
      oneLiner: "HIPAA-compliant WebRTC telehealth consultation and remote patient monitoring platform serving 150,000+ active patients.",
      shortDescription: "A HIPAA-compliant telemedicine platform with end-to-end encrypted video consultations, digital prescription routing, and EHR integration.",
      fullDescription: "MedHealth Digital required an ultra-secure, zero-latency telemedicine application enabling physicians to conduct remote video consultations, review vital telemetry from connected wearable devices, and e-prescribe medications directly to local pharmacies.",
      overview: "In response to surging demand for virtual medical care, MedHealth partnered with Kas Denge to engineer a HIPAA and SOC2-certified telehealth ecosystem spanning iOS, Android, and web with automated EHR sync and patient intake triage.",
      problem: "Traditional telehealth software suffered from choppy video connections, disjointed patient charting, lack of biometric wearable device integrations, and complex HIPAA compliance hurdles.",
      solution: "We engineered a WebRTC-powered, end-to-end encrypted video consultation platform with integrated HL7/FHIR EHR synchronization and automated AI patient intake summaries.",
      challenges: [
        "Ensuring crystal-clear, adaptive bitrate video calls across low-bandwidth cellular connections in rural areas.",
        "Architecting strict HIPAA and HITECH compliance with AES-256 data encryption at rest and in transit.",
        "Integrating bidirectional EHR synchronization with legacy hospital databases via HL7 and FHIR protocols.",
      ],
      solutions: [
        "Implemented WebRTC mesh-to-SFU dynamic switching for low-latency peer-to-peer video streams.",
        "Enforced zero-knowledge encryption architecture with immutable audit access logging for patient records.",
        "Constructed custom FHIR R4 microservices ensuring seamless data portability with Epic and Cerner.",
      ],
      keyFeatures: [
        {
          title: "End-to-End Encrypted WebRTC Video",
          description: "Ultra-low latency HD video calls with in-call chat, screen sharing, and digital stethoscope audio streaming.",
          icon: "Video",
        },
        {
          title: "E-Prescriptions & Pharmacy Routing",
          description: "Direct integration with SureScripts allowing physicians to transmit signed digital prescriptions instantly.",
          icon: "FileText",
        },
        {
          title: "Remote Patient Monitoring (RPM)",
          description: "Real-time sync with Bluetooth blood pressure cuffs, glucometers, and pulse oximeters with anomaly alerts.",
          icon: "Activity",
        },
        {
          title: "AI Medical Intake Summary",
          description: "Conversational intake bot preparing structured SOAP clinical notes for the physician prior to the call.",
          icon: "Cpu",
        },
      ],
      results: [
        "Over 250,000 successful virtual consultations conducted with 99.4% call completion rate",
        "Average patient wait time reduced from 28 minutes to under 4.5 minutes",
        "100% HIPAA and SOC2 Type II audit compliance verification",
        "4.9/5 average patient satisfaction rating across App Store and Google Play",
      ],
      impactMetrics: [
        { metric: "250k+", label: "Consultations", description: "Virtual visits completed securely" },
        { metric: "< 4.5m", label: "Wait Time", description: "Average patient intake turnaround" },
        { metric: "99.4%", label: "Call Success", description: "Zero packet loss video sessions" },
        { metric: "4.9 / 5", label: "App Rating", description: "Patient satisfaction score" },
      ],
      techStack: ["React Native", "Next.js", "WebRTC", "Node.js", "PostgreSQL", "Redis", "TypeScript"],
      technologies: [
        { name: "React Native & Expo", category: "Cross-Platform Mobile", icon: "Smartphone" },
        { name: "Next.js 15", category: "Doctor Web Portal", icon: "Globe" },
        { name: "WebRTC SFU Media Server", category: "Video & Audio", icon: "Zap" },
        { name: "PostgreSQL with RLS", category: "HIPAA Encrypted DB", icon: "Database" },
        { name: "HL7 / FHIR Gateway", category: "Healthcare Interop", icon: "Layers" },
        { name: "AWS HealthLake", category: "Cloud Infrastructure", icon: "Shield" },
      ],
      startDate: "2024-04-01",
      launchDate: "2024-11-15",
      durationLabel: "7.5 Months",
      status: "completed",
      teamMembers: [
        {
          teamMemberSlug: "alex-rivera",
          teamMemberName: "Alex Rivera",
          teamMemberPhoto: "",
          roleOnProject: "Chief Architect & Security Officer",
        },
        {
          teamMemberSlug: "elena-rostova",
          teamMemberName: "Elena Rostova",
          teamMemberPhoto: "",
          roleOnProject: "Lead Mobile Engineer",
        },
      ],
      coverImage: "",
      heroImage: "",
      screenshots: [],
      galleryImages: [],
      liveUrl: "https://pulsehealth.example.com",
      githubUrl: "",
      relatedServiceSlugs: ["mobile-app-development", "custom-software"],
      testimonial: {
        quote: "Pulse Health transformed our medical network. Kas Denge navigated the complex HIPAA landscape effortlessly and built a platform our doctors and patients love.",
        authorName: "Dr. Rachel Thorne",
        authorRole: "Chief Medical Officer",
        company: "MedHealth Digital",
      },
      metaTitle: "Pulse Health — Cloud Patient Telehealth Suite Case Study | Kas Denge",
      metaDescription: "How Kas Denge engineered a HIPAA-compliant WebRTC telehealth application and remote patient monitoring suite for 250,000+ consultations.",
      keywords: ["telehealth app development", "hipaa compliant video app", "webrtc healthcare platform", "react native telemedicine"],
      isFeatured: true,
      isActive: true,
      order: 4,
    },
    {
      title: "Apex Commerce — Omnichannel POS & Inventory Engine",
      slug: "apex-pos-inventory",
      category: "ERP",
      clientName: "RetailMax Enterprise",
      industry: "Retail & Omnichannel Commerce",
      oneLiner: "Offline-first cloud point of sale and unified inventory engine processing $85M+ in annual sales across 65 store locations.",
      shortDescription: "High-throughput cloud POS platform with offline transaction queuing, sub-second barcode checkout, and real-time multi-store inventory synchronization.",
      fullDescription: "RetailMax required a next-generation point of sale and inventory management system capable of operating seamlessly during internet outages, synchronizing stock across 65 physical retail branches and online e-commerce channels in real time.",
      overview: "Operating high-traffic retail storefronts in busy metropolitan malls, RetailMax suffered catastrophic revenue loss during internet blackouts. Kas Denge engineered an offline-first architecture with localized SQLite caches and automatic conflict resolution.",
      problem: "Traditional cloud POS tablets crashed during internet outages, creating long checkout lines, lost sales, and severe inventory discrepancies between physical registers and online stores.",
      solution: "We engineered an offline-first POS engine with local IndexedDB/SQLite transaction storage, sub-second barcode recognition, and WebSocket multi-store synchronization.",
      challenges: [
        "Handling full register checkout functionality and encrypted payment store-and-forward processing without internet connectivity.",
        "Preventing inventory overselling between 65 physical retail branches and a high-traffic Shopify Plus online store.",
        "Maintaining sub-second touch interface response times on legacy touchscreen register terminals.",
      ],
      solutions: [
        "Built an offline-first local SQLite cache on the terminal that synchronizes with the cloud via WebSocket queues upon reconnection.",
        "Implemented atomic inventory deduction webhooks updating warehouse and store stocks in under 200ms.",
        "Created an ultra-optimized touch UI with zero render lag and instant thermal receipt printing support.",
      ],
      keyFeatures: [
        {
          title: "Offline-First Resilient Architecture",
          description: "Registers continue scanning barcodes, ringing sales, and printing receipts with 100% zero internet connection.",
          icon: "Shield",
        },
        {
          title: "Sub-Second Barcode Checkout",
          description: "Ultra-responsive touch terminal processing transactions in under 25 seconds with split payment support.",
          icon: "ShoppingCart",
        },
        {
          title: "Real-Time Multi-Store Inventory",
          description: "Live stock visibility across 65 stores with automated low-stock purchase order generation.",
          icon: "Package",
        },
        {
          title: "Omnichannel Loyalty & CRM",
          description: "Unified customer reward profiles syncing purchases across physical checkout counters and online stores.",
          icon: "Users",
        },
      ],
      results: [
        "$85M+ in retail transactions processed across 65 branch locations in the first year",
        "Zero lost sales recorded across all retail stores during peak holiday network outages",
        "Average register checkout time reduced from 65 seconds to under 24 seconds",
        "Saved 1,200+ hours in manual inventory reconciliation audits each month",
      ],
      impactMetrics: [
        { metric: "$85M+", label: "Annual Volume", description: "Processed across 65 stores" },
        { metric: "100%", label: "Uptime Reliability", description: "Zero offline checkout losses" },
        { metric: "< 24s", label: "Checkout Time", description: "Average transaction speed" },
        { metric: "65", label: "Store Locations", description: "Fully synchronized live branches" },
      ],
      techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "SQLite", "Redis", "WebSockets"],
      technologies: [
        { name: "React 19 & TypeScript", category: "POS Terminal UI", icon: "Globe" },
        { name: "Local SQLite / IndexedDB", category: "Offline Store", icon: "Database" },
        { name: "Node.js & WebSockets", category: "Real-Time Sync", icon: "Server" },
        { name: "PostgreSQL Cluster", category: "Central Cloud DB", icon: "Database" },
        { name: "Stripe Terminal EMV", category: "Payment Processing", icon: "CreditCard" },
        { name: "Redis", category: "Pub/Sub Queues", icon: "Zap" },
      ],
      startDate: "2024-02-01",
      launchDate: "2024-09-30",
      durationLabel: "8 Months",
      status: "completed",
      teamMembers: [
        {
          teamMemberSlug: "elena-rostova",
          teamMemberName: "Elena Rostova",
          teamMemberPhoto: "",
          roleOnProject: "Frontend Architecture & POS UI Lead",
        },
        {
          teamMemberSlug: "marcus-vance",
          teamMemberName: "Marcus Vance",
          teamMemberPhoto: "",
          roleOnProject: "Database Sync & Offline Cache Lead",
        },
      ],
      coverImage: "",
      heroImage: "",
      screenshots: [],
      galleryImages: [],
      liveUrl: "",
      githubUrl: "",
      relatedServiceSlugs: ["erp-systems", "web-development"],
      testimonial: {
        quote: "Apex POS solved our biggest headache: holiday internet drops. Our store cashiers never missed a beat, and our stock counts are 100% accurate for the first time in company history.",
        authorName: "Marcus Thorne",
        authorRole: "Chief Commercial Officer",
        company: "RetailMax Enterprise",
      },
      metaTitle: "Apex Commerce — Omnichannel POS & Inventory Engine Case Study | Kas Denge",
      metaDescription: "How Kas Denge built an offline-first cloud POS and real-time inventory engine processing $85M+ across 65 stores for RetailMax.",
      keywords: ["cloud pos system case study", "offline point of sale", "multi-store inventory sync", "retail software engineering"],
      isFeatured: true,
      isActive: true,
      order: 5,
    },
  ];

  for (const item of initialPortfolio) {
    await PortfolioItem.findOneAndUpdate({ slug: item.slug }, { $set: item }, { upsert: true, returnDocument: 'after' });
  }
  console.log(`   Processed ${initialPortfolio.length} portfolio items.`);

  // 5. Team Members
  console.log("👥 Seeding Team Members...");
  const initialTeam = [
    {
      name: "Alex Rivera",
      slug: "alex-rivera",
      role: "Founder & Chief Architect",
      specialization: "Distributed Systems & Cloud Architecture",
      photo: "",
      bio: "Alex has spent over 12 years designing and scaling high-throughput distributed systems. Prior to founding Kas Denge, he led core infrastructure engineering at major fintech and enterprise SaaS scale-ups.",
      techTags: ["System Architecture", "Next.js", "Go", "PostgreSQL", "Kubernetes"],
      socialLinks: {
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        twitter: "https://twitter.com",
      },
      yearsExperience: 12,
      joinedDate: "January 2020",
      certifications: ["AWS Certified Solutions Architect Professional", "CKA Kubernetes Admin"],
      currentlyWorkingOn: "Architecting high-frequency real-time event streaming pipelines.",
      order: 1,
      isActive: true,
    },
    {
      name: "Elena Rostova",
      slug: "elena-rostova",
      role: "VP of Product Engineering",
      specialization: "Frontend Architecture & Design Systems",
      photo: "",
      bio: "Elena specializes in building ultra-polished, accessible, and high-performance user interfaces. She blends engineering precision with aesthetic mastery to create software users love to use every day.",
      techTags: ["React", "Next.js", "TypeScript", "Three.js", "Framer Motion", "Tailwind CSS"],
      socialLinks: {
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
      yearsExperience: 9,
      joinedDate: "March 2021",
      certifications: ["Certified Scrum Product Owner (CSPO)"],
      currentlyWorkingOn: "Engineering next-gen 3D visual component library.",
      order: 2,
      isActive: true,
    },
    {
      name: "Marcus Vance",
      slug: "marcus-vance",
      role: "Principal Systems Engineer",
      specialization: "Backend Pipelines & Database Optimization",
      photo: "",
      bio: "Marcus is a database whisperer and backend specialist who thrives on solving query performance bottlenecks, architecting multi-tenant schemas, and ensuring mission-critical data integrity.",
      techTags: ["Node.js", "PostgreSQL", "MongoDB", "Redis", "Kafka", "Docker"],
      socialLinks: {
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
      yearsExperience: 10,
      joinedDate: "July 2021",
      certifications: ["MongoDB Certified DBA", "PostgreSQL Core Specialist"],
      currentlyWorkingOn: "High-throughput database connection pooling and sharding.",
      order: 3,
      isActive: true,
    },
  ];

  for (const member of initialTeam) {
    await TeamMember.findOneAndUpdate({ slug: member.slug }, { $set: member }, { upsert: true, returnDocument: 'after' });
  }
  console.log(`   Processed ${initialTeam.length} team members.`);

  // 6. Clients & Logos
  console.log("🏢 Seeding Clients & Logos...");
  const initialClients = [
    { name: "TechCorp", industry: "Enterprise SaaS", isFeatured: true, order: 1, isActive: true },
    { name: "MedHealth", industry: "Healthcare Technology", isFeatured: true, order: 2, isActive: true },
    { name: "EduSpark", industry: "EdTech & Learning", isFeatured: true, order: 3, isActive: true },
    { name: "RetailMax", industry: "Omnichannel Commerce", isFeatured: true, order: 4, isActive: true },
    { name: "FinEdge", industry: "Fintech & Wealth", isFeatured: true, order: 5, isActive: true },
    { name: "LogiFlow", industry: "Logistics & Supply Chain", isFeatured: true, order: 6, isActive: true },
    { name: "CloudNine", industry: "Cloud Infrastructure", isFeatured: true, order: 7, isActive: true },
    { name: "DataVerse", industry: "Data Intelligence", isFeatured: true, order: 8, isActive: true },
  ];

  for (const client of initialClients) {
    await Client.findOneAndUpdate({ name: client.name }, { $set: client }, { upsert: true, returnDocument: 'after' });
  }
  console.log(`   Processed ${initialClients.length} clients.`);

  // 7. Testimonials
  console.log("⭐ Seeding Testimonials...");
  const initialTestimonials = [
    {
      clientName: "David Sterling",
      company: "FinEdge Capital",
      role: "Chief Technology Officer",
      photo: "",
      review: "Kas Denge took our slow, outdated analytics portal and transformed it into a lightning-fast powerhouse. Their engineering discipline and communication throughout the project were world-class.",
      rating: 5,
      isFeatured: true,
      isActive: true,
      order: 1,
    },
    {
      clientName: "Sophie Martin",
      company: "Aura Paris",
      role: "Head of Digital Commerce",
      photo: "",
      review: "Our mobile conversion rate increased by 42% immediately after launching the new platform. They understood our luxury aesthetic and backed it up with incredible technical execution.",
      rating: 5,
      isFeatured: true,
      isActive: true,
      order: 2,
    },
    {
      clientName: "Vikram Mehta",
      company: "LogiFlow Global",
      role: "VP of Operations",
      photo: "",
      review: "The custom ERP and fleet dispatch system built by Kas Denge saved us tens of thousands in operational waste in the first quarter alone. Highly recommended.",
      rating: 5,
      isFeatured: true,
      isActive: true,
      order: 3,
    },
  ];

  for (const t of initialTestimonials) {
    await Testimonial.findOneAndUpdate({ clientName: t.clientName, company: t.company }, { $set: t }, { upsert: true, returnDocument: 'after' });
  }
  console.log(`   Processed ${initialTestimonials.length} testimonials.`);

  // 8. Pricing Tiers
  console.log("💳 Seeding Pricing Tiers...");
  const initialPricing = [
    {
      name: "MVP Sprint",
      price: "$15,000",
      period: "project",
      description: "Ideal for early-stage startups needing a battle-tested MVP shipped to market in 4-6 weeks.",
      features: [
        { text: "Complete architecture & system design", included: true },
        { text: "Full-stack web application or mobile MVP", included: true },
        { text: "Authentication, database, and payment integration", included: true },
        { text: "CI/CD automated deployment & cloud setup", included: true },
        { text: "30 days post-launch SLA bug warranty", included: true },
        { text: "Dedicated full-time engineering pod", included: false },
      ],
      isPopular: false,
      ctaText: "Start MVP Sprint",
      ctaHref: "/contact",
      order: 1,
      isActive: true,
    },
    {
      name: "Scale & Growth",
      price: "$28,000",
      period: "project",
      description: "For established businesses looking to rebuild, scale architectures, or launch flagship products.",
      features: [
        { text: "End-to-end custom application engineering", included: true },
        { text: "Microservices & distributed database design", included: true },
        { text: "Enterprise role-based permissions & audit logs", included: true },
        { text: "Automated test suites (unit, integration, e2e)", included: true },
        { text: "90 days post-launch priority support & monitoring", included: true },
        { text: "24/7 dedicated incident response", included: true },
      ],
      isPopular: true,
      ctaText: "Engineer For Scale",
      ctaHref: "/contact",
      order: 2,
      isActive: true,
    },
    {
      name: "Enterprise Dedicated",
      price: "Custom",
      period: "retainer",
      description: "A dedicated squad of senior architects, frontend specialists, and DevOps engineers acting as your team.",
      features: [
        { text: "Dedicated senior engineering team (3-6 members)", included: true },
        { text: "Bespoke ERP, SaaS, and AI platform development", included: true },
        { text: "SOC2 compliance readiness and security audits", included: true },
        { text: "Bi-weekly sprint planning & direct Slack access", included: true },
        { text: "Full IP ownership and zero vendor lock-in", included: true },
        { text: "24/7/365 guaranteed 15-minute response SLA", included: true },
      ],
      isPopular: false,
      ctaText: "Contact Enterprise Sales",
      ctaHref: "/contact",
      order: 3,
      isActive: true,
    },
  ];

  for (const p of initialPricing) {
    await PricingTier.findOneAndUpdate({ name: p.name }, { $set: p }, { upsert: true, returnDocument: 'after' });
  }
  console.log(`   Processed ${initialPricing.length} pricing tiers.`);

  // 9. FAQs
  console.log("❓ Seeding FAQs...");
  const initialFAQs = [
    {
      question: "How fast can you start on our project?",
      answer: "We typically onboard new projects within 1 to 2 weeks following our initial discovery call and scope alignment. For urgent MVP sprints, we can fast-track onboarding within 72 hours.",
      category: "General",
      order: 1,
      isActive: true,
    },
    {
      question: "Do we own the source code and intellectual property?",
      answer: "Yes, absolutely 100%. Upon completion and invoice settlement, all source code, design assets, database schemas, and intellectual property are fully transferred to your company with zero licensing fees or vendor lock-in.",
      category: "Legal & IP",
      order: 2,
      isActive: true,
    },
    {
      question: "What tech stack do you recommend for high scale?",
      answer: "We primarily build on Next.js / React with TypeScript on the frontend, combined with Node.js, Go, or Python on the backend. For data persistence, we utilize PostgreSQL, MongoDB, Redis, and edge caching layers like Cloudflare.",
      category: "Engineering",
      order: 3,
      isActive: true,
    },
    {
      question: "How do you handle post-launch maintenance and support?",
      answer: "Every project includes a minimum of 30 to 90 days of complimentary warranty support. We also provide ongoing retainer plans for continuous feature development, 24/7 uptime monitoring, and security patching.",
      category: "Support",
      order: 4,
      isActive: true,
    },
  ];

  for (const faq of initialFAQs) {
    await FAQItem.findOneAndUpdate({ question: faq.question }, { $set: faq }, { upsert: true, returnDocument: 'after' });
  }
  console.log(`   Processed ${initialFAQs.length} FAQs.`);

  // 10. Global Settings (Hero, About, Stats, WhyChooseUs, Process, Technologies, Socials)
  console.log("⚙️ Seeding Global Website Settings...");
  const initialSettings = {
    siteName: "Kas Denge Technologies",
    tagline: "We Build Digital Products That Scale",
    description: "A product-engineering agency that ships web apps, mobile apps, ERP/SaaS systems, and AI automation for startups and growing businesses.",
    contactEmail: "hello@kasdenge.com",
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
      subtitle: "Kas Denge was founded with a single mission: to build scalable, maintainable software that solves real business problems. No shortcuts, no black boxes.",
      mission: "To empower businesses by building mission-critical software solutions with uncompromising engineering rigor.",
      vision: "To be the premier engineering partner for visionary founders and forward-thinking enterprises worldwide.",
      story: "Founded by engineers who spent years architecting high-traffic distributed systems, Kas Denge was built on the belief that code quality and business velocity do not have to be trade-offs.",
    },
    stats: [
      { label: "Projects Shipped", value: 150, suffix: "+" },
      { label: "Happy Clients", value: 85, suffix: "+" },
      { label: "Satisfaction Rate", value: 98, suffix: "%" },
      { label: "Years Experience", value: 6, suffix: "+" },
    ],
    whyChooseUs: [
      { title: "Zero Technical Debt Architecture", description: "Clean, modular code built on strict TypeScript types and maintainable design systems.", icon: "Code2" },
      { title: "Sub-Second Performance", description: "Edge-cached delivery, lazy-loaded components, and optimized database queries.", icon: "Zap" },
      { title: "Enterprise-Grade Security", description: "Role-based access control, encrypted data pipelines, and audit-ready architectures.", icon: "Shield" },
      { title: "Transparent Collaboration", description: "Direct communication with engineers via dedicated Slack channels and bi-weekly sprint demos.", icon: "Headphones" },
      { title: "Full IP Ownership", description: "You own 100% of the source code, repositories, and documentation from day one.", icon: "Receipt" },
      { title: "Scalable Infrastructure", description: "Containerized deployments ready to scale from initial users to millions of transactions.", icon: "Layers" },
      { title: "Automated Testing & CI/CD", description: "Robust unit, integration, and e2e test pipelines ensuring zero regression bugs.", icon: "Cpu" },
      { title: "Technical SEO Built-In", description: "Semantic markup, green Core Web Vitals, and automated schema metadata out of the box.", icon: "Search" },
    ],
    processSteps: [
      { number: 1, title: "Discovery & Architecture", description: "We deep-dive into your business goals, map data models, and define the architectural blueprint before writing code.", icon: "Search" },
      { number: 2, title: "Rapid Prototyping", description: "Interactive wireframes and design system tokens aligned with your brand aesthetic.", icon: "Palette" },
      { number: 3, title: "Iterative Engineering", description: "Two-week agile sprints with bi-weekly live staging demos and continuous CI/CD integration.", icon: "Code2" },
      { number: 4, title: "Rigorous Testing", description: "Automated regression suites, load testing under peak simulation, and security audits.", icon: "TestTube2" },
      { number: 5, title: "Production Deployment", description: "Zero-downtime deployment, DNS migration, edge CDN caching, and 24/7 uptime monitoring.", icon: "Rocket" },
      { number: 6, title: "Handover & Scale", description: "Complete documentation, team knowledge transfer, and SLA warranty support.", icon: "Wrench" },
    ],
    technologies: [
      { name: "React", icon: "", category: "frontend" },
      { name: "Next.js", icon: "", category: "frontend" },
      { name: "TypeScript", icon: "", category: "language" },
      { name: "Tailwind CSS", icon: "", category: "frontend" },
      { name: "Three.js", icon: "", category: "frontend" },
      { name: "Node.js", icon: "", category: "backend" },
      { name: "Go", icon: "", category: "backend" },
      { name: "Python", icon: "", category: "backend" },
      { name: "PostgreSQL", icon: "", category: "database" },
      { name: "MongoDB", icon: "", category: "database" },
      { name: "Redis", icon: "", category: "database" },
      { name: "Docker", icon: "", category: "devops" },
      { name: "Kubernetes", icon: "", category: "devops" },
      { name: "AWS", icon: "", category: "devops" },
      { name: "Cloudflare", icon: "", category: "devops" },
      { name: "React Native", icon: "", category: "mobile" },
      { name: "Flutter", icon: "", category: "mobile" },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
    },
    footer: {
      copyrightText: "© 2025 Kas Denge Technologies. All rights reserved.",
      disclaimer: "Engineered with precision for global teams.",
    },
  };

  const existingSettings = await Setting.findOne();
  if (!existingSettings) {
    await Setting.create(initialSettings);
    console.log("   Created global settings document.");
  } else {
    await Setting.findByIdAndUpdate(existingSettings._id, { $set: initialSettings });
    console.log("   Updated global settings with section data (WhyUs, Process, TechStack, Stats).");
  }

  // 11. Blog Posts
  console.log("📝 Seeding Blog Posts...");
  const initialBlogs = [
    {
      title: "Architecting Scalable Next.js Applications for High Traffic",
      slug: "architecting-scalable-nextjs-apps",
      excerpt: "A deep dive into server components, edge caching, database connection pooling, and performance optimization in production.",
      content: "Building high-performance web apps requires more than just modern UI frameworks. In this article, we break down our proven patterns for caching, server-side streaming, distributed databases, and global CDN delivery.",
      category: "Engineering",
      tags: ["Next.js", "Architecture", "Performance", "React"],
      author: {
        name: "Alex Rivera",
        role: "Lead Systems Architect",
        avatar: "",
      },
      status: "published",
      readTime: "6 min read",
    },
    {
      title: "Why Modern Startups Are Choosing Bespoke ERP Systems",
      slug: "why-startups-choose-bespoke-erp",
      excerpt: "How tailored software infrastructure eliminates SaaS sprawl and gives fast-growing companies a competitive advantage.",
      content: "Off-the-shelf software often creates operational bottlenecks. Discover how custom ERPs provide scalable single-source-of-truth architectures tailored specifically to your unique business model.",
      category: "Product",
      tags: ["ERP", "SaaS", "Enterprise", "Strategy"],
      author: {
        name: "Elena Rostova",
        role: "VP of Product Engineering",
        avatar: "",
      },
      status: "published",
      readTime: "4 min read",
    },
  ];

  for (const b of initialBlogs) {
    await BlogPost.findOneAndUpdate({ slug: b.slug }, { $set: b }, { upsert: true, returnDocument: 'after' });
  }
  console.log(`   Processed ${initialBlogs.length} blog posts.`);

  // 12. Message
  console.log("📬 Seeding Sample Message...");
  const existingMsg = await Message.findOne({ email: "david.sterling@fintechventures.io" });
  if (!existingMsg) {
    await Message.create({
      name: "David Sterling",
      email: "david.sterling@fintechventures.io",
      phone: "+1 (555) 987-6543",
      projectType: "web",
      budgetRange: "$50k+",
      message: "We are looking for a dedicated team to architect and build our next-generation investment analytics platform. Need to get started next month.",
      status: "new",
    });
    console.log("   Sample message created.");
  }

  console.log("🎉 Database seeding completed successfully!");
}

// Run directly if invoked from CLI
if (require.main === module) {
  runSeed()
    .then(() => {
      console.log("✨ Seed script finished.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seed script failed:", err);
      process.exit(1);
    });
}
