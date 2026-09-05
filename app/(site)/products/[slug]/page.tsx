import { notFound } from "next/navigation";
import { getProductBySlug, getProductsData } from "@/lib/db-helpers";
import { Product } from "@/lib/types";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductHero } from "@/components/products/ProductHero";
import { ProductVisualPreview } from "@/components/products/ProductVisualPreview";
import { ProductFeaturesBento } from "@/components/products/ProductFeaturesBento";
import { ProductModulesGrid } from "@/components/products/ProductModulesGrid";
import { ProductTechSpecs } from "@/components/products/ProductTechSpecs";
import { ProductUseCases } from "@/components/products/ProductUseCases";
import { ProductBenefitsROI } from "@/components/products/ProductBenefitsROI";
import { ProductIntegrations } from "@/components/products/ProductIntegrations";
import { ProductFAQSection } from "@/components/products/ProductFAQSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getProductBySlug(slug)) as Product | null;

  if (!product) {
    return {
      title: "Product Not Found | MARK Technologies",
      description: "The requested software platform could not be found.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";
  const canonicalUrl = `${siteUrl}/products/${product.slug}`;
  const metaTitle = product.metaTitle
    ? product.metaTitle.replace(/\s*\|\s*Kas Denge.*$/i, "").replace(/\s*—\s*Kas Denge.*$/i, "").replace(/\s*\|\s*MARK.*$/i, "").replace(/\s*—\s*MARK.*$/i, "")
    : `${product.name} — ${product.tagline}`;
  const metaDescription =
    product.metaDescription ||
    product.description ||
    "Enterprise-grade customizable software platform engineered for high-growth businesses.";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: product.keywords && product.keywords.length > 0 ? product.keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: "MARK Technologies",
      type: "website",
      images: product.images && product.images.length > 0 ? [{ url: product.images[0] }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: product.images && product.images.length > 0 ? [product.images[0]] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const products = await getProductsData();
  return products.map((product: Product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = (await getProductBySlug(slug)) as Product | null;

  if (!product || product.isActive === false) {
    notFound();
  }

  // Fetch all products for related product linking
  const allProducts = (await getProductsData()) as Product[];
  const relatedProducts = allProducts
    .filter((p) => p.slug !== product.slug && p.isActive !== false)
    .slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";
  const pageUrl = `${siteUrl}/products/${product.slug}`;

  // Structured Data (Schema.org JSON-LD)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    operatingSystem: "Web, Cloud, iOS, Android, Linux, Windows",
    applicationCategory: "BusinessApplication",
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "MARK Technologies",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/contact?product=${product.slug}`,
    },
    url: pageUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${siteUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: pageUrl,
      },
    ],
  };

  const faqSchema =
    product.faqs && product.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: product.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <main id="main-content" className="min-h-screen bg-base relative overflow-hidden">
      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* 1. PRODUCT HERO SECTION */}
      <ProductHero
        name={product.name}
        slug={product.slug}
        tagline={product.tagline}
        description={product.fullDescription || product.description}
        category={product.category}
        heroBadge={product.heroBadge}
        demoUrl={product.demoUrl}
      />

      {/* 2. INTERACTIVE VISUAL PREVIEW & ARCHITECTURE SHOWCASE */}
      <ProductVisualPreview
        productName={product.name}
        category={product.category}
        demoUrl={product.demoUrl}
      />

      {/* 3. PLATFORM FEATURES BENTO */}
      <ProductFeaturesBento
        features={product.features}
        productName={product.name}
      />

      {/* 4. ENTERPRISE MODULES & HUB */}
      {product.modules && product.modules.length > 0 && (
        <ProductModulesGrid
          modules={product.modules}
          productName={product.name}
        />
      )}

      {/* 5. TECHNICAL SPECIFICATIONS & COMPLIANCE */}
      <ProductTechSpecs
        specifications={product.specifications}
        technologies={product.technologies}
        deploymentOptions={product.deploymentOptions}
        securityCompliance={product.securityCompliance}
        productName={product.name}
      />

      {/* 6. REAL-WORLD USE CASES */}
      {product.useCases && product.useCases.length > 0 && (
        <ProductUseCases
          useCases={product.useCases}
          targetIndustries={product.targetIndustries}
          productName={product.name}
        />
      )}

      {/* 7. WHY CHOOSE & ROI BENEFITS */}
      {product.benefits && product.benefits.length > 0 && (
        <ProductBenefitsROI
          benefits={product.benefits}
          productName={product.name}
        />
      )}

      {/* 8. INTEGRATION ECOSYSTEM */}
      {product.integrations && product.integrations.length > 0 && (
        <ProductIntegrations
          integrations={product.integrations}
          productName={product.name}
        />
      )}

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      {product.faqs && product.faqs.length > 0 && (
        <ProductFAQSection
          faqs={product.faqs}
          productName={product.name}
        />
      )}

      {/* 10. COMPLEMENTARY PRODUCTS (INTERNAL LINKING) */}
      {relatedProducts.length > 0 && (
        <section id="related-products" className="section-padding border-b border-[var(--color-border)] bg-surface-2/20">
          <div className="container-site">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-8 md:mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-1 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)] shadow-xs">
                  Complementary Platforms
                </div>
                <h2 className="text-display-sm font-bold font-display text-text-primary">
                  Explore Related Products
                </h2>
              </div>
              <Link
                href="/products"
                className="text-sm font-semibold text-[var(--color-accent-dark)] hover:underline flex items-center gap-1.5"
              >
                View all products <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relProd) => (
                <Link
                  key={relProd.slug}
                  href={`/products/${relProd.slug}`}
                  className="group bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5 sm:p-6 md:p-8 transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-surface-2 text-text-muted text-xs font-mono font-medium border border-[var(--color-border)]">
                        {relProd.category}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-text-muted group-hover:bg-[var(--color-accent)] group-hover:text-surface-1 transition-colors">
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold font-display text-text-primary mb-2 group-hover:text-[var(--color-accent-dark)] transition-colors">
                      {relProd.name}
                    </h3>

                    <p className="text-sm text-text-secondary font-light leading-relaxed line-clamp-2">
                      {relProd.tagline}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--color-border)]/60 text-xs font-semibold text-[var(--color-accent-dark)] flex items-center gap-1">
                    <span>Explore {relProd.name}</span>
                    <ArrowRight size={12} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. LUXURY DARK CHAMPAGNE CTA BANNER */}
      <section id="cta" className="container-site py-12 sm:py-16 md:py-18">
        <div className="rounded-[var(--radius-xl)] bg-text-primary text-surface-1 p-6 sm:p-10 md:p-14 text-center flex flex-col items-center relative overflow-hidden shadow-2xl">
          {/* Ambient Champagne Gold Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-accent)]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-surface-1/10 text-[var(--color-accent-light)] text-xs font-mono mb-4 md:mb-6 uppercase tracking-widest border border-surface-1/15 backdrop-blur-md">
              <Zap size={12} />
              Deploy {product.name}
            </div>

            <h2 className="text-display-md md:text-display-lg font-bold font-display mb-4 md:mb-6 tracking-tight leading-[1.05]">
              Ready to deploy {product.name} in your private environment?
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-surface-2 max-w-2xl mx-auto mb-6 sm:mb-8 font-light opacity-90 leading-relaxed">
              Stop adapting your workflows to rigid software. Get a platform that adapts to you. Contact our senior architects to discuss custom schema integrations, private cloud VPC provisioning, and deployment sprint timelines.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto">
              <Button
                size="lg"
                href={`/contact?subject=Deployment%20Inquiry%20for%20${encodeURIComponent(product.name)}&product=${product.slug}`}
                className="w-full sm:w-auto rounded-full px-7 sm:px-9 py-3.5 sm:py-4 bg-[var(--color-accent)] text-surface-1 hover:bg-[var(--color-accent-light)] border-none font-semibold text-base shadow-2xl justify-center"
              >
                Schedule Technical Discovery
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                href="/products"
                className="w-full sm:w-auto rounded-full px-7 sm:px-8 py-3.5 sm:py-4 text-surface-1 border-surface-1/30 hover:bg-surface-1/10 text-base justify-center"
              >
                Explore All Products
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
