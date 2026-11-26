import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  try {
    await connectToDatabase();
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
    }
    return NextResponse.json(
      {
        status: "ok",
        db: "connected",
        latencyMs: Date.now() - startedAt,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch {
    return NextResponse.json(
      {
        status: "degraded",
        db: "unreachable",
        latencyMs: Date.now() - startedAt,
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store", "Retry-After": "10" },
      }
    );
  }
}
