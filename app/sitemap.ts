import { MetadataRoute } from 'next';
import { SEO_CONFIG } from '@/lib/seo';
import {
  getPortfolioData,
  getTeamData,
  getProductsData,
  getServicesData,
  getClientsData,
  getBlogsData,
  getJobsData,
} from '@/lib/db-helpers';
import type { PortfolioItem, TeamMember, Product, Service, Client, Job } from '@/lib/types';

export const revalidate = 3600;

const STATIC_LAST_MODIFIED = new Date('2026-11-28T00:00:00.000Z');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SEO_CONFIG.siteUrl;

  // Core static routes with calibrated priorities and change frequencies
  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },
      { url: `${baseUrl}/services`, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${baseUrl}/portfolio`, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/pricing`, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/products`, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${baseUrl}/blog`, changeFrequency: 'daily', priority: 0.8 },
      { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/careers`, changeFrequency: 'weekly', priority: 0.7 },
      { url: `${baseUrl}/clients`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${baseUrl}/team`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
      { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    ] as const
  ).map((r): MetadataRoute.Sitemap[number] => ({ ...r, lastModified: STATIC_LAST_MODIFIED }));

  let portfolioUrls: MetadataRoute.Sitemap = [];
  let teamUrls: MetadataRoute.Sitemap = [];
  let productUrls: MetadataRoute.Sitemap = [];
  let serviceUrls: MetadataRoute.Sitemap = [];
  let clientUrls: MetadataRoute.Sitemap = [];
  let blogUrls: MetadataRoute.Sitemap = [];
  let jobUrls: MetadataRoute.Sitemap = [];

  try {
    const [portfolioItems, teamMembers, products, services, clients, blogPosts, jobs] =
      await Promise.all([
        getPortfolioData(),
        getTeamData(),
        getProductsData(),
        getServicesData(),
        getClientsData(),
        getBlogsData(),
        getJobsData(),
      ]);

    portfolioUrls = (portfolioItems || []).map((item: PortfolioItem) => ({
      url: `${baseUrl}/portfolio/${item.slug}`,
      lastModified: item.updatedAt
        ? new Date(item.updatedAt)
        : item.createdAt
          ? new Date(item.createdAt)
          : new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

    teamUrls = (teamMembers || []).map((member: TeamMember) => ({
      url: `${baseUrl}/team/${member.slug}`,
      lastModified: member.updatedAt
        ? new Date(member.updatedAt)
        : member.createdAt
          ? new Date(member.createdAt)
          : new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    }));

    productUrls = (products || []).map((product: Product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : product.createdAt
          ? new Date(product.createdAt)
          : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    serviceUrls = (services || []).map((service: Service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: service.updatedAt
        ? new Date(service.updatedAt)
        : service.createdAt
          ? new Date(service.createdAt)
          : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    clientUrls = (clients || [])
      .filter((client: Client) => client.description || client.aboutPartnership || client.caseStudySlug)
      .map((client: Client) => ({
        url: `${baseUrl}/clients/${client.slug}`,
        lastModified: client.updatedAt
          ? new Date(client.updatedAt)
          : client.createdAt
            ? new Date(client.createdAt)
            : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));

    blogUrls = (blogPosts || []).map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt
        ? new Date(post.updatedAt)
        : post.createdAt
          ? new Date(post.createdAt)
          : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    jobUrls = (jobs || []).map((job: Job) => ({
      url: `${baseUrl}/careers/${job.slug}`,
      lastModified: job.updatedAt
        ? new Date(job.updatedAt)
        : job.createdAt
          ? new Date(job.createdAt)
          : new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch (err) {
    console.error('Failed to generate dynamic sitemap URLs during build:', err);
  }

  return [
    ...staticRoutes,
    ...portfolioUrls,
    ...teamUrls,
    ...productUrls,
    ...serviceUrls,
    ...clientUrls,
    ...blogUrls,
    ...jobUrls,
  ];
}
