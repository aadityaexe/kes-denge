import type { Metadata } from "next";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { PageHero } from "@/components/layout/PageHero";
import { getProductsData } from "@/lib/db-helpers";
import { buildBreadcrumbSchema, safeJsonLd } from "@/lib/json-ld";
import { buildPageMetadata, SEO_CONFIG } from "@/lib/seo";

const siteUrl = SEO_CONFIG.siteUrl;

export const metadata: Metadata = buildPageMetadata({
  title: "Enterprise Software Products & Ready-to-Deploy Platforms",
  description:
    "Explore MARK2's flagship enterprise software products: custom ERP systems, ready-to-deploy SaaS platforms, and scalable engineering solutions for high-growth businesses.",
  ogTitle: "Enterprise Software Products & Platforms",
  ogDescription:
    "Explore our flagship platforms and ready-to-deploy software solutions engineered for scalability, security, and seamless integration.",
  ogAlt: "Enterprise Software Products — MARK2",
  path: "/products",
  keywords: [
    "enterprise software products",
    "ready-to-deploy software platforms",
    "SaaS products India",
    "custom ERP software",
    "MARK2 products",
  ],
});

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
    name: "MARK2 Enterprise Platforms & Software Products",
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
          name: "MARK2",
          url: siteUrl,
        },
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
        lead="MARK2 develops pre-architected enterprise platforms including School & Academic ERP systems, multi-tenant eCommerce infrastructure engines, and custom manufacturing ERPs. Each product is engineered with real-time analytics, modular microservices, and enterprise role-based access control (RBAC)."
      />

      <ProductsSection productsData={productsData} showAll={true} hideHeader={true} />
    </>
  );
}
