import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mark2.in';

  return {
    rules: [
      // Search engines: full crawl access to all public pages
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'YandexBot', 'Sogou', 'Exabot'],
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // AI training crawlers: disallow all crawling
      // (they consume crawl budget without contributing to search rankings)
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'PerplexityBot',
          'ClaudeBot',
          'Claude-Web',
          'Google-Extended',
          'anthropic-ai',
          'Diffbot',
          'Omgilibot',
          'FacebookBot',
          'facebookexternalhit',
          'CCBot',
          'DataForSeoBot',
          'PetalBot',
        ],
        disallow: '/',
      },
      // Default: allow public, block admin and API
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
