/* empty css                          */
import { m as createComponent, n as renderTemplate, t as renderComponent, q as createAstro, o as maybeRenderHead } from './astro/server_-EfFORJD.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from './MainLayout_BIJcYxJi.mjs';
import { b as signUp } from './supabase_BcnSAA6H.mjs';

const $$Astro = createAstro();
const $$Signup = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Signup;
  let error = null;
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const firstName = formData.get("first_name");
    const lastName = formData.get("last_name");
    try {
      console.log("Attempting to sign up with:", { email, firstName, lastName });
      const result = await signUp(email, password, firstName, lastName);
      console.log("Signup result:", result);
      if (result.user) {
        return Astro2.redirect("/");
      } else {
        error = "Failed to create user and profile";
      }
    } catch (err) {
      console.error("Error during signup:", err);
      error = err.message || "An unexpected error occurred";
    }
  }
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Sign Up" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-md mx-auto mt-8"> <h1 class="text-2xl font-bold mb-4">Sign Up</h1> ${error && renderTemplate`<p class="text-red-500 mb-4">${error}</p>`} <form method="POST" class="space-y-4"> <div> <label for="email" class="block text-sm font-medium text-gray-700">Email</label> <input type="email" id="email" name="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"> </div> <div> <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label> <input type="text" id="first_name" name="first_name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"> </div> <div> <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label> <input type="text" id="last_name" name="last_name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"> </div> <div> <label for="password" class="block text-sm font-medium text-gray-700">Password</label> <input type="password" id="password" name="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"> </div> <button type="submit" class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
Sign Up
</button> </form> <p class="mt-4 text-center text-sm text-gray-600">
Already have an account? <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Login</a> </p> </div> ` })}`;
}, "/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/pages/signup.astro", void 0);

const $$file = "/Users/jesseemmanuelbautista/Desktop/swellsurge/zapping-zero/src/pages/signup.astro";
const $$url = "/signup";

export { $$Signup as default, $$file as file, $$url as url };
