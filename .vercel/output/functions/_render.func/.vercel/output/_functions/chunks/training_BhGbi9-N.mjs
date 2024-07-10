/* empty css                          */
import { m as createComponent, n as renderTemplate, u as renderSlot, v as renderHead, p as addAttribute, q as createAstro, t as renderComponent } from './astro/server_-EfFORJD.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                            */
import { $ as $$Sidebar } from './Sidebar_FAI3zIqt.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', "><title>", "</title>", "</head> <body> ", ' <script src="./assets/vendor/preline/preline.js"><\/script> </body></html>'])), addAttribute(Astro2.generator, "content"), title, renderHead(), renderSlot($$result, $$slots["default"]));
}, "/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/layouts/Layout.astro", void 0);

const $$Training = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Training" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Sidebar", $$Sidebar, {})} ` })}`;
}, "/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/pages/training.astro", void 0);

const $$file = "/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/pages/training.astro";
const $$url = "/training";

export { $$Training as default, $$file as file, $$url as url };
