import mongoose, { Schema, Document } from "mongoose";
import type {
  PortfolioCategory,
  ProjectStatus,
  TeamMemberOnProject,
  PortfolioKeyFeature,
  PortfolioImpactMetric,
  PortfolioTechItem,
} from "@/lib/types";

export interface IPortfolioItem extends Document {
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
  screenshots: string[];
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
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioItemSchema = new Schema<IPortfolioItem>(
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

export default mongoose.models.PortfolioItem ||
  mongoose.model<IPortfolioItem>("PortfolioItem", PortfolioItemSchema);

