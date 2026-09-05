// ============================================================
// MARK Technologies — Core Data Types
// ============================================================

// ------ Services ------
export interface ServiceProblemSolution {
  problem: string;
  solution: string;
}

export interface ServiceFeatureItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ServiceBenefitItem {
  title: string;
  description: string;
  metric?: string;
  icon?: string;
}

export interface ServiceProcessItem {
  step: number;
  title: string;
  description: string;
  duration?: string;
}

export interface ServiceTechItem {
  name: string;
  category: string;
  icon?: string;
}

export interface ServiceWhyChooseUsItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ServiceFAQItem {
  question: string;
  answer: string;
}

export interface Service {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  tagline?: string;
  heroBadge?: string;
  icon: string; // Lucide icon name
  shortDescription: string;
  fullDescription: string;
  targetAudience?: string[];
  problemsSolved?: ServiceProblemSolution[];
  features?: (string | ServiceFeatureItem)[];
  deliverables?: string[];
  benefits?: ServiceBenefitItem[];
  process?: ServiceProcessItem[];
  technologies?: ServiceTechItem[];
  whyChooseUs?: ServiceWhyChooseUsItem[];
  faqs?: ServiceFAQItem[];
  relatedServiceSlugs?: string[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  featuredImage?: string;
  order: number;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ------ Products ------
export type ProductCategory =
  | "ERP"
  | "CRM"
  | "HRMS"
  | "POS"
  | "School"
  | "Hospital"
  | "Inventory"
  | "Custom";

export interface ProductModule {
  name: string;
  description: string;
  icon: string;
  capabilities?: string[];
}

export interface ProductFeatureItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ProductBenefitItem {
  title: string;
  description: string;
  metric?: string;
  icon?: string;
}

export interface ProductUseCaseItem {
  title: string;
  industry: string;
  problem: string;
  solution: string;
  outcome: string;
}

export interface ProductTechItem {
  name: string;
  category: string;
  icon?: string;
}

export interface ProductSpecificationItem {
  label: string;
  value: string;
}

export interface ProductFAQItem {
  question: string;
  answer: string;
}

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  fullDescription?: string;
  category: ProductCategory;
  heroBadge?: string;
  features: (string | ProductFeatureItem)[];
  modules?: ProductModule[];
  benefits?: ProductBenefitItem[];
  useCases?: ProductUseCaseItem[];
  technologies?: ProductTechItem[];
  integrations?: string[];
  targetIndustries?: string[];
  deploymentOptions?: string[];
  securityCompliance?: string[];
  specifications?: ProductSpecificationItem[];
  faqs?: ProductFAQItem[];
  images: string[];
  demoUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  isActive: boolean;
  order: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ------ Portfolio / Case Study ------
export type PortfolioCategory =
  | "Website"
  | "App"
  | "ERP"
  | "Dashboard"
  | "Branding"
  | "Custom";

export type ProjectStatus = "completed" | "ongoing" | "maintenance";

export interface TeamMemberOnProject {
  teamMemberSlug: string;
  teamMemberName: string;
  teamMemberPhoto?: string;
  roleOnProject: string;
}

export interface PortfolioKeyFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface PortfolioImpactMetric {
  metric: string;
  label: string;
  description?: string;
}

export interface PortfolioTechItem {
  name: string;
  category?: string;
  icon?: string;
}

export interface PortfolioItem {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  category: PortfolioCategory;
  clientName: string;
  clientLogo?: string;
  industry: string;
  oneLiner: string;
  shortDescription?: string;
  fullDescription?: string;
  overview?: string;
  problem: string;
  solution: string;
  challenges?: string[];
  solutions?: string[];
  keyFeatures?: PortfolioKeyFeature[];
  results: string[];
  impactMetrics?: PortfolioImpactMetric[];
  techStack: string[];
  technologies?: PortfolioTechItem[];
  startDate: string;
  launchDate: string;
  durationLabel: string;
  status: ProjectStatus;
  teamMembers?: TeamMemberOnProject[];
  coverImage?: string;
  heroImage?: string;
  screenshots?: string[];
  galleryImages?: string[];
  liveUrl?: string;
  githubUrl?: string;
  relatedServiceSlugs?: string[];
  testimonial?: {
    quote: string;
    authorName: string;
    authorRole: string;
    company?: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ------ Clients ------
export interface Client {
  id: string;
  name: string;
  logoUrl: string;
  industry: string;
  website?: string;
  projectSlugs: string[];
  testimonial?: {
    quote: string;
    authorName: string;
    authorRole: string;
    authorPhoto?: string;
  };
  isFeatured: boolean;
  isActive: boolean;
}

// ------ Team Members ------
export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  slug: string;
  role: string;
  specialization: string;
  photo: string;
  bio: string;
  techTags: string[];
  socialLinks: SocialLinks;
  yearsExperience: number;
  joinedDate: string;
  certifications: string[];
  currentlyWorkingOn?: string;
  quote?: string;
  isActive: boolean;
  order: number;
}

// ------ Testimonials ------
export interface TestimonialEntry {
  id: string;
  clientName: string;
  company: string;
  photo: string;
  review: string;
  rating: number; // 1–5
  isActive: boolean;
}

// ------ Contact Submission ------
export type ContactStatus = "new" | "contacted" | "closed";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budgetRange: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

// ------ Pricing ------
export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: PricingFeature[];
  isPopular: boolean;
  ctaText: string;
  ctaHref: string;
}

// ------ FAQ ------
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// ------ Process Step ------
export interface ProcessStep {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
}

// ------ Technology ------
export interface Technology {
  name: string;
  icon: string; // path to logo
  category: "frontend" | "backend" | "database" | "devops" | "mobile" | "language";
}

// ------ Stats ------
export interface StatItem {
  label: string;
  value: number;
  suffix: string;
}

// ------ Navigation ------
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
