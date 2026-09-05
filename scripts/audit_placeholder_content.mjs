import mongoose from "mongoose";
import fs from "fs";

async function audit() {
  const envFile = fs.readFileSync(".env.local", "utf-8");
  const uriMatch = envFile.match(/MONGODB_URI=(.*)/);
  const uri = uriMatch[1].trim();

  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  console.log("=== 1. TESTIMONIALS (HOMEPAGE & CASE STUDIES) ===");
  const testimonials = await db.collection("testimonials").find({}).toArray();
  for (const t of testimonials) {
    console.log(`[Homepage Testimonial] Author: ${t.authorName || t.author} | Role: ${t.authorRole || t.role} | Company: ${t.company}`);
    console.log(`   Quote: "${(t.review || t.quote || "").slice(0, 100)}..."`);
  }

  const portfolio = await db.collection("portfolioitems").find({}).toArray();
  for (const p of portfolio) {
    if (p.testimonial) {
      console.log(`[Case Study: ${p.slug}] Author: ${p.testimonial.authorName} | Role: ${p.testimonial.authorRole} | Company: ${p.testimonial.company}`);
      console.log(`   Quote: "${(p.testimonial.quote || "").slice(0, 100)}..."`);
    }
  }

  console.log("\n=== 2. COMPANY SETTINGS / LOCATION / CONTACT INFO ===");
  const settings = await db.collection("settings").findOne({});
  console.log("Site Name:     ", settings.siteName);
  console.log("Tagline:       ", settings.tagline);
  console.log("Contact Email: ", settings.contactEmail);
  console.log("Contact Phone: ", settings.contactPhone);
  console.log("Address:       ", settings.address);
  console.log("Stats in DB:   ", settings.stats);

  console.log("\n=== 3. CLIENTS DIRECTORY ===");
  const clients = await db.collection("clients").find({}).toArray();
  for (const c of clients) {
    console.log(`Client: ${c.name} (${c.slug}) | Industry: ${c.industry} | Website: ${c.website || "[empty]"}`);
  }

  await mongoose.disconnect();
}

audit().catch(console.error);
