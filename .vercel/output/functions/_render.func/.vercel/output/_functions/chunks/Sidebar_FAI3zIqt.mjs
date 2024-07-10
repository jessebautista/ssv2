import { m as createComponent, n as renderTemplate, o as maybeRenderHead, p as addAttribute } from './astro/server_-EfFORJD.mjs';
import 'kleur/colors';
import 'clsx';
import { s as supabase } from './supabase_BcnSAA6H.mjs';

const $$Sidebar = createComponent(async ($$result, $$props, $$slots) => {
  let courses = [];
  let dailyQuests = [];
  try {
    const [coursesResponse, questsResponse] = await Promise.all([
      supabase.from("courses").select("*").order("order"),
      supabase.from("daily_quests").select("*").order("order")
    ]);
    if (coursesResponse.error) throw coursesResponse.error;
    if (questsResponse.error) throw questsResponse.error;
    courses = coursesResponse.data || [];
    dailyQuests = questsResponse.data || [];
  } catch (e) {
    console.error("Error fetching data:", e);
  }
  return renderTemplate`${maybeRenderHead()}<aside class="w-64 bg-white border-r border-gray-200 transition-all duration-300" id="sidebar"> <div class="p-4"> <button class="flex items-center justify-between w-full text-lg font-semibold" id="sidebar-toggle" aria-expanded="true" aria-controls="sidebar-content"> <span id="sidebar-title" class="transition-opacity duration-200">Course Content</span> <svg class="w-5 h-5 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" id="sidebar-icon"> <path fill-rule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path> </svg> </button> <nav class="mt-4 overflow-hidden transition-all duration-300" id="sidebar-content"> <ul class="space-y-2" id="sidebar-list"> ${courses.map((course) => renderTemplate`<li> <a href="#"${addAttribute(course.slug, "data-slug")} data-type="course" class="content-link block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"> ${course.title} </a> </li>`)} </ul> </nav> </div> </aside> `;
}, "/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/components/Sidebar.astro", void 0);

export { $$Sidebar as $ };
