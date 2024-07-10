/* empty css                          */
import { m as createComponent, n as renderTemplate, t as renderComponent, q as createAstro, o as maybeRenderHead } from './astro/server_-EfFORJD.mjs';
import 'kleur/colors';
import { s as supabase } from './supabase_BcnSAA6H.mjs';
import { $ as $$MainLayout } from './MainLayout_BIJcYxJi.mjs';

const $$Astro = createAstro();
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { slug } = Astro2.params;
  let course = null;
  try {
    const { data, error: fetchError } = await supabase.from("courses").select("*").eq("slug", slug).single();
    if (fetchError) throw fetchError;
    course = data;
  } catch (e) {
    console.error("Error fetching course:", e);
  }
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": course ? course.title : "Course Not Found" }, { "default": ($$result2) => renderTemplate`${course ? renderTemplate`${maybeRenderHead()}<div class="max-w-3xl mx-auto py-8"> <h1 class="text-3xl font-bold mb-4">${course.title}</h1> <div class="prose max-w-none"> ${course.content} </div> </div>` : renderTemplate`<div class="max-w-3xl mx-auto py-8"> <h1 class="text-3xl font-bold mb-4">Course Not Found</h1> <p>Sorry, the requested course could not be found.</p> </div>`}` })}`;
}, "/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/pages/courses/[...slug].astro", void 0);

const $$file = "/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/pages/courses/[...slug].astro";
const $$url = "/courses/[...slug]";

export { $$ as default, $$file as file, $$url as url };
