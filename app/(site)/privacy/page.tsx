import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/Parallax";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how MARK Technologies collects, protects, and manages data across our engineering services, platforms, and client partnerships.",
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy | MARK Technologies",
    description: "Learn how MARK Technologies collects, protects, and manages data across our engineering services, platforms, and client partnerships.",
    url: `${siteUrl}/privacy`,
    siteName: "MARK Technologies",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Privacy Policy | MARK Technologies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | MARK Technologies",
    description: "Learn how MARK Technologies collects, protects, and manages data across our engineering services, platforms, and client partnerships.",
    images: [`${siteUrl}/twitter-image`],
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${siteUrl}/privacy` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <Parallax
            speed={0.8}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/10 to-transparent blur-[120px]"
          />
        </div>
        <div className="container-site relative z-10">
          <SectionHeading
            as="h1"
            title="Privacy Policy"
            subtitle="Last updated: September 2026. How we collect, safeguard, and respect your data."
            badge="Legal & Security"
            align="center"
          />
        </div>
      </div>

      <section className="section-padding pt-0">
        <div className="container-site max-w-4xl text-text-secondary leading-relaxed space-y-6 sm:space-y-8">
          <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
            <h2 className="text-xl font-display font-semibold text-text-primary mb-3">1. Overview & Commitment</h2>
            <p>
              MARK Technologies (&quot;MARK&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides product-engineering, software architecture, and custom application development services. We respect your personal data and maintain strict technical and operational controls to protect client information, project codebases, and visitor data.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
            <h2 className="text-xl font-display font-semibold text-text-primary mb-3">2. Information We Collect</h2>
            <p className="mb-2">When you interact with our website or enter an engineering contract, we may collect:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Contact Information:</strong> Name, work email address, phone number, and company name provided via our inquiry forms.</li>
              <li><strong>Project Specifications:</strong> Technical scopes, project requirements, architectural diagrams, and NDA-protected business criteria.</li>
              <li><strong>Technical Logs:</strong> IP address, browser type, device information, and interaction metrics collected automatically via secure server logs for operational security.</li>
            </ul>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
            <h2 className="text-xl font-display font-semibold text-text-primary mb-3">3. How We Use Information</h2>
            <p>We use your information solely to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Evaluate project requirements, prepare proposals, and deliver software engineering services.</li>
              <li>Communicate regarding ongoing architectural sprints, releases, and platform operations.</li>
              <li>Comply with regulatory obligations and maintain cybersecurity defense against unauthorized access.</li>
            </ul>
            <p className="mt-2 text-text-primary font-medium">We never sell, rent, or monetize your personal or commercial data.</p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
            <h2 className="text-xl font-display font-semibold text-text-primary mb-3">4. Intellectual Property & Confidentiality</h2>
            <p>
              All client codebases, architectures, and intellectual property developed under engagement contracts remain the sole property of our clients as specified in individual Master Services Agreements (MSA). Non-disclosure agreements (NDAs) are executed prior to reviewing proprietary source materials.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
            <h2 className="text-xl font-display font-semibold text-text-primary mb-3">5. Data Retention & Security</h2>
            <p>
              We implement industry-standard encryption in transit (TLS 1.3) and at rest (AES-256), least-privilege role-based access control (RBAC), and continuous threat monitoring. Client data is retained strictly as long as necessary to fulfill contractual commitments.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-[var(--color-border)]">
            <h2 className="text-xl font-display font-semibold text-text-primary mb-3">6. Contact Our Security & Legal Team</h2>
            <p>
              For questions regarding this Privacy Policy or to request deletion of your information, reach out to our team at{" "}
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
