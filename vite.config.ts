import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveDir(candidates: string[]): string | null {
  for (const c of candidates) {
    const full = path.resolve(__dirname, c);
    if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
      return full;
    }
  }
  return null;
}

function mediaAliasPlugin(): Plugin {
  return {
    name: 'media-alias-plugin',
    configureServer(server) {
      const imgDir = resolveDir(['public image', 'Public image', 'images']);
      const vidDir = resolveDir(['public video', 'Public video', 'videos']);

      if (imgDir) {
        const handler = express.static(imgDir);
        server.middlewares.use('/images', handler);
        server.middlewares.use('/image', handler);
        server.middlewares.use('/public image', handler);
        server.middlewares.use('/Public image', handler);
      }

      if (vidDir) {
        const handler = express.static(vidDir);
        server.middlewares.use('/videos', handler);
        server.middlewares.use('/video', handler);
        server.middlewares.use('/public video', handler);
        server.middlewares.use('/Public video', handler);
      }

      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url === '/robots.txt') {
          const p = path.resolve(__dirname, 'robots.txt');
          if (fs.existsSync(p)) {
            res.setHeader('Content-Type', 'text/plain');
            return fs.createReadStream(p).pipe(res);
          }
        }
        if (url === '/sitemap.xml') {
          const p = path.resolve(__dirname, 'sitemap.xml');
          if (fs.existsSync(p)) {
            res.setHeader('Content-Type', 'application/xml');
            return fs.createReadStream(p).pipe(res);
          }
        }
        if (url === '/project.zip' || url === '/download-zip' || url === '/texas-teazed.zip') {
          const zipPath = '/tmp/texas-teazed-complete.zip';
          if (fs.existsSync(zipPath)) {
            const stat = fs.statSync(zipPath);
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', 'attachment; filename="texas-teazed-code-complete.zip"');
            res.setHeader('Content-Length', stat.size);
            return fs.createReadStream(zipPath).pipe(res);
          }
        }
        if (url === '/TEXAS_TEAZED_CRM_COMPLETE_CODE.pdf' || url === '/crm-code.pdf') {
          const pdfPath = path.resolve(__dirname, 'public/TEXAS_TEAZED_CRM_COMPLETE_CODE.pdf');
          if (fs.existsSync(pdfPath)) {
            const stat = fs.statSync(pdfPath);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="TEXAS_TEAZED_CRM_COMPLETE_CODE.pdf"');
            res.setHeader('Content-Length', stat.size);
            return fs.createReadStream(pdfPath).pipe(res);
          }
        }
        if (url === '/CRM_SOURCE_CODE.html' || url === '/crm-code.html') {
          const htmlPath = path.resolve(__dirname, 'public/CRM_SOURCE_CODE.html');
          if (fs.existsSync(htmlPath)) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return fs.createReadStream(htmlPath).pipe(res);
          }
        }
        next();
      });
    },
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) return;

      const imgDir = resolveDir(['public image', 'Public image', 'images']);
      const vidDir = resolveDir(['public video', 'Public video', 'videos']);

      function copyDir(srcDir: string, destDirs: string[]) {
        for (const dest of destDirs) {
          fs.mkdirSync(dest, { recursive: true });
        }
        const files = fs.readdirSync(srcDir);
        for (const file of files) {
          const srcFile = path.join(srcDir, file);
          if (fs.statSync(srcFile).isFile()) {
            for (const dest of destDirs) {
              fs.copyFileSync(srcFile, path.join(dest, file));
            }
          }
        }
      }

      if (imgDir) {
        copyDir(imgDir, [path.join(distDir, 'images')]);
      }

      if (vidDir) {
        copyDir(vidDir, [path.join(distDir, 'videos')]);
      }

      // Copy robots.txt and sitemap.xml to dist
      const robotsSrc = path.resolve(__dirname, 'robots.txt');
      if (fs.existsSync(robotsSrc)) {
        fs.copyFileSync(robotsSrc, path.join(distDir, 'robots.txt'));
      }
      const sitemapSrc = path.resolve(__dirname, 'sitemap.xml');
      if (fs.existsSync(sitemapSrc)) {
        fs.copyFileSync(sitemapSrc, path.join(distDir, 'sitemap.xml'));
      }

      // Copy CRM PDF and HTML to dist
      const pdfSrc = path.resolve(__dirname, 'public/TEXAS_TEAZED_CRM_COMPLETE_CODE.pdf');
      if (fs.existsSync(pdfSrc)) {
        fs.copyFileSync(pdfSrc, path.join(distDir, 'TEXAS_TEAZED_CRM_COMPLETE_CODE.pdf'));
      }
      const htmlSrc = path.resolve(__dirname, 'public/CRM_SOURCE_CODE.html');
      if (fs.existsSync(htmlSrc)) {
        fs.copyFileSync(htmlSrc, path.join(distDir, 'CRM_SOURCE_CODE.html'));
      }

      // Netlify _redirects
      const redirectsContent = `# Netlify redirects for clean SPA & media aliases
/videos/Toners*     /videos/toners-and-refreshers.mp4 200
/image/*            /images/:splat          200
/video/*            /videos/:splat          200
/public%20image/*   /images/:splat          200
/public%20video/*   /videos/:splat          200
/*                  /index.html             200
`;
      fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent);

      // Netlify _headers
      const headersContent = `/images/*
  Cache-Control: public, max-age=31536000, immutable
/videos/*
  Cache-Control: public, max-age=31536000, immutable
`;
      fs.writeFileSync(path.join(distDir, '_headers'), headersContent);
    },
  };
}

export default defineConfig(() => {
  return {
    publicDir: false as const,
    plugins: [react(), tailwindcss(), mediaAliasPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
