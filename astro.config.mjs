import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    adapter: vercel({
      functionPerRoute: false,
      runtime: 'nodejs18.x', // Specify the Node.js version
    }),
  }),
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
