import { MetadataRoute } from 'next';
import {
  getPortfolioData,
  getTeamData,
  getProductsData,
  getServicesData,
  getClientsData,
  getBlogsData,
} from '@/lib/db-helpers';
import type { PortfolioItem, TeamMember, Product, Service, Client } from '@/lib/types';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mark2.in';

  // Core static routes with calibrated priorities
  const staticRoutes: MetadataRoute.Sitemap = ([
    { url: baseUrl,                     changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/services`,       changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/portfolio`,      changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/contact`,        changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/pricing`,        changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/products`,       changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${baseUrl}/about`,          changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/clients`,        changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`,           changeFrequency: 'daily',   priority: 0.8 },
    { url: `${baseUrl}/team`,           changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`,        changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${baseUrl}/terms`,          changeFrequency: 'yearly',  priority: 0.2 },
  ] as const).map((r): MetadataRoute.Sitemap[number] => ({ ...r, lastModified: new Date() }));


  let portfolioUrls: MetadataRoute.Sitemap = [];
  let teamUrls: MetadataRoute.Sitemap = [];
  let productUrls: MetadataRoute.Sitemap = [];
  let serviceUrls: MetadataRoute.Sitemap = [];
  let clientUrls: MetadataRoute.Sitemap = [];
  let blogUrls: MetadataRoute.Sitemap = [];

  try {
    const [portfolioItems, teamMembers, products, services, clients, blogPosts] = await Promise.all([
      getPortfolioData(),
      getTeamData(),
      getProductsData(),
      getServicesData(),
      getClientsData(),
      getBlogsData(),
    ]);

    portfolioUrls = (portfolioItems || []).map((item: PortfolioItem) => ({
      url: `${baseUrl}/portfolio/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : (item.createdAt ? new Date(item.createdAt) : new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    teamUrls = (teamMembers || []).map((member: TeamMember) => ({
      url: `${baseUrl}/team/${member.slug}`,
      lastModified: member.updatedAt ? new Date(member.updatedAt) : (member.createdAt ? new Date(member.createdAt) : new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    productUrls = (products || []).map((product: Product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : (product.createdAt ? new Date(product.createdAt) : new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    serviceUrls = (services || []).map((service: Service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: service.updatedAt ? new Date(service.updatedAt) : (service.createdAt ? new Date(service.createdAt) : new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    clientUrls = (clients || []).map((client: Client) => ({
      url: `${baseUrl}/clients/${client.slug}`,
      lastModified: client.updatedAt ? new Date(client.updatedAt) : (client.createdAt ? new Date(client.createdAt) : new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    blogUrls = (blogPosts || []).map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : (post.createdAt ? new Date(post.createdAt) : new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
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
  ];
}
