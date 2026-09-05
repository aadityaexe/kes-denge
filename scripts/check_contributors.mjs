import mongoose from "mongoose";
import fs from "fs";

async function check() {
  const envFile = fs.readFileSync(".env.local", "utf-8");
  const uriMatch = envFile.match(/MONGODB_URI=(.*)/);
  const uri = uriMatch[1].trim();

  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const projects = await db.collection("portfolioitems").find({}).toArray();
  for (const p of projects) {
    if (p.teamMembers && p.teamMembers.length > 0) {
      console.log(p.slug + ":");
      for (const m of p.teamMembers) {
        console.log("   Name:", m.teamMemberName, "| Slug:", m.teamMemberSlug);
      }
    }
  }

  await mongoose.disconnect();
}

check().catch(console.error);
