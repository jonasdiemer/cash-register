<!-- cash-register/src/routes/settings/+page.svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    import { settingsStore } from "$lib/stores/settings";
    import type { Settings } from "$lib/types/settings";
    import { _ } from "svelte-i18n";

    let availableCameras: MediaDeviceInfo[] = [];
    let loading = true;
    let saveMessage = "";

    onMount(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            availableCameras = devices.filter(
                (device) => device.kind === "videoinput",
            );
        } catch (error) {
            console.error("Error accessing cameras:", error);
        } finally {
            loading = false;
        }
    });

    function handleSave(key?: keyof Settings, value?: any) {
        if (key && value !== undefined) {
            settingsStore.updateSetting(key, value);
        }
        saveMessage = $_("common.success");
        setTimeout(() => (saveMessage = ""), 3000);
    }
</script>

<div class="max-w-2xl mx-auto space-y-8">
    <h1 class="text-2xl font-bold">{$_("settings.title")}</h1>

    <!-- Store Information -->
    <section class="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 class="text-xl font-semibold">{$_("settings.store.title")}</h2>

        <div class="space-y-4">
            <label class="block">
                <span class="text-gray-700">{$_("settings.store.name")}</span>
                <input
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    value={$settingsStore.storeName}
                    on:change={(e) =>
                        handleSave("storeName", e.currentTarget.value)}
                />
            </label>

            <label class="block">
                <span class="text-gray-700"
                    >{$_("settings.store.cashierName")}</span
                >
                <input
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    value={$settingsStore.cashierName}
                    on:change={(e) =>
                        handleSave("cashierName", e.currentTarget.value)}
                />
            </label>
        </div>
    </section>

    <!-- Language Settings -->
    <section class="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 class="text-xl font-semibold">{$_("settings.language.title")}</h2>

        <div class="space-y-4">
            <div class="flex gap-4">
                <label class="flex-1">
                    <input
                        type="radio"
                        name="language"
                        value="en"
                        checked={$settingsStore.language === "en"}
                        class="sr-only peer"
                        on:change={() => handleSave("language", "en")}
                    />
                    <div
                        class="text-center p-4 border rounded cursor-pointer peer-checked:bg-blue-50 peer-checked:border-blue-500"
                    >
                        🇬🇧 {$_("settings.language.en")}
                    </div>
                </label>

                <label class="flex-1">
                    <input
                        type="radio"
                        name="language"
                        value="de"
                        checked={$settingsStore.language === "de"}
                        class="sr-only peer"
                        on:change={() => handleSave("language", "de")}
                    />
                    <div
                        class="text-center p-4 border rounded cursor-pointer peer-checked:bg-blue-50 peer-checked:border-blue-500"
                    >
                        🇩🇪 {$_("settings.language.de")}
                    </div>
                </label>
            </div>
        </div>
    </section>

    <!-- Scanner Settings -->
    <section class="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 class="text-xl font-semibold">{$_("settings.scanner.title")}</h2>

        {#if loading}
            <p>{$_("common.loading")}</p>
        {:else if availableCameras.length === 0}
            <p class="text-yellow-600">{$_("settings.scanner.noCamera")}</p>
        {:else}
            <div class="space-y-4">
                <label class="block">
                    <span class="text-gray-700"
                        >{$_("settings.scanner.defaultCamera")}</span
                    >
                    <select
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        bind:value={$settingsStore.cameraDeviceId}
                        on:change={(e) =>
                            handleSave("cameraDeviceId", e.currentTarget.value)}
                    >
                        <option value={undefined}
                            >{$_("settings.scanner.selectCamera")}</option
                        >
                        {#each availableCameras as camera}
                            <option value={camera.deviceId}>
                                {camera.label ||
                                    `Camera ${camera.deviceId.slice(0, 8)}`}
                            </option>
                        {/each}
                    </select>
                </label>

                <button
                    class="px-4 py-2 bg-blue-500 text-white rounded"
                    on:click={async () => {
                        try {
                            await navigator.mediaDevices.getUserMedia({
                                video: true,
                            });
                        } catch (error) {
                            console.error("Error testing camera:", error);
                        }
                    }}
                >
                    {$_("settings.scanner.testCamera")}
                </button>
            </div>
        {/if}
    </section>

    <!-- Reset Settings -->
    <section class="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 class="text-xl font-semibold">{$_("settings.reset.title")}</h2>

        <div class="space-y-4">
            <p class="text-gray-600">{$_("settings.reset.description")}</p>

            <button
                class="px-4 py-2 bg-red-500 text-white rounded"
                on:click={() => {
                    if (confirm($_("settings.reset.confirm"))) {
                        settingsStore.reset();
                        handleSave();
                    }
                }}
            >
                {$_("settings.reset.button")}
            </button>
        </div>
    </section>

    <!-- Save Message -->
    {#if saveMessage}
        <div
            class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
        >
            {saveMessage}
        </div>
    {/if}
</div>
