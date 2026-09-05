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

async function auditPhase3() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  console.log("=== 1. PORTFOLIO ITEMS AUDIT ===");
  const portfolioItems = await db.collection("portfolioitems").find({}).toArray();
  for (const item of portfolioItems) {
    console.log(`\nProject: ${item.title} (slug: ${item.slug})`);
    console.log(`  Live URL: ${item.liveUrl || "[NONE]"}`);
    console.log(`  GitHub URL: ${item.githubUrl || "[NONE]"}`);
    console.log(`  Client: ${item.clientName || "[NONE]"}`);
    if (item.testimonial) {
      console.log(`  Testimonial: "${item.testimonial.quote?.substring(0, 60)}..." by ${item.testimonial.authorName} (${item.testimonial.company})`);
    }
    if (item.teamMembers && item.teamMembers.length > 0) {
      console.log(`  Team Members:`, item.teamMembers.map(m => `${m.teamMemberName} (${m.teamMemberSlug})`));
    }
  }

  console.log("\n=== 2. SETTINGS AUDIT (LOCATION & CONTACT) ===");
  const settings = await db.collection("settings").findOne({});
  if (settings) {
    console.log(`  Address: ${settings.address}`);
    console.log(`  Contact Phone: ${settings.contactPhone}`);
    console.log(`  Contact Email: ${settings.contactEmail}`);
    console.log(`  Site Name: ${settings.siteName}`);
    console.log(`  Footer:`, settings.footer);
    console.log(`  Contact Section:`, settings.contact);
  }

  console.log("\n=== 3. CLIENTS AUDIT ===");
  const clients = await db.collection("clients").find({}).toArray();
  for (const c of clients) {
    console.log(`  Client: ${c.name} (${c.slug}) -> website: ${c.website || "[NONE]"}`);
  }

  console.log("\n=== 4. ANY OTHER OCCURRENCES OF 'example.com' OR '555' IN DB ===");
  const collections = await db.listCollections().toArray();
  for (const col of collections) {
    const docs = await db.collection(col.name).find({}).toArray();
    for (const doc of docs) {
      const s = JSON.stringify(doc);
      if (s.includes("example.com")) {
        console.log(`  [example.com] found in col '${col.name}', doc: ${doc.slug || doc.name || doc._id}`);
      }
      if (s.includes("555")) {
        console.log(`  [555] found in col '${col.name}', doc: ${doc.slug || doc.name || doc._id}`);
      }
    }
  }

  await mongoose.disconnect();
}

auditPhase3().catch(console.error);
