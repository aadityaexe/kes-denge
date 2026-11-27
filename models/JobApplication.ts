import mongoose, { Schema, Document } from "mongoose";

export interface IJobApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  jobTitle: string;
  jobSlug: string;
  applicantName: string;
  email: string;
  phone?: string;
  location?: string;
  currentRole?: string;
  experienceYears?: string;
  noticePeriod?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  coverLetter: string;
  status: "new" | "reviewing" | "shortlisted" | "interviewing" | "rejected" | "hired";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    jobTitle: { type: String, required: true },
    jobSlug: { type: String, required: true },
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    currentRole: { type: String, default: "" },
    experienceYears: { type: String, default: "" },
    noticePeriod: { type: String, default: "" },
    portfolioUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    coverLetter: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "reviewing", "shortlisted", "interviewing", "rejected", "hired"],
      default: "new",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

JobApplicationSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.JobApplication ||
  mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);
