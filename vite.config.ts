import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],

  // Add this section for better logging
  logLevel: "info",
  clearScreen: false,
});
