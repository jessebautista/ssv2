import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    functionPerRoute: false,
    runtime: 'nodejs18.x', // This matches your Vercel setting
  }),
  vite: {
    ssr: {
      noExternal: ['@supabase/supabase-js', 'swell-js'],
    },
    build: {
      rollupOptions: {
        external: ['swell-js'],
      },
    },
  },
  integrations: [tailwind(), mdx()],
  markdown: {
    shikiConfig: {
      theme: 'dracula',
      wrap: true,
    },
  },
  content: {
    sources: ['./content']
  },
});
