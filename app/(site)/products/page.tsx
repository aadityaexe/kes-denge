import type { Metadata } from "next";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/Parallax";
import { getProductsData } from "@/lib/db-helpers";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Products & Enterprise Platforms",
  description: "Explore our flagship platforms and ready-to-deploy software solutions engineered for scalability, security, and seamless integration.",
  alternates: {
    canonical: `${siteUrl}/products`,
  },
  openGraph: {
    title: "Products & Enterprise Platforms | MARK Technologies",
    description: "Explore our flagship platforms and ready-to-deploy software solutions engineered for scalability, security, and seamless integration.",
    url: `${siteUrl}/products`,
    siteName: "MARK Technologies",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Products & Enterprise Platforms | MARK Technologies",
    description: "Explore our flagship platforms and ready-to-deploy software solutions engineered for scalability, security, and seamless integration.",
  },
};

export default async function ProductsPage() {
  const productsData = await getProductsData();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Products", item: `${siteUrl}/products` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pt-24 sm:pt-28 md:pt-32 pb-8 md:pb-12 relative overflow-hidden">
        {/* Background Parallax Orb */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <Parallax speed={0.8} className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/10 to-transparent blur-[120px]" />
        </div>
        <div className="container-site relative z-10">
          <SectionHeading
            as="h1"
            title="Platforms built for scale."
            subtitle="Discover our flagship products designed to accelerate your business operations."
            badge="Products"
            align="center"
          />
        </div>
      </div>
      
      <ProductsSection productsData={productsData} showAll={true} hideHeader={true} />
    </>
  );
}
