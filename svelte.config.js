import adapter from "@sveltejs/adapter-static";
import adapterAuto from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// Get environment variable, default to 'development'
const environment = process.env.NODE_ENV || "development";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    // Choose adapter based on environment
    adapter:
      environment === "production"
        ? adapter({
            pages: "build",
            assets: "build",
            fallback: "index.html",
            precompress: false,
            strict: true,
          })
        : adapterAuto(),

    // Base path configuration
    paths: {
      base: environment === "production" ? "" : "",
    },
  },
};

export default config;
