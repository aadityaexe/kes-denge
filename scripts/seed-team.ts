import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("No MONGODB_URI found in environment");
  process.exit(1);
}

const team = [
  {
    name: "Mohit Kumar",
    slug: "mohit-kumar",
    role: "Founder & CEO",
    specialization: "Business Strategy & Client Partnerships",
    photo: "",
    bio: "Mohit Kumar co-founded MARK 2 with a focus on building a software company that delivers what it promises. He is responsible for client relationships, business development, and project strategy. He works directly with clients from the initial scoping call through to delivery — ensuring every engagement is well-defined, properly resourced, and delivered on time.",
    techTags: ["Business Strategy", "Client Relations", "Project Scoping", "Operations"],
    socialLinks: {},
    yearsExperience: 5,
    joinedDate: "2020-01-01",
    certifications: [],
    currentlyWorkingOn: "Strategic Partnerships & Business Development",
    quote: "We do not take on projects we cannot deliver. That is the whole strategy.",
    isActive: true,
    order: 1,
  },
  {
    name: "Keshav",
    slug: "keshav",
    role: "CTO",
    specialization: "System Architecture & Enterprise Engineering",
    photo: "",
    bio: "Keshav is the technical co-founder and CTO of MARK 2. He leads architecture decisions, sets engineering standards, and oversees the technical delivery of all client projects. He has architected the ERP systems delivered to EduVeera and Keshera Industry — designing the database schemas, API structures, and backend systems that both platforms run on today.",
    techTags: ["Java", "Spring Boot", "PostgreSQL", "System Architecture", "REST APIs"],
    socialLinks: {},
    yearsExperience: 5,
    joinedDate: "2020-01-01",
    certifications: [],
    currentlyWorkingOn: "ERP Architecture & Backend Engineering",
    quote: "Good architecture is invisible when it works and very expensive when it does not.",
    isActive: true,
    order: 2,
  },
  {
    name: "Aditya Kumar",
    slug: "aditya-kumar",
    role: "Lead Developer",
    specialization: "Full-Stack & Frontend Engineering",
    photo: "https://res.cloudinary.com/dvgxvgjk8/image/upload/v1788632756/mark/1788632755977_whatsapp_image_2025-09-13_at_14_47_23_67906be7.jpg",
    bio: "Aditya Kumar is the lead developer at MARK 2, responsible for frontend engineering, full-stack platform development, and the internal tools that run the company — including the mark2.in website itself. He works across the React, Next.js, and TypeScript stack, and has built the client-facing interfaces for EduVeera and Bharat Bhoomi. He also manages deployments, SEO implementation, and the technical infrastructure of all web projects.",
    techTags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "MongoDB", "Node.js"],
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/aadityaexe",
      github: "https://github.com/aadityaexe",
      twitter: "https://x.com/Aadityakumar_01",
    },
    yearsExperience: 4,
    joinedDate: "2021-01-01",
    certifications: [],
    currentlyWorkingOn: "Platform Architecture & Frontend Engineering",
    quote: "The website you ship is a direct reflection of how seriously you take your business.",
    isActive: true,
    order: 3,
  },
  {
    name: "Haquenawaz Khan",
    slug: "haquenawaz-khan",
    role: "QA & Automation Engineer",
    specialization: "Test Automation, QA Architecture & CI/CD Pipelines",
    photo: "",
    bio: "Haquenawaz Khan is a QA & Automation Engineer at MARK 2, dedicated to ensuring zero-defect releases and enterprise-grade software reliability. He designs comprehensive test automation frameworks, regression suites, and end-to-end testing pipelines across web applications, REST APIs, and core backend services. He works closely with the engineering team to implement CI/CD test automation, performance benchmarking, and continuous quality monitoring across all client platforms.",
    techTags: ["Playwright", "Cypress", "Selenium", "Postman", "Jest", "CI/CD Automation", "API Testing", "Performance Testing"],
    socialLinks: {
      linkedin: "https://www.linkedin.com/company/mark-technologies",
      github: "https://github.com",
      twitter: "",
    },
    yearsExperience: 3,
    joinedDate: "2023-06-01",
    certifications: ["ISTQB Certified Tester", "Automation Test Engineer Specialist"],
    currentlyWorkingOn: "End-to-End Automated Test Suites & Regression Frameworks",
    quote: "Quality is not an afterthought; it is engineered into every release through continuous automated testing.",
    isActive: true,
    order: 4,
  },
  {
    name: "Vishal Singh Rajput",
    slug: "vishal-singh-rajput",
    role: "Full-Stack Engineer",
    specialization: "Full-Stack Web & Distributed API Architecture",
    photo: "",
    bio: "Vishal Singh Rajput is a Full-Stack Engineer at MARK 2, specializing in building high-performance web applications, scalable backend microservices, and end-to-end cloud architectures. He works across Next.js, React, Node.js, TypeScript, and modern database systems to engineer fast, resilient digital products designed to scale seamlessly under heavy workloads.",
    techTags: ["Next.js", "React", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "Tailwind CSS", "Docker"],
    socialLinks: {
      linkedin: "https://www.linkedin.com/company/mark-technologies",
      github: "https://github.com",
      twitter: "",
    },
    yearsExperience: 3,
    joinedDate: "2023-09-01",
    certifications: ["Certified Full-Stack Developer", "Cloud & API Architecture Practitioner"],
    currentlyWorkingOn: "High-Concurrency Backend Architecture & Real-Time APIs",
    quote: "Clean architecture and performant code are the foundation of digital products that stand the test of time.",
    isActive: true,
    order: 5,
  },
];

async function main() {
  await mongoose.connect(uri!, { family: 4 });
  const TeamMemberSchema = new mongoose.Schema({}, { strict: false });
  const TeamMember =
    mongoose.models.TeamMember ||
    mongoose.model("TeamMember", TeamMemberSchema, "teammembers");

  for (const member of team) {
    await TeamMember.findOneAndUpdate(
      { slug: member.slug },
      { $set: member },
      { upsert: true, returnDocument: "after" }
    );
  }

  const all = await TeamMember.find({}).sort({ order: 1 }).lean();
  console.log(`Team members total (${all.length}):`);
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
