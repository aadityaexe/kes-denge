import mongoose, { Schema, Document } from "mongoose";
import type { SocialLinks } from "@/lib/types";

export interface ITeamMember extends Document {
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

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    specialization: { type: String, required: true },
    photo: { type: String, default: "" },
    bio: { type: String, required: true },
    techTags: [{ type: String }],
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
    },
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

export default mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);
