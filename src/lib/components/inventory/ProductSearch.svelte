<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { inventoryStore } from "$lib/stores/inventory";
    import type { Product } from "$lib/types";
    import { _ } from "svelte-i18n";

    export let value = "";
    export let placeholder = $_("inventory.search.placeholder");

    const dispatch = createEventDispatcher();

    let showSuggestions = false;
    let inputElement: HTMLInputElement;

    $: suggestions = value
        ? $inventoryStore
              .filter(
                  (product) =>
                      product.name.en
                          .toLowerCase()
                          .includes(value.toLowerCase()) ||
                      product.name.de
                          .toLowerCase()
                          .includes(value.toLowerCase()) ||
                      product.barcode.includes(value),
              )
              .slice(0, 5) // Limit to 5 suggestions
        : [];

    function handleSelect(product: Product) {
        value = product.name.en;
        showSuggestions = false;
        dispatch("select", product);
        inputElement.blur();
    }

    function handleFocus() {
        if (value) {
            showSuggestions = true;
        }
    }

    function handleBlur() {
        // Delay hiding suggestions to allow for clicks
        setTimeout(() => {
            showSuggestions = false;
        }, 200);
    }

    function handleClear() {
        value = "";
        dispatch("clear");
        inputElement.focus();
    }
</script>

<div class="relative">
    <!-- Search Input -->
    <div class="relative">
        <input
            bind:this={inputElement}
            type="text"
            bind:value
            {placeholder}
            class="w-full pl-10 pr-8 py-2 border rounded bg-white"
            on:focus={handleFocus}
            on:blur={handleBlur}
            aria-label={$_("inventory.search.ariaLabel")}
        />

        <!-- Search Icon -->
        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                />
            </svg>
        </div>

        <!-- Clear Button -->
        {#if value}
            <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                on:click={handleClear}
                aria-label={$_("inventory.search.clearButton")}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                    />
                </svg>
            </button>
        {/if}
    </div>

    <!-- Search Suggestions -->
    {#if showSuggestions && suggestions.length > 0}
        <div
            class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
            role="listbox"
            aria-label={$_("inventory.search.suggestions")}
        >
            <ul class="py-1">
                {#each suggestions as product}
                    <li>
                        <button
                            class="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                            on:click={() => handleSelect(product)}
                            role="option"
                        >
                            <div class="flex justify-between items-center">
                                <div>
                                    <div class="font-medium">
                                        {product.name.en}
                                    </div>
                                    <div class="text-sm text-gray-500">
                                        {product.name.de}
                                    </div>
                                </div>
                                <div class="text-sm text-gray-500">
                                    €{product.price.toFixed(2)}
                                </div>
                            </div>
                            <div class="text-xs text-gray-400">
                                {product.barcode}
                            </div>
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    {:else if showSuggestions && value}
        <div
            class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
            role="alert"
        >
            <div class="px-4 py-2 text-gray-500">
                {@html $_("inventory.search.noResults")}
            </div>
        </div>
    {/if}
</div>

<style>
    /* Prevent text selection on suggestions */
    button {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>
