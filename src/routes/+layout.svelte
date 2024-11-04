<!-- cash-register/src/routes/+layout.svelte -->
<script lang="ts">
    import "../app.postcss";
    import { _, locale } from "svelte-i18n";
    import { onMount } from "svelte";
    import { settingsStore } from "$lib/stores/settings";
    import { inventoryStore } from "$lib/stores/inventory";
    import { browser } from "$app/environment";
    import { waitLocale } from "$lib/i18n";
    import { base } from "$app/paths";
    import { page } from "$app/stores"; // Add this import

    // This is a SvelteKit load function that will run before rendering
    export const load = async () => {
        // Only wait for locale in the browser
        if (browser) {
            await waitLocale();
        }
        return {};
    };

    onMount(async () => {
        // Set locale from settings if available
        if ($settingsStore?.language) {
            locale.set($settingsStore.language);
        }

        // Initialize inventory
        try {
            await inventoryStore.initialize();
        } catch (error) {
            console.error("Failed to initialize inventory:", error);
        }
    });
</script>

<div class="min-h-screen bg-gray-50">
    {#if !$page.url.pathname.endsWith("/receipt")}
        <nav class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex justify-between h-16">
                    <div class="flex">
                        <a href="{base}/" class="px-3 py-2"
                            >{$_("navigation.home")}</a
                        >
                        <a href="{base}/inventory" class="px-3 py-2"
                            >{$_("navigation.inventory")}</a
                        >
                        <a href="{base}/register" class="px-3 py-2"
                            >{$_("navigation.register")}</a
                        >
                        <a href="{base}/settings" class="px-3 py-2"
                            >{$_("navigation.settings")}</a
                        >
                    </div>
                </div>
            </div>
        </nav>
    {/if}

    <main class="max-w-7xl mx-auto px-4 py-6">
        <slot />
    </main>
</div>
