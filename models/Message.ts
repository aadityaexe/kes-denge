import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  budgetRange: string;
  message: string;
  status: "new" | "read" | "in_progress" | "completed" | "spam" | "contacted" | "closed";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    projectType: { type: String, required: true },
    budgetRange: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "in_progress", "completed", "spam", "contacted", "closed"],
      default: "new",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

MessageSchema.index({ status: 1, createdAt: -1 });
MessageSchema.index({ createdAt: -1 });

const Message =
  (mongoose.models.Message as mongoose.Model<IMessage>) ||
  mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
