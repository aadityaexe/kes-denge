/**
 * scripts/seed-jobs.ts — Idempotent job board seed script
 *
 * Seeds the Java Full Stack Developer Intern role (MARK 2 TECHNICAL SOLUTION)
 * along with a complete set of roles across departments, work modes,
 * employment types, and experience levels.
 *
 * Usage:
 *   npx tsx scripts/seed-jobs.ts
 */
import { existsSync } from "fs";
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
if (existsSync(".env")) process.loadEnvFile(".env");

import { connectToDatabase } from "../lib/mongodb";
import Job from "../models/Job";

interface SeedJobInput {
  title: string;
  slug: string;
  department: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship";
  experienceLevel: "Entry Level" | "Mid Level" | "Senior" | "Lead / Principal";
  salaryRange: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  skills: string[];
  benefits: string[];
  status: "open" | "closed" | "draft";
  isFeatured: boolean;
  order: number;
  metaTitle: string;
  metaDescription: string;
}

const SEED_JOBS: SeedJobInput[] = [
  {
    title: "Java Full Stack Developer Intern",
    slug: "java-full-stack-developer-intern",
    department: "Engineering",
    location: "Remote / Work From Home",
    workMode: "Remote",
    employmentType: "Internship",
    experienceLevel: "Entry Level",
    salaryRange: "Unpaid (6 Months)",
    summary:
      "6-month remote internship at MARK 2 TECHNICAL SOLUTION for students and freshers passionate about Core Java, Spring Boot, REST APIs, MySQL, and React.js.",
    description: [
      "Company: MARK 2 TECHNICAL SOLUTION",
      "",
      "We are inviting passionate and enthusiastic students and freshers to join our team as Java Full Stack Development Interns. If you are interested in backend development and frontend technologies, this is a great opportunity to gain practical industry experience and enhance your technical skills.",
      "",
      "Internship Details:",
      "• Duration: 6 Months",
      "• Internship Type: Unpaid Internship",
      "• Mode: Remote / Work From Home",
      "",
      "Note: This is a 6-month UNPAID internship. No stipend or salary will be provided during the internship period.",
    ].join("\n"),
    responsibilities: [
      "Build and maintain backend modules and RESTful APIs using Core Java, Spring Boot, and Spring MVC.",
      "Design database schemas and integrate persistence layers using Spring Data JPA, Hibernate, and MySQL.",
      "Develop responsive frontend interfaces with React.js, JavaScript, HTML, and CSS.",
      "Collaborate with mentors on live/practical projects using Git and GitHub workflows.",
      "Write clean, object-oriented code and participate in regular code reviews.",
    ],
    requirements: [
      "BCA / MCA / B.Tech / B.Sc IT students or recent freshers interested in Java Full Stack Development.",
      "Basic knowledge of Core Java, Object-Oriented Programming (OOPs), and React.js.",
      "Familiarity with Spring Boot, Spring MVC, RESTful APIs, Spring Data JPA & Hibernate.",
      "Foundational understanding of MySQL, JavaScript, HTML, CSS, and Git & GitHub.",
      "Passionate learner willing to improve skills and work on real-world development tasks.",
    ],
    niceToHave: [
      "Personal or academic full-stack projects hosted on GitHub.",
      "Basic familiarity with Postman or API testing tools.",
    ],
    skills: [
      "Core Java",
      "OOPs",
      "Spring Boot",
      "Spring MVC",
      "RESTful APIs",
      "Spring Data JPA",
      "Hibernate",
      "MySQL",
      "React.js",
      "JavaScript",
      "HTML",
      "CSS",
      "Git & GitHub",
    ],
    benefits: [
      "Hands-on Real-World Development Tasks",
      "Live / Practical Project Experience",
      "Mentorship & Technical Guidance",
      "Internship Completion Certificate",
      "100% Remote / Work From Home",
    ],
    status: "open",
    isFeatured: true,
    order: 1,
    metaTitle: "Java Full Stack Developer Intern (Remote) | MARK 2 TECHNICAL SOLUTION",
    metaDescription:
      "Apply for the 6-month remote Java Full Stack Developer Internship at MARK 2 TECHNICAL SOLUTION. Gain hands-on experience with Spring Boot, Hibernate, MySQL, and React.js.",
  },
  {
    title: "Senior Full-Stack Engineer (Next.js & TypeScript)",
    slug: "senior-full-stack-engineer-nextjs-typescript",
    department: "Engineering",
    location: "Remote / Work From Home",
    workMode: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    salaryRange: "₹18L – ₹28L / yr",
    summary:
      "Lead architecture and end-to-end delivery of high-throughput Next.js, TypeScript, and MongoDB web platforms for fast-growing clients.",
    description:
      "As a Senior Full-Stack Engineer at MARK 2, you will own complex client and internal SaaS architectures from system design to production deployment. You will work directly with founders and product leads to ship resilient, low-latency web applications.",
    responsibilities: [
      "Architect and build scalable Next.js App Router applications with TypeScript and Tailwind CSS.",
      "Design high-performance APIs, MongoDB data models, and caching strategies.",
      "Review pull requests, mentor mid-level engineers, and enforce engineering rigor.",
      "Optimize Core Web Vitals, bundle sizes, and server-side rendering performance.",
    ],
    requirements: [
      "4+ years of production experience with React, Next.js, TypeScript, and Node.js.",
      "Strong command of MongoDB or PostgreSQL schema design and query optimization.",
      "Experience with authentication, RBAC, security hardening, and CI/CD pipelines.",
    ],
    niceToHave: [
      "Experience with Redis, Cloudinary, or serverless edge deployments.",
      "Track record of leading greenfield SaaS or ERP builds.",
    ],
    skills: ["Next.js", "TypeScript", "React", "Node.js", "MongoDB", "Tailwind CSS", "REST APIs"],
    benefits: [
      "100% Remote Flexibility",
      "Health Insurance Coverage",
      "Annual Learning & Tech Stipend",
      "Performance-Linked Bonuses",
    ],
    status: "open",
    isFeatured: true,
    order: 2,
    metaTitle: "Senior Full-Stack Engineer (Next.js & TypeScript) | MARK 2",
    metaDescription:
      "Join MARK 2 as a Senior Full-Stack Engineer building scalable Next.js, TypeScript, and MongoDB platforms.",
  },
  {
    title: "Backend & Cloud Architect (Node.js / MongoDB)",
    slug: "backend-cloud-architect-nodejs-mongodb",
    department: "Engineering",
    location: "Remote / Work From Home",
    workMode: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Lead / Principal",
    salaryRange: "₹24L – ₹36L / yr",
    summary:
      "Design distributed backend services, multi-tenant ERP engines, and cloud-native infrastructure with 99.99% reliability.",
    description:
      "We are looking for a Backend & Cloud Architect to spearhead our enterprise ERP and SaaS backend platforms. You will define service boundaries, security standards, observability, and cloud scaling strategies.",
    responsibilities: [
      "Design multi-tenant backend architectures, event-driven queues, and resilient APIs.",
      "Establish database indexing, replication, and backup strategies across MongoDB and Redis.",
      "Lead security audits, rate limiting, and zero-downtime deployment pipelines.",
    ],
    requirements: [
      "5+ years building distributed backend systems in Node.js, TypeScript, or Java/Go.",
      "Deep expertise in MongoDB, Redis, Docker, and AWS/GCP cloud infrastructure.",
      "Strong understanding of API security, OAuth/JWT, and observability.",
    ],
    niceToHave: [
      "Experience architecting enterprise ERP or fintech ledger systems.",
    ],
    skills: ["Node.js", "TypeScript", "MongoDB", "Redis", "Docker", "AWS", "System Design"],
    benefits: [
      "100% Remote / Work From Home",
      "Comprehensive Medical Insurance",
      "Conference & Certification Budget",
    ],
    status: "open",
    isFeatured: false,
    order: 3,
    metaTitle: "Backend & Cloud Architect | MARK 2 Careers",
    metaDescription:
      "Lead distributed backend and cloud architecture for enterprise SaaS and ERP platforms at MARK 2.",
  },
  {
    title: "React Native Mobile App Developer",
    slug: "react-native-mobile-app-developer",
    department: "Engineering",
    location: "Remote / Work From Home",
    workMode: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    salaryRange: "₹10L – ₹16L / yr",
    summary:
      "Build smooth, offline-capable iOS and Android applications using React Native, TypeScript, and modern native modules.",
    description:
      "Join our mobile engineering team to ship consumer and enterprise mobile apps with 60fps animations, offline sync, and rock-solid push notification pipelines.",
    responsibilities: [
      "Develop cross-platform iOS and Android apps using React Native and Expo/bare workflows.",
      "Integrate REST/GraphQL APIs, biometric authentication, and real-time sockets.",
      "Profile and resolve memory leaks, startup latency, and UI jank.",
    ],
    requirements: [
      "2+ years of production React Native and TypeScript experience.",
      "Published at least 2 apps on the Apple App Store or Google Play Store.",
      "Familiarity with native iOS (Swift) or Android (Kotlin) bridging.",
    ],
    niceToHave: ["Experience with Reanimated, React Query, and OTA updates."],
    skills: ["React Native", "TypeScript", "iOS", "Android", "REST APIs", "Redux / Zustand"],
    benefits: ["Remote-First Culture", "Paid Time Off", "Hardware & Setup Support"],
    status: "open",
    isFeatured: false,
    order: 4,
    metaTitle: "React Native Mobile App Developer | MARK 2",
    metaDescription:
      "Build high-performance iOS and Android mobile apps with React Native and TypeScript at MARK 2.",
  },
  {
    title: "Frontend Development Intern (React / Next.js)",
    slug: "frontend-development-intern-react-nextjs",
    department: "Engineering",
    location: "Remote / Work From Home",
    workMode: "Remote",
    employmentType: "Internship",
    experienceLevel: "Entry Level",
    salaryRange: "₹10,000 – ₹15,000 / mo",
    summary:
      "Work alongside senior UI engineers to craft accessible, responsive React & Next.js interfaces and design-system components.",
    description:
      "A 3–6 month structured internship for aspiring frontend engineers who care deeply about typography, responsive layouts, accessibility, and clean component architecture.",
    responsibilities: [
      "Implement reusable UI components in React, TypeScript, and Tailwind CSS.",
      "Collaborate with designers to polish micro-interactions and mobile responsiveness.",
      "Write unit tests and fix cross-browser layout bugs.",
    ],
    requirements: [
      "Strong fundamentals in HTML5, CSS3, JavaScript (ES6+), and React.",
      "Familiarity with Git workflows and responsive design.",
    ],
    niceToHave: ["Experience with Next.js App Router or Framer Motion."],
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML", "CSS", "Git"],
    benefits: ["1:1 Senior Mentorship", "Flexible Hours", "Pre-Placement Offer (PPO) Opportunity"],
    status: "open",
    isFeatured: false,
    order: 5,
    metaTitle: "Frontend Development Intern (React / Next.js) | MARK 2",
    metaDescription:
      "Apply for our remote Frontend Development Internship working with React, Next.js, and Tailwind CSS.",
  },
  {
    title: "AI & LLM Automation Engineer",
    slug: "ai-llm-automation-engineer",
    department: "AI & Data",
    location: "Remote / Work From Home",
    workMode: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    salaryRange: "₹14L – ₹22L / yr",
    summary:
      "Build production RAG pipelines, autonomous agent workflows, and AI-powered business automations integrated into enterprise SaaS.",
    description:
      "We are looking for an AI & LLM Automation Engineer to design, evaluate, and deploy reliable LLM workflows, semantic search systems, and tool-calling agents for our enterprise clients.",
    responsibilities: [
      "Architect RAG pipelines, vector indexing, and structured LLM extraction workflows.",
      "Build evaluation harnesses to measure accuracy, latency, and hallucination rates.",
      "Integrate AI services cleanly into Next.js and Python/Node.js backends.",
    ],
    requirements: [
      "2+ years building production Python/TypeScript backend systems and AI integrations.",
      "Hands-on experience with OpenAI/Gemini APIs, embeddings, and vector databases.",
      "Strong grasp of prompt engineering, evals, and cost/latency optimization.",
    ],
    niceToHave: ["Experience with LangGraph, pgvector, or fine-tuning open-weight models."],
    skills: ["Python", "TypeScript", "LLMs", "RAG", "Vector DBs", "Next.js", "FastAPI"],
    benefits: ["API & Compute Credits", "Remote-First", "Annual Upskilling Budget"],
    status: "open",
    isFeatured: true,
    order: 6,
    metaTitle: "AI & LLM Automation Engineer | MARK 2",
    metaDescription:
      "Design and ship production RAG pipelines and AI automation systems at MARK 2.",
  },
  {
    title: "Product & UI/UX Designer",
    slug: "product-ui-ux-designer",
    department: "Design",
    location: "Remote / Work From Home",
    workMode: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    salaryRange: "₹9L – ₹15L / yr",
    summary:
      "Craft cohesive design systems, high-converting marketing experiences, and intuitive enterprise SaaS dashboards in Figma.",
    description:
      "As a Product & UI/UX Designer at MARK 2, you will translate complex enterprise workflows into clean, typography-driven interfaces and maintain our shared Figma design systems.",
    responsibilities: [
      "Design end-to-end user flows, wireframes, and high-fidelity UI in Figma.",
      "Build and evolve tokenized design systems in close partnership with frontend engineers.",
      "Conduct usability reviews and iterate based on real user feedback.",
    ],
    requirements: [
      "2+ years designing B2B SaaS, web apps, or mobile products.",
      "Strong portfolio demonstrating systems thinking, typography, and visual craft.",
      "Proficiency in Figma, auto-layout, and design tokens.",
    ],
    niceToHave: ["Basic understanding of CSS, Tailwind, or interactive prototyping."],
    skills: ["Figma", "Design Systems", "UI/UX", "Prototyping", "User Research", "Accessibility"],
    benefits: ["Creative Autonomy", "100% Remote Flexibility", "Health & Wellness Coverage"],
    status: "open",
    isFeatured: false,
    order: 7,
    metaTitle: "Product & UI/UX Designer | MARK 2",
    metaDescription:
      "Join MARK 2 as a Product & UI/UX Designer crafting design systems and enterprise SaaS interfaces.",
  },
  {
    title: "Technical Product Manager",
    slug: "technical-product-manager",
    department: "Product",
    location: "Remote / Work From Home",
    workMode: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    salaryRange: "₹18L – ₹26L / yr",
    summary:
      "Bridge client vision and engineering execution across web, mobile, and ERP product roadmaps.",
    description:
      "You will partner directly with enterprise stakeholders and senior engineers to scope requirements, write crisp PRDs, prioritize sprints, and ensure on-time, high-quality product launches.",
    responsibilities: [
      "Lead discovery workshops with founders and enterprise clients to define product scope.",
      "Translate business goals into clear user stories, acceptance criteria, and milestone plans.",
      "Track delivery velocity, unblock engineering teams, and own release readiness.",
    ],
    requirements: [
      "3+ years as a Product Manager in a software agency or B2B SaaS company.",
      "Strong technical fluency in APIs, databases, and modern web/mobile architectures.",
      "Exceptional written and verbal communication skills.",
    ],
    niceToHave: ["Background in software engineering or ERP implementations."],
    skills: ["Product Strategy", "PRDs", "Agile / Scrum", "Stakeholder Management", "Analytics"],
    benefits: ["Remote Flexibility", "Leadership Track", "Health Insurance"],
    status: "open",
    isFeatured: false,
    order: 8,
    metaTitle: "Technical Product Manager | MARK 2",
    metaDescription:
      "Lead product discovery, roadmaps, and engineering delivery as a Technical Product Manager at MARK 2.",
  },
  {
    title: "DevOps & Site Reliability Engineer",
    slug: "devops-site-reliability-engineer-contract",
    department: "Engineering",
    location: "Remote / Work From Home",
    workMode: "Remote",
    employmentType: "Contract",
    experienceLevel: "Senior",
    salaryRange: "₹1,500 – ₹2,500 / hr",
    summary:
      "Automate CI/CD pipelines, harden cloud infrastructure, and implement observability for mission-critical client workloads.",
    description:
      "We are engaging a Senior DevOps / SRE on a flexible contract basis to harden multi-region deployments, container orchestration, and automated monitoring.",
    responsibilities: [
      "Build reproducible Infrastructure-as-Code templates using Terraform.",
      "Optimize GitHub Actions CI/CD, Docker builds, and zero-downtime rollouts.",
      "Configure centralized logging, alerting, and SLA dashboards.",
    ],
    requirements: [
      "4+ years in DevOps/SRE with AWS or GCP, Docker, and Kubernetes/ECS.",
      "Strong Linux, networking, TLS, and cloud security fundamentals.",
    ],
    niceToHave: ["Experience with Cloudflare Workers/CDN and MongoDB Atlas automation."],
    skills: ["AWS", "Docker", "Terraform", "GitHub Actions", "Kubernetes", "Linux", "Observability"],
    benefits: ["Flexible Contract Hours", "Long-Term Retainer Potential", "100% Remote"],
    status: "open",
    isFeatured: false,
    order: 9,
    metaTitle: "DevOps & Site Reliability Engineer (Contract) | MARK 2",
    metaDescription:
      "Contract opportunity for a Senior DevOps & SRE to build CI/CD and cloud infrastructure at MARK 2.",
  },
  {
    title: "Technical Content & Developer Marketing Specialist",
    slug: "technical-content-developer-marketing-specialist",
    department: "Marketing",
    location: "Remote / Work From Home",
    workMode: "Remote",
    employmentType: "Part-time",
    experienceLevel: "Mid Level",
    salaryRange: "₹35,000 – ₹55,000 / mo",
    summary:
      "Write deep-dive engineering case studies, SEO-optimized technical blogs, and product launch narratives.",
    description:
      "Work closely with our engineering leads to turn real architecture decisions, ERP builds, and performance benchmarks into compelling technical articles and case studies.",
    responsibilities: [
      "Author 4–6 long-form technical blog posts and case studies per month.",
      "Collaborate with engineers to verify technical accuracy and code snippets.",
      "Manage SEO keyword strategy and LinkedIn/X distribution.",
    ],
    requirements: [
      "2+ years writing technical content for software agencies, SaaS, or dev tools.",
      "Ability to read code and understand web, mobile, and cloud architectures.",
    ],
    niceToHave: ["Experience with Next.js SEO and B2B demand generation."],
    skills: ["Technical Writing", "SEO", "Content Strategy", "B2B SaaS", "Developer Marketing"],
    benefits: ["Part-Time Flexibility", "Async Workflow", "Remote"],
    status: "open",
    isFeatured: false,
    order: 10,
    metaTitle: "Technical Content & Developer Marketing Specialist | MARK 2",
    metaDescription:
      "Part-time remote role crafting engineering blogs, case studies, and SEO content for MARK 2.",
  },
  {
    title: "Enterprise Solutions & Business Development Lead",
    slug: "enterprise-solutions-business-development-lead",
    department: "Sales",
    location: "Remote / Work From Home",
    workMode: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    salaryRange: "₹8L – ₹14L / yr + Commission",
    summary:
      "Drive enterprise partnerships, qualify inbound leads, and structure custom software & ERP proposals.",
    description:
      "Join our remote growth team to convert inbound executive inquiries into long-term engineering partnerships across India and global markets.",
    responsibilities: [
      "Lead discovery calls with founders, CTOs, and enterprise procurement teams.",
      "Coordinate with solution architects to scope estimates and craft winning proposals.",
      "Manage CRM pipeline hygiene and quarterly revenue targets.",
    ],
    requirements: [
      "2+ years in B2B IT services, custom software, or SaaS consultative sales.",
      "Strong understanding of software project lifecycles and pricing models.",
    ],
    niceToHave: ["Existing network across Indian startups or mid-market enterprises."],
    skills: ["B2B Sales", "Consultative Selling", "CRM", "Proposal Writing", "Enterprise Accounts"],
    benefits: ["Uncapped Commission Structure", "Health Insurance", "Direct Leadership Access"],
    status: "open",
    isFeatured: false,
    order: 11,
    metaTitle: "Enterprise Solutions & Business Development Lead | MARK 2",
    metaDescription:
      "Drive B2B software and enterprise ERP partnerships at MARK 2 (Remote).",
  },
  {
    title: "QA & Test Automation Engineer",
    slug: "qa-test-automation-engineer",
    department: "Operations",
    location: "Remote / Work From Home",
    workMode: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Entry Level",
    salaryRange: "₹5L – ₹8L / yr",
    summary:
      "Ensure zero-regression releases across web, mobile, and API systems using Playwright, Vitest, and structured QA.",
    description:
      "As a QA & Test Automation Engineer, you will build automated end-to-end test suites, validate API contracts, and champion release quality across all MARK 2 projects.",
    responsibilities: [
      "Write and maintain end-to-end automated tests with Playwright and API test suites.",
      "Perform exploratory, cross-browser, and responsive UI testing before releases.",
      "Document clear reproduction steps and verify bug fixes in staging.",
    ],
    requirements: [
      "1+ year of experience in manual and automated software testing.",
      "Familiarity with JavaScript/TypeScript, Playwright or Cypress, and REST APIs.",
    ],
    niceToHave: ["Experience with CI/CD test integration and performance testing."],
    skills: ["Playwright", "TypeScript", "API Testing", "Vitest", "QA", "CI/CD"],
    benefits: ["Mentorship from Senior Engineers", "100% Remote Flexibility", "Paid Leaves"],
    status: "open",
    isFeatured: false,
    order: 12,
    metaTitle: "QA & Test Automation Engineer | MARK 2",
    metaDescription:
      "Join MARK 2 as a QA & Test Automation Engineer ensuring high-quality software releases.",
  },
];

async function main() {
  await connectToDatabase();

  let createdOrUpdated = 0;
  for (const job of SEED_JOBS) {
    await Job.findOneAndUpdate(
      { slug: job.slug },
      { $set: job },
      { upsert: true, new: true, runValidators: true }
    );
    createdOrUpdated++;
    console.log(`✓ Seeded [${job.employmentType} | ${job.workMode} | ${job.department}] ${job.title}`);
  }

  console.log(`\nDone! Seeded/updated ${createdOrUpdated} jobs in MongoDB.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to seed jobs:", err);
  process.exit(1);
});
