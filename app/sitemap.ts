import { MetadataRoute } from 'next';
import { getPortfolioData, getTeamData, getProductsData, getServicesData } from '@/lib/db-helpers';
import type { PortfolioItem, TeamMember, Product, Service } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kasdenge.com';

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

  // Dynamic portfolio routes
  const portfolioItems = await getPortfolioData();
  const portfolioUrls = portfolioItems.map((item: PortfolioItem) => ({
    url: `${baseUrl}/portfolio/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic team routes
  const teamMembers = await getTeamData();
  const teamUrls = teamMembers.map((member: TeamMember) => ({
    url: `${baseUrl}/team/${member.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Dynamic product routes
  const products = await getProductsData();
  const productUrls = products.map((product: Product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic service routes
  const services = await getServicesData();
  const serviceUrls = services.map((service: Service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...portfolioUrls, ...teamUrls, ...productUrls, ...serviceUrls];
}
