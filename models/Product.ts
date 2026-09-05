import mongoose, { Schema, Document } from "mongoose";
import type { ProductCategory, ProductModule } from "@/lib/types";

export interface IProduct extends Document {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  fullDescription?: string;
  category: ProductCategory;
  heroBadge?: string;
  features: any[];
  modules?: ProductModule[];
  benefits?: {
    title: string;
    description: string;
    metric?: string;
    icon?: string;
  }[];
  useCases?: {
    title: string;
    industry: string;
    problem: string;
    solution: string;
    outcome: string;
  }[];
  technologies?: {
    name: string;
    category: string;
    icon?: string;
  }[];
  integrations?: string[];
  targetIndustries?: string[];
  deploymentOptions?: string[];
  securityCompliance?: string[];
  specifications?: {
    label: string;
    value: string;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  images: string[];
  demoUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductModuleSchema = new Schema<ProductModule>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "Blocks" },
    capabilities: [{ type: String }],
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
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
    features: [{ type: Schema.Types.Mixed }],
    modules: [ProductModuleSchema],
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

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

