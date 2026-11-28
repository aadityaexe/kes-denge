import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogsData } from "@/lib/db-helpers";
import { PageHero } from "@/components/layout/PageHero";
import { ArrowUpRight, Clock, Tag } from "lucide-react";
import { buildBreadcrumbSchema, safeJsonLd } from "@/lib/json-ld";
import { buildPageMetadata, SEO_CONFIG } from "@/lib/seo";

export const revalidate = 3600;

const siteUrl = SEO_CONFIG.siteUrl;

export const metadata: Metadata = buildPageMetadata({
  title: "Software Development Blog — Engineering Insights & Technical Articles",
  description:
    "Technical articles, engineering guides, and real-world insights from the MARK2 team on custom software development, Next.js, React, ERP systems, AI automation, and SaaS architecture.",
  ogTitle: "Software Development Blog",
  ogDescription:
    "Technical articles and engineering insights from the MARK2 team on web development, ERP, mobile apps, and AI automation.",
  ogAlt: "Software Development Blog — MARK2",
  path: "/blog",
});

export default async function BlogPage() {
  const blogs = await getBlogsData();

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Blog", url: `${siteUrl}/blog` },
  ]);

  // CollectionPage + BlogPosting ItemList for rich results
  const blogCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "MARK2 Engineering Blog",
    description: "Technical articles, engineering guides, and insights from the MARK2 team.",
    url: `${siteUrl}/blog`,
    provider: {
      "@type": "Organization",
      name: "MARK2",
      url: siteUrl,
    },
    hasPart: (blogs || []).map((post: any) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: {
        "@type": "Person",
        name: post.author?.name || "MARK2 Team",
      },
      publisher: {
        "@type": "Organization",
        name: "MARK2",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo/logo.png`,
        },
      },
      image: post.featuredImage || `${siteUrl}/opengraph-image`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(blogCollectionSchema) }} />

      <PageHero
        badge="Blog"
        title="Engineering insights from the team."
        subtitle="Technical articles, guides, and lessons from building real products — websites, ERPs, and digital platforms for clients across India."
        className="pb-10 sm:pb-12"
      />

      {/* Blog Grid */}
      <section className="section-padding bg-base">
        <div className="container-site">
          {blogs.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-text-muted text-lg">No articles published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogs.map((post: any, index: number) => (
                <Link
                  key={post._id || post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group flex flex-col bg-surface-1 border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-accent)]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ${index === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}
                >
                  <div className={`relative w-full bg-gradient-to-br from-surface-2 to-[var(--color-accent)]/5 overflow-hidden ${index === 0 ? "h-64 sm:h-80" : "h-48"}`}>
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={`Featured graphic for ${post.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl sm:text-8xl font-display font-bold text-[var(--color-accent)]/10 select-none">
                          {post.category?.substring(0, 2).toUpperCase() || "MK"}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                        <Tag size={10} />
                        {post.category || "Engineering"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-5 sm:p-6 md:p-8">
                    <div className="flex items-center gap-3 text-xs text-text-muted mb-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {post.readTime || "5 min read"}
                      </span>
                      {post.publishedAt && (
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    <h2 className={`font-display font-bold text-text-primary group-hover:text-[var(--color-accent-dark)] transition-colors mb-3 leading-snug break-words ${index === 0 ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
                      {post.title}
                    </h2>

                    <p className="text-text-secondary text-sm sm:text-base leading-relaxed line-clamp-3 mb-6 flex-1 break-words">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--color-border)] group-hover:border-[var(--color-accent)]/20 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-surface-2 border border-[var(--color-border)] flex items-center justify-center text-xs font-bold text-text-secondary uppercase">
                          {post.author?.name?.substring(0, 2) || "MK"}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-text-primary">{post.author?.name || "MARK2 Team"}</p>
                          <p className="text-xs text-text-muted">{post.author?.role || "Engineer"}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center text-text-muted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-[var(--color-accent)] group-hover:text-white group-hover:border-[var(--color-accent)] transition-all duration-400">
                        <ArrowUpRight size={15} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
