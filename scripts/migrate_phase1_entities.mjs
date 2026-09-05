import mongoose from "mongoose";
import fs from "fs";

async function runMigration() {
  const envFile = fs.readFileSync(".env.local", "utf-8");
  const uriMatch = envFile.match(/MONGODB_URI=(.*)/);
  if (!uriMatch) {
    throw new Error("MONGODB_URI not found in .env.local");
  }
  const uri = uriMatch[1].trim();

  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  console.log("Connected to MongoDB.");

  // 1. Update Settings
  const settings = await db.collection("settings").findOne({});
  if (settings) {
    const updateFields = {
      siteName: "MARK Technologies",
      contactEmail: "hello@mark2.in",
    };

    if (settings.about) {
      updateFields["about.subtitle"] = (settings.about.subtitle || "")
        .replace(/Kas Denge Technologies/gi, "MARK Technologies")
        .replace(/Kas Denge/gi, "MARK");
      updateFields["about.story"] = (settings.about.story || "")
        .replace(/Kas Denge Technologies/gi, "MARK Technologies")
        .replace(/Kas Denge/gi, "MARK");
      updateFields["about.mission"] = (settings.about.mission || "")
        .replace(/Kas Denge Technologies/gi, "MARK Technologies")
        .replace(/Kas Denge/gi, "MARK");
      updateFields["about.vision"] = (settings.about.vision || "")
        .replace(/Kas Denge Technologies/gi, "MARK Technologies")
        .replace(/Kas Denge/gi, "MARK");
    }

    if (settings.footer) {
      updateFields["footer.copyrightText"] = (settings.footer.copyrightText || "")
        .replace(/Kas Denge Technologies/gi, "MARK Technologies")
        .replace(/Kas Denge/gi, "MARK");
    }

    await db.collection("settings").updateOne({ _id: settings._id }, { $set: updateFields });
    console.log("Updated settings collection.");
  }

  // 2. Update FinFlow case study & David Sterling quote
  const finflow = await db.collection("portfolioitems").findOne({ slug: "finflow-wealth-analytics" });
  if (finflow) {
    const quote = "MARK took our slow, outdated analytics portal and transformed it into a lightning-fast powerhouse. Their engineering discipline and technical execution are truly world-class.";
    const metaDesc = (finflow.metaDescription || "").replace(/Kas Denge Technologies/gi, "MARK Technologies").replace(/Kas Denge/gi, "MARK Technologies");
    const fullDesc = (finflow.fullDescription || "").replace(/Kas Denge Technologies/gi, "MARK Technologies").replace(/Kas Denge/gi, "MARK");
    const solution = (finflow.solution || "").replace(/Kas Denge Technologies/gi, "MARK Technologies").replace(/Kas Denge/gi, "MARK");

    await db.collection("portfolioitems").updateOne(
      { _id: finflow._id },
      {
        $set: {
          "testimonial.quote": quote,
          metaDescription: metaDesc,
          fullDescription: fullDesc,
          solution: solution,
        },
      }
    );
    console.log("Updated finflow-wealth-analytics portfolio item & David Sterling quote.");
  }

  // 3. Update other portfolio items
  const portfolioItems = await db.collection("portfolioitems").find({}).toArray();
  for (const item of portfolioItems) {
    if (item.slug === "finflow-wealth-analytics") continue;

    const updates = {};
    if (item.testimonial?.quote && /kas\s*denge/i.test(item.testimonial.quote)) {
      updates["testimonial.quote"] = item.testimonial.quote
        .replace(/Kas Denge Technologies/gi, "MARK Technologies")
        .replace(/Kas Denge/gi, "MARK");
    }
    if (item.metaDescription && /kas\s*denge/i.test(item.metaDescription)) {
      updates["metaDescription"] = item.metaDescription
        .replace(/Kas Denge Technologies/gi, "MARK Technologies")
        .replace(/Kas Denge/gi, "MARK Technologies");
    }
    if (item.fullDescription && /kas\s*denge/i.test(item.fullDescription)) {
      updates["fullDescription"] = item.fullDescription
        .replace(/Kas Denge Technologies/gi, "MARK Technologies")
        .replace(/Kas Denge/gi, "MARK");
    }
    if (item.githubUrl && /github\.com\/kasdenge/i.test(item.githubUrl)) {
      updates["githubUrl"] = item.githubUrl.replace(/github\.com\/kasdenge/gi, "github.com/aadityaexe");
    }

    if (Object.keys(updates).length > 0) {
      await db.collection("portfolioitems").updateOne({ _id: item._id }, { $set: updates });
      console.log(`Updated portfolio item: ${item.slug}`);
    }
  }

  // 4. Update Product Demo URLs
  const products = await db.collection("products").find({}).toArray();
  for (const prod of products) {
    if (prod.demoUrl && /demo\.kasdenge\.com/i.test(prod.demoUrl)) {
      const newDemoUrl = prod.demoUrl.replace(/demo\.kasdenge\.com/gi, "demo.mark2.in");
      await db.collection("products").updateOne({ _id: prod._id }, { $set: { demoUrl: newDemoUrl } });
      console.log(`Updated product demoUrl for ${prod.slug}: ${newDemoUrl}`);
    }
  }

  // 5. Update user name if desired
  const user = await db.collection("users").findOne({ name: /Kas Denge/i });
  if (user) {
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { name: "MARK Administrator", email: "admin@mark2.in" } }
    );
    console.log("Updated admin user entity.");
  }

  console.log("Migration complete!");
  await mongoose.disconnect();
}

runMigration().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
