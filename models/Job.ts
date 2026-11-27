import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  slug: string;
  department: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship";
  experienceLevel: "Entry Level" | "Mid Level" | "Senior" | "Lead / Principal";
  salaryRange?: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  skills: string[];
  benefits: string[];
  applicationDeadline?: Date;
  applyUrl?: string;
  status: "open" | "closed" | "draft";
  isFeatured: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    department: { type: String, required: true, default: "Engineering" },
    location: { type: String, required: true, default: "Remote" },
    workMode: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
      default: "Remote",
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    experienceLevel: {
      type: String,
      enum: ["Entry Level", "Mid Level", "Senior", "Lead / Principal"],
      default: "Mid Level",
    },
    salaryRange: { type: String, default: "" },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    niceToHave: [{ type: String }],
    skills: [{ type: String }],
    benefits: [{ type: String }],
    applicationDeadline: { type: Date },
    applyUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["open", "closed", "draft"],
      default: "open",
    },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

JobSchema.index({ status: 1, isFeatured: -1, order: 1, createdAt: -1 });
JobSchema.index({ department: 1, workMode: 1, employmentType: 1 });

export default mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
