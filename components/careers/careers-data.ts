import {
  Award,
  BookOpen,
  Briefcase,
  Clock,
  Code2,
  FileSearch,
  Globe,
  GraduationCap,
  HeartPulse,
  Laptop,
  MessageSquare,
  PartyPopper,
  Rocket,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

export interface CompanyInfo {
  siteName: string;
  description: string;
  aboutSubtitle: string;
  mission: string;
  vision: string;
  story: string;
}

export const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: "Engineering Rigor",
    description:
      "We write maintainable, well-tested code and architect systems built to scale without shortcuts.",
  },
  {
    icon: Rocket,
    title: "High Ownership",
    description:
      "Every team member owns outcomes end-to-end — from architectural decisions to production reliability.",
  },
  {
    icon: Users,
    title: "Radical Transparency",
    description:
      "Open communication, blameless retrospectives, and honest feedback loops across all teams.",
  },
  {
    icon: Award,
    title: "Continuous Craft",
    description:
      "We sweat the details in UI polish, API latency, and developer experience every single day.",
  },
];

export const WHY_JOIN_US = [
  {
    icon: Users,
    title: "Collaborative Culture",
    description:
      "Work alongside senior engineers, product designers, and architects in flat, low-ego teams where great ideas win.",
  },
  {
    icon: Rocket,
    title: "Accelerated Career Growth",
    description:
      "Clear progression tracks, regular 1:1 mentorship, and opportunities to lead greenfield client and SaaS products.",
  },
  {
    icon: GraduationCap,
    title: "Learning & Development",
    description:
      "Dedicated upskilling budget, weekly tech talks, and hands-on exposure to Next.js, AI workflows, and cloud architecture.",
  },
  {
    icon: Clock,
    title: "Work-Life Balance",
    description:
      "Async-first collaboration, focused deep-work blocks, and flexible schedules that respect your personal time.",
  },
];

export const BENEFITS_PERKS = [
  {
    icon: HeartPulse,
    title: "Health Insurance",
    description:
      "Comprehensive medical coverage for you and your family for peace of mind (placeholder policy details).",
  },
  {
    icon: CalendarIconProxy(),
    title: "Paid Leaves",
    description:
      "Generous paid time off, sick leave, and public holidays so you can rest and recharge.",
  },
  {
    icon: Globe,
    title: "Flexible Working",
    description:
      "Remote-first and hybrid flexibility with async workflows tailored for deep productivity.",
  },
  {
    icon: BookOpen,
    title: "Learning Opportunities",
    description:
      "Annual stipend for courses, certifications, books, and technical conferences.",
  },
  {
    icon: Award,
    title: "Professional Development",
    description:
      "Structured bi-annual growth reviews, leadership coaching, and cross-functional mentorship.",
  },
  {
    icon: Laptop,
    title: "Modern Tech & Setup",
    description:
      "Home-office setup support, modern developer tooling, and performance-linked rewards.",
  },
];

function CalendarIconProxy() {
  return Clock;
}

export const HIRING_STEPS = [
  {
    step: "01",
    icon: Briefcase,
    title: "Apply Online",
    description:
      "Submit your application in minutes with your resume, portfolio, or GitHub profile.",
  },
  {
    step: "02",
    icon: FileSearch,
    title: "Resume Screening",
    description:
      "Our hiring team reviews your experience, shipped projects, and alignment with the role.",
  },
  {
    step: "03",
    icon: Code2,
    title: "Technical Assessment",
    description:
      "A practical, real-world task or portfolio walkthrough focused on how you solve problems.",
  },
  {
    step: "04",
    icon: MessageSquare,
    title: "Interview",
    description:
      "Meet with engineering and product leads to discuss architecture, craft, and team culture.",
  },
  {
    step: "05",
    icon: UserCheck,
    title: "Final Selection",
    description:
      "We align on role expectations, compensation, and extend a formal offer.",
  },
  {
    step: "06",
    icon: PartyPopper,
    title: "Welcome Aboard",
    description:
      "Structured onboarding, buddy pairing, and your first production ship in week one.",
  },
];

export const LIFE_GALLERY = [
  {
    title: "Architecture & Sprint Planning",
    subtitle: "Collaborative whiteboard sessions turning complex requirements into clean systems.",
    tag: "Team Collaboration",
    gradient: "from-[var(--color-accent)]/20 via-surface-2 to-surface-3",
  },
  {
    title: "Focused Deep-Work Culture",
    subtitle: "Quiet, uninterrupted blocks designed for shipping high-craft software.",
    tag: "Work Environment",
    gradient: "from-surface-3 via-[var(--color-accent)]/15 to-surface-2",
  },
  {
    title: "Design & Code Critiques",
    subtitle: "Weekly peer reviews where engineers and designers elevate every pixel and API.",
    tag: "Engineering Craft",
    gradient: "from-surface-2 via-surface-3 to-[var(--color-accent)]/20",
  },
  {
    title: "Remote-First Connection",
    subtitle: "Virtual demo days, knowledge-sharing Fridays, and quarterly team offsites.",
    tag: "Culture & Community",
    gradient: "from-[var(--color-accent)]/15 via-surface-3 to-surface-1",
  },
];

export const EMPLOYEE_TESTIMONIALS = [
  {
    name: "Aarav Mehta (Sample)",
    designation: "Senior Full-Stack Engineer",
    initials: "AM",
    quote:
      "The level of ownership here is unmatched. Within my first month, I was architecting production Next.js modules and collaborating directly with leadership.",
  },
  {
    name: "Priya Nair (Sample)",
    designation: "Lead Product Designer",
    initials: "PN",
    quote:
      "Design and engineering genuinely respect each other. We have the space to iterate on typography, motion, and usability without rushing out half-baked work.",
  },
  {
    name: "Rohan Verma (Sample)",
    designation: "Backend & Cloud Architect",
    initials: "RV",
    quote:
      "Flexible hours and async communication mean I can do my best deep work while still feeling deeply connected to a sharp, supportive team.",
  },
];

export const CAREER_FAQS = [
  {
    question: "How does the application process work?",
    answer:
      "Browse our open positions above, click 'Apply Now' on any role that matches your skills, and submit your details along with your resume link and portfolio/GitHub. You'll receive an immediate confirmation on screen.",
  },
  {
    question: "What are the general eligibility criteria?",
    answer:
      "We evaluate candidates primarily on practical problem-solving ability, code or design quality, communication clarity, and alignment with our core values rather than rigid degree requirements.",
  },
  {
    question: "Can freshers or recent graduates apply?",
    answer:
      "Yes! We welcome freshers and early-career builders for Entry Level and Internship roles. If you have strong personal projects, open-source contributions, or internships, we'd love to see them.",
  },
  {
    question: "What should I expect during the interview process?",
    answer:
      "Our process typically includes a resume review, a practical technical or design assessment (no trick whiteboard puzzles), and 1–2 conversational interviews covering system thinking, past work, and culture fit.",
  },
  {
    question: "How can I check my application status?",
    answer:
      "Our hiring team reviews every application within 5–7 business days and reaches out via email to shortlisted candidates. For urgent updates, you can reply to your confirmation or reach us via the Contact page.",
  },
];

export const EXPERIENCE_LEVELS = [
  "All",
  "Entry Level",
  "Mid Level",
  "Senior",
  "Lead / Principal",
] as const;
