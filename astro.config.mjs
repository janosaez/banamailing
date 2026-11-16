import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://banamailing.com',
  output: 'static',
  adapter: vercel(),
  build: {
    // Inlinea todo el CSS en <style> — elimina los 2 requests CSS que bloquean el renderizado
    inlineStylesheets: 'always',
  },
});
