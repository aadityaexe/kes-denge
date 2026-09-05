import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  logoUrl: string;
  industry: string;
  website?: string;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    logoUrl: { type: String, default: "" },
    industry: { type: String, default: "Technology" },
    website: { type: String },
    isFeatured: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);
