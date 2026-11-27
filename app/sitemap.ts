import { MetadataRoute } from 'next';
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mark2.in';

  // Core static routes with calibrated priorities
  const staticRoutes: MetadataRoute.Sitemap = ([
    { url: baseUrl },
    { url: `${baseUrl}/services` },
    { url: `${baseUrl}/portfolio` },
    { url: `${baseUrl}/contact` },
    { url: `${baseUrl}/pricing` },
    { url: `${baseUrl}/products` },
    { url: `${baseUrl}/about` },
    { url: `${baseUrl}/clients` },
    { url: `${baseUrl}/blog` },
    { url: `${baseUrl}/careers` },
    { url: `${baseUrl}/team` },
    { url: `${baseUrl}/privacy` },
    { url: `${baseUrl}/terms` },
  ] as const).map((r): MetadataRoute.Sitemap[number] => ({ ...r, lastModified: new Date() }));


  let portfolioUrls: MetadataRoute.Sitemap = [];
  let teamUrls: MetadataRoute.Sitemap = [];
  let productUrls: MetadataRoute.Sitemap = [];
  let serviceUrls: MetadataRoute.Sitemap = [];
  let clientUrls: MetadataRoute.Sitemap = [];
  let blogUrls: MetadataRoute.Sitemap = [];
  let jobUrls: MetadataRoute.Sitemap = [];

  try {
    const [portfolioItems, teamMembers, products, services, clients, blogPosts, jobs] = await Promise.all([
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
      lastModified: item.updatedAt ? new Date(item.updatedAt) : (item.createdAt ? new Date(item.createdAt) : new Date()),
    }));

    teamUrls = (teamMembers || []).map((member: TeamMember) => ({
      url: `${baseUrl}/team/${member.slug}`,
      lastModified: member.updatedAt ? new Date(member.updatedAt) : (member.createdAt ? new Date(member.createdAt) : new Date()),
    }));

    productUrls = (products || []).map((product: Product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : (product.createdAt ? new Date(product.createdAt) : new Date()),
    }));

    serviceUrls = (services || []).map((service: Service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: service.updatedAt ? new Date(service.updatedAt) : (service.createdAt ? new Date(service.createdAt) : new Date()),
    }));

    clientUrls = (clients || [])
      .filter((client: Client) => client.description || client.aboutPartnership || client.caseStudySlug)
      .map((client: Client) => ({
        url: `${baseUrl}/clients/${client.slug}`,
        lastModified: client.updatedAt ? new Date(client.updatedAt) : (client.createdAt ? new Date(client.createdAt) : new Date()),
    }));

    blogUrls = (blogPosts || []).map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : (post.createdAt ? new Date(post.createdAt) : new Date()),
    }));

    jobUrls = (jobs || []).map((job: Job) => ({
      url: `${baseUrl}/careers/${job.slug}`,
      lastModified: job.updatedAt ? new Date(job.updatedAt) : (job.createdAt ? new Date(job.createdAt) : new Date()),
    }));
  } catch (err) {
    console.error("Failed to generate dynamic sitemap URLs during build:", err);
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
