<script lang="ts">
  import "../app.postcss";
  import { _, locale } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { settingsStore } from '$lib/stores/settings';
  import '$lib/i18n';

  onMount(() => {
    // Set locale from settings if available
    if ($settingsStore?.language) {
      locale.set($settingsStore.language);
    }
  });
</script>

<div class="min-h-screen bg-gray-50">
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex">
          <a href="/" class="px-3 py-2">{$_('navigation.home')}</a>
          <a href="/inventory" class="px-3 py-2">{$_('navigation.inventory')}</a>
          <a href="/register" class="px-3 py-2">{$_('navigation.register')}</a>
          <a href="/settings" class="px-3 py-2">{$_('navigation.settings')}</a>
        </div>
      </div>
    </div>
  </nav>
  
  <main class="max-w-7xl mx-auto px-4 py-6">
    <slot />
  </main>
</div>
