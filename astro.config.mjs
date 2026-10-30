import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://waveworkscorp.github.io',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
