<script lang="ts">
    import type { Product } from "$lib/types";
    import { inventoryStore } from "$lib/stores/inventory";
    import Scanner from "$lib/components/register/Scanner.svelte";
    import { _ } from "svelte-i18n";

    // Initialize with a proper name object structure
    let initialProduct: Partial<Product> = {
        barcode: "",
        name: { en: "", de: "" },
        price: 0,
        stock: 0,
    };

    export let product: Partial<Product> = {
        ...initialProduct,
        name: { en: "", de: "" },
    };
    export let onSubmit: (product: Product) => void;
    export let onCancel: () => void;

    let showScanner = false;
    let errors: Partial<Record<keyof Product, string>> = {};

    function validateForm(): boolean {
        errors = {};

        if (!product.barcode) {
            errors.barcode = $_("inventory.form.validation.barcodeRequired");
        }
        if (!product.name?.en) {
            errors.name = $_("inventory.form.validation.nameRequired");
        }
        if (!product.name?.de) {
            errors.name = $_("inventory.form.validation.nameRequired");
        }
        if (product.price === undefined || product.price < 0) {
            errors.price = $_("inventory.form.validation.priceRequired");
        }
        if (product.stock === undefined || product.stock < 0) {
            errors.stock = $_("inventory.form.validation.stockRequired");
        }

        return Object.keys(errors).length === 0;
    }

    function handleSubmit() {
        if (validateForm()) {
            onSubmit(product as Product);
        }
    }
</script>

<div class="space-y-6">
    <h2 class="text-xl font-bold">
        {#if product.barcode}
            {@html $_("inventory.editProduct")}
        {:else}
            {@html $_("inventory.addProduct")}
        {/if}
    </h2>

    <form class="space-y-4" on:submit|preventDefault={handleSubmit}>
        <!-- Barcode Input with Scanner -->
        <div>
            <label class="block text-sm font-medium text-gray-700">
                {@html $_("inventory.form.barcode")}
            </label>
            <div class="mt-1 flex gap-2">
                <input
                    type="text"
                    bind:value={product.barcode}
                    class="flex-1 p-2 border rounded"
                    class:border-red-500={errors.barcode}
                />
                <button
                    type="button"
                    class="px-3 py-2 bg-blue-500 text-white rounded"
                    on:click={() => (showScanner = !showScanner)}
                >
                    {@html $_("inventory.form.scan")}
                </button>
            </div>
            {#if errors.barcode}
                <p class="mt-1 text-sm text-red-500">{errors.barcode}</p>
            {/if}
        </div>

        {#if showScanner}
            <div class="border rounded p-4">
                <Scanner
                    onScanSuccess={(code) => {
                        product.barcode = code;
                        errors.barcode = "";
                        showScanner = false;
                    }}
                    onScanError={(err) => {
                        errors.barcode = `Scanner error: ${err.message}`;
                    }}
                />
            </div>
        {/if}

        <!-- Product Names -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">
                    {@html $_("inventory.form.nameEn")}
                </label>
                <input
                    type="text"
                    bind:value={product.name.en}
                    class="mt-1 w-full p-2 border rounded"
                    class:border-red-500={errors.name}
                />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">
                    {@html $_("inventory.form.nameDe")}
                </label>
                <input
                    type="text"
                    bind:value={product.name.de}
                    class="mt-1 w-full p-2 border rounded"
                    class:border-red-500={errors.name}
                />
            </div>
            {#if errors.name}
                <p class="mt-1 text-sm text-red-500">{errors.name}</p>
            {/if}
        </div>

        <!-- Price and Stock -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">
                    {@html $_("inventory.form.price")}
                </label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    bind:value={product.price}
                    class="mt-1 w-full p-2 border rounded"
                    class:border-red-500={errors.price}
                />
                {#if errors.price}
                    <p class="mt-1 text-sm text-red-500">{errors.price}</p>
                {/if}
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">
                    {@html $_("inventory.form.stock")}
                </label>
                <input
                    type="number"
                    min="0"
                    step="1"
                    bind:value={product.stock}
                    class="mt-1 w-full p-2 border rounded"
                    class:border-red-500={errors.stock}
                />
                {#if errors.stock}
                    <p class="mt-1 text-sm text-red-500">{errors.stock}</p>
                {/if}
            </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end gap-4 pt-4">
            <button
                type="button"
                class="px-4 py-2 border rounded"
                on:click={onCancel}
            >
                {@html $_("common.cancel")}
            </button>
            <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded"
            >
                {#if product.barcode}
                    {@html $_("common.save")}
                {:else}
                    {@html $_("common.add")}
                {/if}
            </button>
        </div>
    </form>
</div>
