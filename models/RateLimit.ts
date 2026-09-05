import mongoose, { Schema, Document } from "mongoose";

// ============================================================
// MARK Technologies — Rate Limit Model
// Used by the durable MongoDB-backed rate limiter in lib/validation.ts.
// MongoDB's TTL index automatically deletes expired entries.
// ============================================================

export interface IRateLimit extends Document {
  key: string;
  count: number;
  resetAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>(
  {
    key: { type: String, required: true, unique: true, index: true },
    count: { type: Number, required: true, default: 1 },
    resetAt: { type: Date, required: true },
  },
  { timestamps: false }
);

// TTL index: MongoDB will automatically remove documents once resetAt has passed.
// expireAfterSeconds: 0 means "expire at the exact resetAt time".
RateLimitSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 });

const RateLimit =
  (mongoose.models.RateLimit as mongoose.Model<IRateLimit>) ||
  mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);

export default RateLimit;
