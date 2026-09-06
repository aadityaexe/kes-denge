import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Simple env loader
const envFile = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  const content = fs.readFileSync(envFile, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGODB_URI found in environment");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const TeamMemberSchema = new mongoose.Schema({}, { strict: false });
  const TeamMember =
    mongoose.models.TeamMember ||
    mongoose.model("TeamMember", TeamMemberSchema, "teammembers");

  const haquenawaz = {
    name: "Haquenawaz Khan",
    slug: "haquenawaz-khan",
    role: "QA & Automation Engineer",
    specialization: "Test Automation, QA Architecture & CI/CD Pipelines",
    photo: "",
    bio: "Haquenawaz Khan is a QA & Automation Engineer at MARK Technologies, dedicated to ensuring zero-defect releases and enterprise-grade software reliability. He designs comprehensive test automation frameworks, regression suites, and end-to-end testing pipelines across web applications, REST APIs, and core backend services. He works closely with the engineering team to implement CI/CD test automation, performance benchmarking, and continuous quality monitoring across all client platforms.",
    techTags: [
      "Playwright",
      "Cypress",
      "Selenium",
      "Postman",
      "Jest",
      "CI/CD Automation",
      "API Testing",
      "Performance Testing",
    ],
    socialLinks: {
      linkedin: "https://www.linkedin.com/company/mark-technologies",
      github: "https://github.com",
      twitter: "",
    },
    yearsExperience: 3,
    joinedDate: "2023-06-01",
    certifications: [
      "ISTQB Certified Tester",
      "Automation Test Engineer Specialist",
    ],
    currentlyWorkingOn: "End-to-End Automated Test Suites & Regression Frameworks",
    quote: "Quality is not an afterthought; it is engineered into every release through continuous automated testing.",
    isActive: true,
    order: 4,
  };

  await TeamMember.findOneAndUpdate(
    { slug: haquenawaz.slug },
    { $set: haquenawaz },
    { upsert: true, returnDocument: "after" }
  );

  const all = await TeamMember.find({}).sort({ order: 1 }).lean();
  console.log(`Team members (${all.length}):`);
  for (const m of all) {
    console.log(`- ${m.name} | ${m.role} (order: ${m.order}, slug: ${m.slug})`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
