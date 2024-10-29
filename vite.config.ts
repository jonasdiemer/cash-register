import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],

  logLevel: "info",
  clearScreen: false,
  // Add this to help resolve the node-conditions issue
  resolve: {
    conditions: ["browser"],
  },
});
