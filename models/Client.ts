import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  slug?: string;
  logoUrl: string;
  industry: string;
  website?: string;
  tagline?: string;
  description?: string;
  aboutPartnership?: string;
  servicesProvided?: string[];
  partnershipYear?: string;
  companySize?: string;
  location?: string;
  testimonialQuote?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
  testimonialPhoto?: string;
  keyAchievements?: string[];
  technologies?: string[];
  caseStudySlug?: string;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true, index: true },
    logoUrl: { type: String, default: "" },
    industry: { type: String, default: "Technology" },
    website: { type: String, default: "" },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    aboutPartnership: { type: String, default: "" },
    servicesProvided: { type: [String], default: [] },
    partnershipYear: { type: String, default: "" },
    companySize: { type: String, default: "" },
    location: { type: String, default: "" },
    testimonialQuote: { type: String, default: "" },
    testimonialAuthor: { type: String, default: "" },
    testimonialRole: { type: String, default: "" },
    testimonialPhoto: { type: String, default: "" },
    keyAchievements: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    caseStudySlug: { type: String, default: "" },
    isFeatured: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);
