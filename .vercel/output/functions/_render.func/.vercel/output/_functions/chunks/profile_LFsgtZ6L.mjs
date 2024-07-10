/* empty css                          */
import { m as createComponent, q as createAstro } from './astro/server_-EfFORJD.mjs';
import 'kleur/colors';
import 'clsx';
import { g as getUser } from './supabase_BcnSAA6H.mjs';

const $$Astro = createAstro();
const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Profile;
  const user = await getUser();
  if (!user) {
    return Astro2.redirect("/login");
  }
  return Astro2.redirect("/?openSettings=true");
}, "/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/pages/profile.astro", void 0);

const $$file = "/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/pages/profile.astro";
const $$url = "/profile";

export { $$Profile as default, $$file as file, $$url as url };
