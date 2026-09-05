import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  title: string;
  slug: string;
  tagline?: string;
  heroBadge?: string;
  icon: string;
  shortDescription: string;
  fullDescription: string;
  targetAudience?: string[];
  problemsSolved?: {
    problem: string;
    solution: string;
  }[];
  features?: any[];
  deliverables?: string[];
  benefits?: {
    title: string;
    description: string;
    metric?: string;
    icon?: string;
  }[];
  process?: {
    step: number;
    title: string;
    description: string;
    duration?: string;
  }[];
  technologies?: {
    name: string;
    category: string;
    icon?: string;
  }[];
  whyChooseUs?: {
    title: string;
    description: string;
    icon?: string;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  relatedServiceSlugs?: string[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  featuredImage?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
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
    features: [{ type: Schema.Types.Mixed }],
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

export default mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

