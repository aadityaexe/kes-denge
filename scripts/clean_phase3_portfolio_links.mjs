import mongoose from "mongoose";
import fs from "fs";

const envFile = fs.readFileSync(".env.local", "utf8");
const envVars = Object.fromEntries(
  envFile.split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#"))
    .map(line => line.split("="))
    .map(([k, ...v]) => [k.trim(), v.join("=").trim()])
);
process.env.MONGODB_URI = envVars.MONGODB_URI;

async function cleanPhase3() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const result = await db.collection("portfolioitems").updateMany(
    { liveUrl: { $regex: /example\.com/i } },
    { $set: { liveUrl: "" } }
  );

  console.log(`Updated ${result.modifiedCount} portfolio items (cleared placeholder liveUrl).`);

  // Verify
  const items = await db.collection("portfolioitems").find({}).project({ slug: 1, liveUrl: 1, githubUrl: 1 }).toArray();
  for (const item of items) {
    console.log(`Project: ${item.slug} -> liveUrl: '${item.liveUrl}' | githubUrl: '${item.githubUrl || ""}'`);
  }

  await mongoose.disconnect();
}

cleanPhase3().catch(console.error);
