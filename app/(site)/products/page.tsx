import type { Metadata } from "next";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { PageHero } from "@/components/layout/PageHero";
import { getProductsData } from "@/lib/db-helpers";
import { buildBreadcrumbSchema, safeJsonLd } from "@/lib/json-ld";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Enterprise Software Products & Ready-to-Deploy Platforms",
  description: "Explore MARK 2' flagship enterprise software products: custom ERP systems, ready-to-deploy SaaS platforms, and scalable engineering solutions for high-growth businesses.",
  keywords: [
    "enterprise software products",
    "ready-to-deploy software platforms",
    "SaaS products India",
    "custom ERP software",
    "MARK 2 products",
    "MARK 2 Technologies",
    "MARK 2 software",
  ],
  alternates: {
    canonical: `${siteUrl}/products`,
  },
  openGraph: {
    title: "Enterprise Software Products & Platforms",
    description: "Explore our flagship platforms and ready-to-deploy software solutions engineered for scalability, security, and seamless integration.",
    url: `${siteUrl}/products`,
    siteName: "MARK 2 Technologies",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Enterprise Software Products — MARK 2",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Enterprise Software Products & Platforms",
    description: "Explore our flagship platforms and ready-to-deploy software solutions engineered for scalability, security, and seamless integration.",
    images: [`${siteUrl}/twitter-image`],
  },
};

export const revalidate = 3600;

export default async function ProductsPage() {
  const productsData = await getProductsData();

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Products", url: `${siteUrl}/products` },
  ]);

  const productListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MARK 2 Enterprise Platforms & Software Products",
    itemListElement: (productsData || []).map((p: any, idx: number) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "SoftwareApplication",
        name: p.name,
        description: p.description || p.tagline,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Cloud, Web",
        url: `${siteUrl}/products/${p.slug}`,
        provider: {
          "@type": "Organization",
          name: "MARK 2 Technologies",
          url: siteUrl
        }
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(productListSchema) }}
      />
      <PageHero
        badge="Products"
        title="Platforms built for scale."
        subtitle="Discover our flagship products designed to accelerate your business operations."
        lead="MARK 2 develops pre-architected enterprise platforms including School & Academic ERP systems, multi-tenant eCommerce infrastructure engines, and custom manufacturing ERPs. Each product is engineered with real-time analytics, modular microservices, and enterprise role-based access control (RBAC)."
      />

      <ProductsSection productsData={productsData} showAll={true} hideHeader={true} />
    </>
  );
}
