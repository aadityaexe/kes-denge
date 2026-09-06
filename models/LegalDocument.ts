import mongoose, { Schema, Document } from "mongoose";

export interface ILegalSection {
  title: string;
  content: string;
  order?: number;
}

export interface ILegalDocument extends Document {
  type: "privacy" | "terms";
  title: string;
  subtitle: string;
  badge: string;
  lastUpdated: string;
  contactEmail: string;
  sections: ILegalSection[];
  createdAt: Date;
  updatedAt: Date;
}

const LegalSectionSchema = new Schema<ILegalSection>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const LegalDocumentSchema = new Schema<ILegalDocument>(
  {
    type: { type: String, enum: ["privacy", "terms"], required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    badge: { type: String, default: "Legal" },
    lastUpdated: { type: String, default: "September 2026" },
    contactEmail: { type: String, default: "hello@mark2.in" },
    sections: [LegalSectionSchema],
  },
  { timestamps: true }
);

export default mongoose.models.LegalDocument ||
  mongoose.model<ILegalDocument>("LegalDocument", LegalDocumentSchema);
