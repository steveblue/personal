const SitemapGenerator = require('advanced-sitemap-generator');
const { join } = require('path');
// create generator
const generator = SitemapGenerator('https://stephenbelovarich.com', {
  stripQuerystring: true,
  ignoreHreflang: true,
  filepath: join(process.cwd(), 'src', 'client', 'sitemap.xml'),
});

// register event listeners
generator.on('done', () => {
  console.log('generator done');
});

// start the crawler
generator.start();