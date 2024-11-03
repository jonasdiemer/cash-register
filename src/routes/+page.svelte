<!-- cash-register/src/routes/+page.svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    import { settingsStore } from "$lib/stores/settings";
    import { inventoryStore, productCount } from "$lib/stores/inventory";
    import { base } from "$app/paths";
    import { _ } from "svelte-i18n";

    // Quick action buttons with icons and descriptions
    const quickActions = [
        {
            titleKey: "home.quickActions.startRegister.title",
            descriptionKey: "home.quickActions.startRegister.description",
            icon: "🏪",
            href: `${base}/register`,
            color: "bg-blue-500",
        },
        {
            titleKey: "home.quickActions.manageProducts.title",
            descriptionKey: "home.quickActions.manageProducts.description",
            icon: "📦",
            href: `${base}/inventory`,
            color: "bg-green-500",
        },
        {
            titleKey: "home.quickActions.settings.title",
            descriptionKey: "home.quickActions.settings.description",
            icon: "⚙️",
            href: `${base}/settings`,
            color: "bg-purple-500",
        },
    ];

    // Stats - these would typically come from a store or database
    const stats = [
        {
            titleKey: "home.stats.products",
            value: "0",
            getValue: () => $productCount.toString(),
            icon: "📦",
        },
        {
            titleKey: "home.stats.salesToday",
            value: "€0.00",
            icon: "💶",
        },
        {
            titleKey: "home.stats.transactions",
            value: "0",
            icon: "🧾",
        },
    ];
</script>

<div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Welcome Section -->
    <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">
            {$_("home.welcome", {
                values: { storeName: $settingsStore.storeName },
            })}
        </h1>
        <p class="text-xl text-gray-600">{$_("home.whatToDo")}</p>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {#each quickActions as action}
            <a
                href={action.href}
                class="group block p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white border-2 border-transparent hover:border-blue-200"
            >
                <div class="flex items-center mb-4">
                    <div
                        class={`${action.color} text-white p-3 rounded-lg text-2xl`}
                    >
                        {action.icon}
                    </div>
                    <h2
                        class="text-xl font-semibold ml-4 group-hover:text-blue-500 transition-colors"
                    >
                        {$_(action.titleKey)}
                    </h2>
                </div>
                <p class="text-gray-600">
                    {$_(action.descriptionKey)}
                </p>
            </a>
        {/each}
    </div>

    <!-- Stats Overview -->
    <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-semibold mb-6">{$_("home.stats.title")}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {#each stats as stat}
                <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div class="text-3xl mr-4">
                        {stat.icon}
                    </div>
                    <div>
                        <h3 class="text-gray-600">{$_(stat.titleKey)}</h3>
                        <p class="text-2xl font-bold">
                            {stat.getValue ? stat.getValue() : stat.value}
                        </p>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Getting Started Guide -->
    <div class="mt-12 bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-semibold mb-6">
            {$_("home.gettingStarted.title")}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-blue-50 p-6 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">
                    {$_("home.gettingStarted.title")}:
                </h3>
                <ol class="list-decimal list-inside space-y-3 text-gray-700">
                    <li>{$_("home.gettingStarted.steps.1")}</li>
                    <li>{$_("home.gettingStarted.steps.2")}</li>
                    <li>{$_("home.gettingStarted.steps.3")}</li>
                    <li>{$_("home.gettingStarted.steps.4")}</li>
                </ol>
            </div>
            <div class="bg-yellow-50 p-6 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">
                    {$_("home.gettingStarted.tips.title")}:
                </h3>
                <ul class="list-disc list-inside space-y-3 text-gray-700">
                    <li>{$_("home.gettingStarted.tips.scanner")}</li>
                    <li>{$_("home.gettingStarted.tips.receipts")}</li>
                    <li>{$_("home.gettingStarted.tips.inventory")}</li>
                    <li>{$_("home.gettingStarted.tips.haveFun")}</li>
                </ul>
            </div>
        </div>
    </div>
</div>
