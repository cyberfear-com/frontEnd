import { SitemapStream } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';

// Define your routes here
const routes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/company', changefreq: 'monthly', priority: 0.8 },
  { url: '/pricing', changefreq: 'monthly', priority: 0.8 },
  { url: '/faq', changefreq: 'monthly', priority: 0.8 },
  { url: '/mailbox/#login', changefreq: 'monthly', priority: 0.8 },
  { url: '/mailbox/#signup', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact-us', changefreq: 'monthly', priority: 0.5 },
  { url: '/privacy', changefreq: 'monthly', priority: 0.2 },
  { url: '/terms', changefreq: 'monthly', priority: 0.2 },
  // Add more routes as needed
];

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: 'https://mailum.com' });
  const writeStream = createWriteStream(resolve('dist/sitemap.xml'));

  routes.forEach(route => sitemap.write(route));

  // Add a reference to the blog sitemap
  sitemap.write({ url: 'https://mailum.com/blog/post-sitemap.xml', changefreq: 'weekly', priority: 0.8 });

  sitemap.end();

  const finished = new Promise((resolve, reject) => {
    sitemap.pipe(writeStream)
      .on('finish', resolve)
      .on('error', reject);
  });

  await finished;

  console.log('Sitemap generated!');
}

generateSitemap().catch(console.error);