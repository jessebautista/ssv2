/* empty css                          */
import { m as createComponent, n as renderTemplate, o as maybeRenderHead, w as unescapeHTML, q as createAstro, t as renderComponent } from './astro/server_-EfFORJD.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from './MainLayout_BIJcYxJi.mjs';
import 'clsx';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
/* empty css                         */
import { g as getUser, s as supabase } from './supabase_BcnSAA6H.mjs';

const $$Astro = createAstro();
const $$MarkdownRenderer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MarkdownRenderer;
  const { content } = Astro2.props;
  marked.setOptions({
    gfm: true,
    breaks: true,
    headerIds: false
  });
  const decodedContent = content.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  const rawHtml = marked.parse(decodedContent);
  const sanitizedHtml = DOMPurify.sanitize(rawHtml);
  return renderTemplate`${maybeRenderHead()}<div class="markdown-content" data-astro-cid-ioosybgm>${unescapeHTML(sanitizedHtml)}</div> `;
}, "/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/components/MarkdownRenderer.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  await getUser();
  const { data: courseContent, error } = await supabase.from("courses").select("content").single();
  if (error) {
    console.error("Error fetching course content:", error);
  }
  const content = courseContent?.content || "No content available.";
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Welcome to Swell Surge" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Welcome to Swell Surge</h1> <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"> <h2 class="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Course Content</h2> ${renderComponent($$result2, "MarkdownRenderer", $$MarkdownRenderer, { "content": content })} </div>  ` })}`;
}, "/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/pages/index.astro", void 0);

const $$file = "/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
