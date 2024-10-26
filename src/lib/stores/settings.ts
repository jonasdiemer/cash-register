// cash-register/src/lib/stores/settings.ts
import { writable } from "svelte/store";
import type { Settings, Language } from "$lib/types";
import { browser } from "$app/environment";

const DEFAULT_SETTINGS: Settings = {
  language: "en",
  storeName: "My Store",
  cashierName: "",
  cameraDeviceId: undefined,
};

function createSettingsStore() {
  // Start with default settings
  let initialSettings = DEFAULT_SETTINGS;

  if (browser) {
    try {
      const stored = localStorage.getItem("settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure we have a valid language setting
        if (parsed.language && !["en", "de"].includes(parsed.language)) {
          parsed.language = "en" as Language;
        }
        initialSettings = { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
      initialSettings = { ...DEFAULT_SETTINGS };
      localStorage.setItem("settings", JSON.stringify(DEFAULT_SETTINGS));
    }
  }

  const { subscribe, set, update } = writable<Settings>(initialSettings);

  return {
    subscribe,
    update,
    set,
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => {
      update((settings) => {
        const newSettings = { ...settings, [key]: value };
        if (browser) {
          try {
            localStorage.setItem("settings", JSON.stringify(newSettings));
          } catch (e) {
            console.error("Failed to save settings:", e);
          }
        }
        return newSettings;
      });
    },
    resetLanguage: () => {
      update((settings) => {
        const newSettings = { ...settings, language: "en" as Language };
        if (browser) {
          try {
            localStorage.setItem("settings", JSON.stringify(newSettings));
          } catch (e) {
            console.error("Failed to reset language:", e);
          }
        }
        return newSettings;
      });
    },
    reset: () => {
      set(DEFAULT_SETTINGS);
      if (browser) {
        try {
          localStorage.setItem("settings", JSON.stringify(DEFAULT_SETTINGS));
        } catch (e) {
          console.error("Failed to reset settings:", e);
        }
      }
    },
  };
}

export const settingsStore = createSettingsStore();
