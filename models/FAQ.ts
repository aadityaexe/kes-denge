import mongoose, { Schema, Document } from "mongoose";

export interface IFAQItem extends Document {
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQItem>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.FAQItem || mongoose.model<IFAQItem>("FAQItem", FAQSchema);
