// cash-register/src/lib/i18n/index.ts
import { addMessages, init, locale, waitLocale } from "svelte-i18n";
import { browser } from "$app/environment";

// Import translations directly
import en from "./en.json";
import de from "./de.json";

// Add messages synchronously
addMessages("en", en);
addMessages("de", de);

// Function to load saved language from settings
function getStoredLanguage(): "en" | "de" {
  if (!browser) return "en";

  try {
    const settings = localStorage.getItem("settings");
    if (settings) {
      const { language } = JSON.parse(settings);
      if (language && (language === "en" || language === "de")) {
        return language;
      }
    }
  } catch (e) {
    console.error("Error reading stored language:", e);
  }
  return "en"; // Default to English if anything goes wrong
}

// Initialize i18n
const initI18n = () => {
  init({
    fallbackLocale: "en",
    initialLocale: browser ? getStoredLanguage() : "en",
  });
};

// Initialize immediately
initI18n();

// Export for use in other components
export { locale, waitLocale };
