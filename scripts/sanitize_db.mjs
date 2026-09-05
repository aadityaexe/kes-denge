import mongoose from "mongoose";

async function sanitizeDatabase() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // 1. Settings
  const settings = await db.collection("settings").findOne({});
  if (settings) {
    const updatedSeo = {
      ...settings.seo,
      defaultTitle: "MARK Technologies — We Build Digital Products That Scale",
      defaultDescription: (settings.seo?.defaultDescription || "").replace(/Kas Denge/gi, "MARK Technologies"),
    };
    await db.collection("settings").updateOne(
      { _id: settings._id },
      {
        $set: {
          name: "MARK Technologies",
          email: "hello@mark2.in",
          seo: updatedSeo,
        },
      }
    );
    console.log("Sanitized settings");
  }

  // 2. Services
  const services = await db.collection("services").find({}).toArray();
  for (const s of services) {
    let metaTitle = s.metaTitle
      ? s.metaTitle.replace(/\s*\|\s*Kas Denge.*$/i, "").replace(/\s*\|\s*MARK.*$/i, "").trim()
      : "";
    if (metaTitle) metaTitle = metaTitle + " | MARK Technologies";

    let desc = s.description
      ? s.description.replace(/Kas Denge Technologies/gi, "MARK Technologies").replace(/Kas Denge/gi, "MARK")
      : s.description;
    let shortDesc = s.shortDescription
      ? s.shortDescription.replace(/Kas Denge Technologies/gi, "MARK Technologies").replace(/Kas Denge/gi, "MARK")
      : s.shortDescription;

    await db.collection("services").updateOne(
      { _id: s._id },
      { $set: { metaTitle: metaTitle || undefined, description: desc, shortDescription: shortDesc } }
    );
  }
  console.log("Sanitized " + services.length + " services");

  // 3. Products
  const products = await db.collection("products").find({}).toArray();
  for (const p of products) {
    let metaTitle = p.metaTitle
      ? p.metaTitle.replace(/\s*\|\s*Kas Denge.*$/i, "").replace(/\s*\|\s*MARK.*$/i, "").trim()
      : "";
    if (metaTitle) metaTitle = metaTitle + " | MARK Technologies";

    let desc = p.description
      ? p.description.replace(/Kas Denge Technologies/gi, "MARK Technologies").replace(/Kas Denge/gi, "MARK")
      : p.description;

    await db.collection("products").updateOne(
      { _id: p._id },
      { $set: { metaTitle: metaTitle || undefined, description: desc } }
    );
  }
  console.log("Sanitized " + products.length + " products");

  // 4. Portfolio
  const portfolios = await db.collection("portfolioitems").find({}).toArray();
  for (const item of portfolios) {
    let metaTitle = item.metaTitle
      ? item.metaTitle.replace(/\s*\|\s*Kas Denge.*$/i, "").replace(/\s*—\s*Kas Denge.*$/i, "").replace(/\s*\|\s*MARK.*$/i, "").trim()
      : "";
    if (metaTitle) metaTitle = metaTitle + " | MARK Technologies";

    let desc = item.description
      ? item.description.replace(/Kas Denge Technologies/gi, "MARK Technologies").replace(/Kas Denge/gi, "MARK")
      : item.description;
    let overview = item.overview
      ? item.overview.replace(/Kas Denge Technologies/gi, "MARK Technologies").replace(/Kas Denge/gi, "MARK")
      : item.overview;

    await db.collection("portfolioitems").updateOne(
      { _id: item._id },
      { $set: { metaTitle: metaTitle || undefined, description: desc, overview: overview } }
    );
  }
  console.log("Sanitized " + portfolios.length + " portfolio items");

  // 5. Testimonials
  const testimonials = await db.collection("testimonials").find({}).toArray();
  for (const t of testimonials) {
    if (t.review && t.review.includes("Kas Denge")) {
      const updatedReview = t.review.replace(/Kas Denge/g, "MARK");
      await db.collection("testimonials").updateOne(
        { _id: t._id },
        { $set: { review: updatedReview } }
      );
    }
  }
  console.log("Sanitized " + testimonials.length + " testimonials");

  // 6. Team members
  const team = await db.collection("teammembers").find({}).toArray();
  for (const m of team) {
    if (m.bio && m.bio.includes("Kas Denge")) {
      const updatedBio = m.bio.replace(/Kas Denge/g, "MARK");
      await db.collection("teammembers").updateOne(
        { _id: m._id },
        { $set: { bio: updatedBio } }
      );
    }
  }
  console.log("Sanitized " + team.length + " team members");

  await mongoose.disconnect();
}

sanitizeDatabase().catch(console.error);
