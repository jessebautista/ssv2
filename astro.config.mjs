import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  vite: {
    ssr: {
      noExternal: ['@supabase/supabase-js', 'swell-js'],
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
