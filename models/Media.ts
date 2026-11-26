import mongoose, { Schema, Document } from "mongoose";

export interface IMedia extends Document {
  filename: string;
  originalName: string;
  url: string;
  publicId?: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  altText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    altText: { type: String, default: "" },
  },
  { timestamps: true }
);

MediaSchema.index({ createdAt: -1 });

const Media =
  (mongoose.models.Media as mongoose.Model<IMedia>) ||
  mongoose.model<IMedia>("Media", MediaSchema);

export default Media;
