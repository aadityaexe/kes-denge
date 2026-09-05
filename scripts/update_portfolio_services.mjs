import mongoose from "mongoose";

const mapping = {
  "finflow-wealth-analytics": ["web-development", "custom-software", "ai-automation"],
  "aura-commerce": ["e-commerce", "web-development", "seo-optimization"],
  "kore-logistics-os": ["erp-software", "custom-software", "cloud-solutions"],
  "pulse-telehealth-suite": ["mobile-apps", "custom-software", "cloud-solutions"],
  "apex-pos-inventory": ["erp-software", "web-development", "cloud-solutions"],
  "horizon-real-estate": ["web-development", "cloud-solutions", "ui-ux-design"],
  "greenleaf-branding": ["ui-ux-design", "web-development", "seo-optimization"],
  "medicare-patient-portal": ["web-development", "custom-software", "cloud-solutions"],
  "logiflow-fleet-erp": ["erp-software", "custom-software", "api-development"],
  "eduspark-learning": ["web-development", "mobile-apps", "cloud-solutions"],
};

async function updateSlugs() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  for (const [slug, services] of Object.entries(mapping)) {
    await db.collection("portfolioitems").updateOne(
      { slug },
      { $set: { relatedServiceSlugs: services } }
    );
    console.log("Updated " + slug + " with services: " + services.join(", "));
  }

  await mongoose.disconnect();
}

updateSlugs().catch(console.error);
