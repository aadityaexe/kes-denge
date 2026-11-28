/**
 * scripts/create-admin.ts — Idempotent admin bootstrap script
 *
 * Usage:
 *   ADMIN_EMAIL=admin@mark2.in ADMIN_PASSWORD="..." npx tsx scripts/create-admin.ts
 */
import { existsSync } from "fs";
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
if (existsSync(".env")) process.loadEnvFile(".env");
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../lib/mongodb";
import User from "../models/User";

const BCRYPT_COST = 12;

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  const name = (process.env.ADMIN_NAME || "MARK2 Admin").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("Error: Provide a valid ADMIN_EMAIL env var.");
    process.exit(1);
  }
  if (password.length < 12) {
    console.error("Error: ADMIN_PASSWORD must be at least 12 characters.");
    process.exit(1);
  }

  await connectToDatabase();
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  const existing = await User.findOne({ email });
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.role = "admin";
    existing.tokenVersion = (existing.tokenVersion ?? 0) + 1;
    await existing.save();
    console.log(`Updated existing admin user (${email}), tokenVersion=${existing.tokenVersion}`);
  } else {
    await User.create({
      email,
      name,
      passwordHash,
      role: "admin",
      tokenVersion: 0,
    });
    console.log(`Created admin user (${email})`);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
