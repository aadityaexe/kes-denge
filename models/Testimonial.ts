import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  clientName: string;
  company: string;
  role: string;
  photo: string;
  review: string;
  rating: number;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true },
    company: { type: String, required: true },
    role: { type: String, default: "Client" },
    photo: { type: String, default: "" },
    review: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    isFeatured: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
