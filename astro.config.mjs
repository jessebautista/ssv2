import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  output: 'server',
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
