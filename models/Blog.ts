import mongoose, { Schema, Document } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  status: "draft" | "published" | "archived";
  metaTitle?: string;
  metaDescription?: string;
  readTime: string;
  views: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: { type: String, default: "" },
    category: { type: String, default: "Engineering" },
    tags: [{ type: String }],
    author: {
      name: { type: String, default: "Kas Denge Team" },
      role: { type: String, default: "Technical Architect" },
      avatar: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    metaTitle: { type: String },
    metaDescription: { type: String },
    readTime: { type: String, default: "5 min read" },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
