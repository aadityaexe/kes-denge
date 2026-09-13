import * as fs from 'fs';
import * as https from 'https';
import { XMLParser } from 'fast-xml-parser';
import * as cheerio from 'cheerio';

const SITEMAP_URL = 'https://www.mark2.in/sitemap.xml';

async function fetchUrl(url: string): Promise<{ status: number; html: string; headers: any }> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode || 0, html: data, headers: res.headers });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log('Fetching sitemap...');
  try {
    const { status: sitemapStatus, html: sitemapXml } = await fetchUrl(SITEMAP_URL);
    if (sitemapStatus !== 200) {
      console.error(`Sitemap returned status ${sitemapStatus}`);
      return;
    }

    const parser = new XMLParser();
    const sitemapObj = parser.parse(sitemapXml);
    const urls = sitemapObj.urlset.url.map((u: any) => u.loc);
    
    console.log(`Found ${urls.length} URLs in sitemap.`);
    
    // Add some 404 test URLs
    urls.push('https://www.mark2.in/random-invalid-url');
    urls.push('https://www.mark2.in/non-existing-service');
    
    const results = [];
    
    for (const url of urls) {
      console.log(`Auditing: ${url}`);
      try {
        const { status, html } = await fetchUrl(url);
        
        const $ = cheerio.load(html);
        const title = $('title').text();
        const description = $('meta[name="description"]').attr('content');
        const canonical = $('link[rel="canonical"]').attr('href');
        const h1s = $('h1').map((_, el) => $(el).text()).get();
        
        // Extract JSON-LD schemas
        const schemas: any[] = [];
        $('script[type="application/ld+json"]').each((_, el) => {
          try {
            schemas.push(JSON.parse($(el).html() || '{}'));
          } catch (e) {}
        });

        // Check for Kas Denge
        const hasKasDenge = html.toLowerCase().includes('kas denge');

        results.push({
          url,
          status,
          title: title || 'MISSING',
          description: description || 'MISSING',
          canonical: canonical || 'MISSING',
          h1Count: h1s.length,
          h1First: h1s[0] || 'MISSING',
          schemasCount: schemas.length,
          hasKasDenge
        });
      } catch (err: any) {
        console.error(`Error fetching ${url}: ${err.message}`);
        results.push({ url, status: 0, error: err.message });
      }
      
      // Delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    fs.writeFileSync('audit_results.json', JSON.stringify(results, null, 2));
    console.log('Audit complete. Results saved to audit_results.json');
    
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
