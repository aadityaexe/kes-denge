import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBlogsData, getBlogBySlug } from "@/lib/db-helpers";
import { Parallax } from "@/components/ui/Parallax";
import { ArrowLeft, ArrowRight, Clock, Tag, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.mark2.in";

export async function generateStaticParams() {
  const blogs = await getBlogsData();
  return (blogs || []).map((post: any) => ({ slug: post.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return { title: "Article Not Found | MARK Technologies" };
  }

  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const metaTitle = post.metaTitle || `${post.title} | MARK Technologies`;
  const metaDescription = post.metaDescription || post.excerpt;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: "MARK Technologies",
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: post.featuredImage || `${siteUrl}/opengraph-image`, width: 1200, height: 630, alt: metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [post.featuredImage || `${siteUrl}/twitter-image`],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) notFound();

  const allBlogs = await getBlogsData();
  const related = (allBlogs || [])
    .filter((b: any) => b.slug !== slug && b.category === post.category)
    .slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author?.name || "MARK Team",
    },
    publisher: {
      "@type": "Organization",
      name: "MARK Technologies",
      url: siteUrl,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: `${siteUrl}/blog/${post.slug}`,
    image: post.featuredImage || `${siteUrl}/opengraph-image`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-base">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <div className="pt-24 sm:pt-28 md:pt-32 pb-10 relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <Parallax speed={0.6} className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-b from-[var(--color-accent)]/8 to-transparent blur-[140px]" />
        </div>
        <div className="container-site relative z-10 max-w-4xl">
          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-8 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Blog
          </Link>

          {/* Category + Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] text-xs font-semibold">
              <Tag size={11} />
              {post.category || "Engineering"}
            </span>
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Clock size={11} />
              {post.readTime || "5 min read"}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Calendar size={11} />
                {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-text-primary leading-tight tracking-tight mb-6 break-words">
            {post.title}
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary leading-relaxed font-light mb-8 break-words">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 pt-6 border-t border-[var(--color-border)]">
            <div className="w-10 h-10 rounded-full bg-surface-2 border border-[var(--color-border)] flex items-center justify-center text-sm font-bold text-[var(--color-accent)] uppercase">
              {post.author?.name?.substring(0, 2) || "MK"}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">{post.author?.name || "MARK Team"}</p>
              <p className="text-xs text-text-muted">{post.author?.role || "Engineer, MARK Technologies"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="container-site max-w-4xl py-8">
          <div className="relative w-full aspect-[16/9] max-h-[500px] rounded-2xl overflow-hidden border border-[var(--color-border)]">
            <Image
              src={post.featuredImage}
              alt={`Featured visual for ${post.title}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <article className="container-site max-w-4xl py-8 sm:py-12">
      <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="container-site max-w-4xl pb-8">
          <div className="flex flex-wrap gap-2 pt-6 border-t border-[var(--color-border)]">
            {post.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-surface-2 border border-[var(--color-border)] text-xs text-text-secondary">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="section-padding border-t border-[var(--color-border)] bg-surface-2/20">
          <div className="container-site">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">More Articles</h2>
              <Link href="/blog" className="text-sm font-semibold text-[var(--color-accent-dark)] hover:underline flex items-center gap-1">
                View all <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((relPost: any) => (
                <Link
                  key={relPost.slug}
                  href={`/blog/${relPost.slug}`}
                  className="group bg-surface-1 border border-[var(--color-border)] rounded-2xl p-6 hover:border-[var(--color-accent)]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-400 flex flex-col"
                >
                  <span className="text-xs text-[var(--color-accent-dark)] font-semibold mb-2">{relPost.category}</span>
                  <h3 className="text-lg font-display font-bold text-text-primary group-hover:text-[var(--color-accent)] transition-colors mb-2 break-words leading-snug">
                    {relPost.title}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-2 mt-auto break-words">{relPost.excerpt}</p>
                  <div className="mt-4 pt-3 border-t border-[var(--color-border)]/60 text-xs font-semibold text-[var(--color-accent-dark)] flex items-center gap-1">
                    Read Article <ArrowRight size={11} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-site py-12 sm:py-16">
        <div className="rounded-2xl bg-text-primary text-surface-1 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent-light)] mb-3">Work With Us</p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">Have a project in mind?</h2>
            <p className="text-surface-2 text-sm sm:text-base mb-6 font-light max-w-lg mx-auto">
              Whether it is a website, ERP system, or a full-stack platform — let us have a technical scoping conversation.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--color-accent)] text-surface-1 font-semibold text-sm hover:bg-[var(--color-accent-light)] transition-colors"
            >
              Start a Project <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
