<script lang="ts">
    import { cartStore } from "$lib/stores/cart";
    import { settingsStore } from "$lib/stores/settings";
    import type { Language } from "$lib/types";
    import { _ } from "svelte-i18n";

    $: total = cartStore.getTotal($cartStore);
    $: language = $settingsStore.language;

    function updateQuantity(barcode: string, newQuantity: number) {
        cartStore.updateQuantity(barcode, newQuantity);
    }

    function removeItem(barcode: string) {
        cartStore.removeItem(barcode);
    }

    function getLocalizedName(name: Record<Language, string>) {
        return name[language] || name.en; // Fallback to English if translation not available
    }
</script>

<div class="cart">
    <h2 class="text-xl font-bold mb-4">{$_("register.cart.title")}</h2>

    {#if $cartStore.length === 0}
        <p class="text-gray-500">{$_("register.cart.noItems")}</p>
    {:else}
        <div class="space-y-4">
            {#each $cartStore as item}
                <div
                    class="flex items-center justify-between p-2 border rounded"
                >
                    <div>
                        <p class="font-medium">{getLocalizedName(item.name)}</p>
                        <p class="text-sm text-gray-600">
                            {$_("register.cart.currency")}{item.price.toFixed(
                                2,
                            )}
                        </p>
                    </div>

                    <div class="flex items-center space-x-2">
                        <button
                            class="px-2 py-1 bg-gray-200 rounded"
                            on:click={() =>
                                updateQuantity(item.barcode, item.quantity - 1)}
                        >
                            -
                        </button>

                        <span class="w-8 text-center">{item.quantity}</span>

                        <button
                            class="px-2 py-1 bg-gray-200 rounded"
                            on:click={() =>
                                updateQuantity(item.barcode, item.quantity + 1)}
                        >
                            +
                        </button>

                        <button
                            class="ml-2 text-red-500"
                            on:click={() => removeItem(item.barcode)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            {/each}

            <div class="pt-4 border-t">
                <p class="text-xl font-bold">
                    {$_("register.cart.total")}: {$_(
                        "register.cart.currency",
                    )}{total.toFixed(2)}
                </p>
            </div>
        </div>
    {/if}
</div>
