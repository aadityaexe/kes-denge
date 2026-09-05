import { MetadataRoute } from 'next';
import {
  getPortfolioData,
  getTeamData,
  getProductsData,
  getServicesData,
  getClientsData,
} from '@/lib/db-helpers';
import type { PortfolioItem, TeamMember, Product, Service, Client } from '@/lib/types';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mark2.in';

  // Core static routes
  const routes = [
    '',
    '/about',
    '/services',
    '/products',
    '/portfolio',
    '/clients',
    '/team',
    '/pricing',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route: string) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route === '/privacy' || route === '/terms' ? 0.3 : 0.8,
  }));

  let portfolioUrls: MetadataRoute.Sitemap = [];
  let teamUrls: MetadataRoute.Sitemap = [];
  let productUrls: MetadataRoute.Sitemap = [];
  let serviceUrls: MetadataRoute.Sitemap = [];
  let clientUrls: MetadataRoute.Sitemap = [];

  try {
    const [portfolioItems, teamMembers, products, services, clients] = await Promise.all([
      getPortfolioData(),
      getTeamData(),
      getProductsData(),
      getServicesData(),
      getClientsData(),
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
  } catch (err) {
    console.error("Failed to generate dynamic sitemap URLs during build:", err);
  }

  return [
    ...routes,
    ...portfolioUrls,
    ...teamUrls,
    ...productUrls,
    ...serviceUrls,
    ...clientUrls,
  ];
}
