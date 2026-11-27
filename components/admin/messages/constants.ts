export const VALID_STATUSES = [
  { id: "new", label: "New", color: "rose", badge: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  { id: "contacted", label: "Contacted", color: "purple", badge: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { id: "in_progress", label: "In Progress", color: "amber", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "completed", label: "Completed", color: "emerald", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "closed", label: "Closed", color: "blue", badge: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { id: "spam", label: "Spam", color: "zinc", badge: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20" },
] as const;

export const PROJECT_TYPES = [
  "All Types",
  "Web Development",
  "Mobile App Development",
  "ERP & SaaS Systems",
  "AI & Automation",
  "Cloud & DevOps Architecture",
  "Product Engineering & Consulting",
  "Other",
] as const;

export const BUDGET_RANGES = [
  "All Budgets",
  "Under $10k",
  "$10k - $25k",
  "$25k - $50k",
  "$50k - $100k",
  "$100k+",
] as const;
