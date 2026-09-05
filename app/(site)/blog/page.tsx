import type { Metadata } from "next";
import Link from "next/link";
import { getBlogsData } from "@/lib/db-helpers";
import { Parallax } from "@/components/ui/Parallax";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRight, Clock, Tag } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export const metadata: Metadata = {
  title: "Blog — Engineering Insights & Technical Articles",
  description: "Technical articles, engineering guides, and insights from the MARK Technologies team on web development, ERP systems, SEO, and software architecture.",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: "Blog — Engineering Insights | MARK Technologies",
    description: "Technical articles and engineering insights from the MARK Technologies team.",
    url: `${siteUrl}/blog`,
    siteName: "MARK Technologies",
    type: "website",
    images: [{ url: `${siteUrl}/opengraph-image`, width: 1200, height: 630, alt: "Blog — MARK Technologies" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Engineering Insights | MARK Technologies",
    description: "Technical articles and engineering insights from the MARK Technologies team.",
    images: [`${siteUrl}/twitter-image`],
  },
};

export default async function BlogPage() {
  const blogs = await getBlogsData();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
    ],
  };

  const categories = blogs.length > 0
    ? ["All", ...Array.from(new Set(blogs.map((b: any) => b.category).filter(Boolean)))]
    : [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <div className="pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <Parallax speed={0.8} className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/10 to-transparent blur-[120px]" />
        </div>
        <div className="container-site relative z-10">
          <SectionHeading
            as="h1"
            title="Engineering insights from the team."
            subtitle="Technical articles, guides, and lessons from building real products — websites, ERPs, and digital platforms for clients across India."
            badge="Blog"
            align="center"
          />
        </div>
      </div>

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
                  {/* Featured image or gradient placeholder */}
                  <div className={`relative w-full bg-gradient-to-br from-surface-2 to-[var(--color-accent)]/5 overflow-hidden ${index === 0 ? "h-64 sm:h-80" : "h-48"}`}>
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl sm:text-8xl font-display font-bold text-[var(--color-accent)]/10 select-none">
                          {post.category?.substring(0, 2).toUpperCase() || "MK"}
                        </span>
                      </div>
                    )}
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                        <Tag size={10} />
                        {post.category || "Engineering"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
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

                    <h2 className={`font-display font-bold text-text-primary group-hover:text-[var(--color-accent)] transition-colors mb-3 leading-snug break-words ${index === 0 ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
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
                          <p className="text-xs font-medium text-text-primary">{post.author?.name || "MARK Team"}</p>
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
