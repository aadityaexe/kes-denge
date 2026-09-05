import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: "admin" | "editor";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "editor",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
