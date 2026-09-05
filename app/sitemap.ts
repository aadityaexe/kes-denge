import { MetadataRoute } from 'next';
import { getPortfolioData, getTeamData, getProductsData, getServicesData } from '@/lib/db-helpers';
import type { PortfolioItem, TeamMember, Product, Service } from '@/lib/types';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mark.com';

  // Core static routes
  const routes = [
    '',
    '/about',
    '/services',
    '/products',
    '/portfolio',
    '/pricing',
    '/team',
    '/contact',
  ].map((route: string) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  let portfolioUrls: MetadataRoute.Sitemap = [];
  let teamUrls: MetadataRoute.Sitemap = [];
  let productUrls: MetadataRoute.Sitemap = [];
  let serviceUrls: MetadataRoute.Sitemap = [];

  try {
    const [portfolioItems, teamMembers, products, services] = await Promise.all([
      getPortfolioData(),
      getTeamData(),
      getProductsData(),
      getServicesData(),
    ]);

    portfolioUrls = (portfolioItems || []).map((item: PortfolioItem) => ({
      url: `${baseUrl}/portfolio/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    teamUrls = (teamMembers || []).map((member: TeamMember) => ({
      url: `${baseUrl}/team/${member.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    productUrls = (products || []).map((product: Product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    serviceUrls = (services || []).map((service: Service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Failed to generate dynamic sitemap URLs during build:", err);
  }

  return [...routes, ...portfolioUrls, ...teamUrls, ...productUrls, ...serviceUrls];
}
