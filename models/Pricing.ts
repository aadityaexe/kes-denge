import mongoose, { Schema, Document } from "mongoose";

export interface IPricingFeature {
  text: string;
  included: boolean;
}

export interface IPricingTier extends Document {
  name: string;
  price: string;
  period: string;
  description: string;
  features: IPricingFeature[];
  isPopular: boolean;
  ctaText: string;
  ctaHref: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PricingTierSchema = new Schema<IPricingTier>(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    period: { type: String, default: "project" },
    description: { type: String, required: true },
    features: [
      {
        text: { type: String, required: true },
        included: { type: Boolean, default: true },
      },
    ],
    isPopular: { type: Boolean, default: false },
    ctaText: { type: String, default: "Get Started" },
    ctaHref: { type: String, default: "/contact" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.PricingTier || mongoose.model<IPricingTier>("PricingTier", PricingTierSchema);
