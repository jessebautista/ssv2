import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  vite: {
    ssr: {
      noExternal: ['@supabase/supabase-js', 'swell-js'],
    },
  },
  integrations: [tailwind(), mdx(), preact()],
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
