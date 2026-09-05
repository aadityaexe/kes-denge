import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/Parallax";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Review the terms and conditions governing software development services, engagements, and intellectual property rights at MARK Technologies.",
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
  openGraph: {
    title: "Terms of Service | MARK Technologies",
    description: "Review the terms and conditions governing software development services, engagements, and intellectual property rights at MARK Technologies.",
    url: `${siteUrl}/terms`,
    siteName: "MARK Technologies",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | MARK Technologies",
    description: "Review the terms and conditions governing software development services, engagements, and intellectual property rights at MARK Technologies.",
  },
};

export default function TermsOfServicePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Terms of Service", item: `${siteUrl}/terms` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <Parallax
            speed={0.8}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/10 to-transparent blur-[120px]"
          />
        </div>
        <div className="container-site relative z-10">
          <SectionHeading
            as="h1"
            title="Terms of Service"
            subtitle="Last updated: September 2026. Legal framework governing our client partnerships and engineering deliverables."
            badge="Legal & Contracts"
            align="center"
          />
        </div>
      </div>

      <section className="section-padding pt-0">
        <div className="container-site max-w-4xl text-text-secondary leading-relaxed space-y-8">
          <div className="p-6 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
            <h2 className="text-xl font-display font-semibold text-text-primary mb-3">1. Engagement Framework</h2>
            <p>
              By accessing our website or retaining MARK Technologies (&quot;MARK&quot;, &quot;we&quot;, &quot;us&quot;) for custom software engineering, cloud architecture, or digital product development, you agree to comply with and be bound by these Terms of Service in conjunction with applicable Statements of Work (SOW) or Master Services Agreements (MSA).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
            <h2 className="text-xl font-display font-semibold text-text-primary mb-3">2. Engineering Services & Deliverables</h2>
            <p>
              MARK provides specialized software development including web applications, native mobile applications, enterprise ERP/CRM platforms, and AI automation systems. Specific deliverables, milestone schedules, acceptance criteria, and warranties are defined in individual project SOWs signed by both parties.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
            <h2 className="text-xl font-display font-semibold text-text-primary mb-3">3. Intellectual Property Assignment</h2>
            <p>
              Upon receipt of full payment for contracted milestones, all custom source code, documentation, UI designs, and database architectures created specifically for the client are assigned exclusively to the client. MARK retains ownership of general developer utilities, open-source dependencies, and reusable framework components.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
            <h2 className="text-xl font-display font-semibold text-text-primary mb-3">4. Client Responsibilities & Collaboration</h2>
            <p>
              Successful project delivery requires timely access to project stakeholders, third-party API credentials, domain configurations, and prompt milestone review. Delays caused by third-party vendor downtime or pending approvals may adjust estimated release timelines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
            <h2 className="text-xl font-display font-semibold text-text-primary mb-3">5. Confidentiality & Non-Disclosure</h2>
            <p>
              Both parties agree to treat all business data, technical architecture blueprints, pricing schedules, and proprietary source code as strictly confidential. This obligation survives the completion or termination of any active service agreement.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
            <h2 className="text-xl font-display font-semibold text-text-primary mb-3">6. Governing Law & Inquiries</h2>
            <p>
              These terms are governed by and construed in accordance with applicable corporate and commercial law. For contractual or legal inquiries, please contact our legal operations team at{" "}
              <a href="mailto:hello@mark2.in" className="text-[var(--color-accent)] hover:underline">
                hello@mark2.in
              </a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
