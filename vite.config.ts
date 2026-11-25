import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { head, llmsTxt, prerender, sitemap } from './src/seo';

/** Injects SEO head + crawler-readable HTML, and emits llms.txt / sitemap.xml. All built from src/data.ts. */
function seo(): Plugin {
  return {
    name: 'portfolio-seo',
    transformIndexHtml(html) {
      return html
        .replace('<!-- seo:head -->', head())
        .replace('<div id="root"></div>', `<div id="root">${prerender()}</div>`);
    },
    // Dev server: serve the generated files too.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/llms.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          return res.end(llmsTxt());
        }
        if (req.url === '/sitemap.xml') {
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          return res.end(sitemap());
        }
        next();
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt() });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap() });
    },
  };
}

export default defineConfig({ plugins: [react(), seo()] });
