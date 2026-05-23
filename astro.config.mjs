import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  build: {
    // Inlinea todo el CSS en <style> — elimina los 2 requests CSS que bloquean el renderizado
    inlineStylesheets: 'always',
  },
});
