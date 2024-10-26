<script lang="ts">
    import type { Product } from "$lib/types";
    import { inventoryStore } from "$lib/stores/inventory";
    import Scanner from "$lib/components/register/Scanner.svelte";

    // Initialize with a proper name object structure
    let initialProduct: Partial<Product> = {
        barcode: "",
        name: { en: "", de: "" },
        price: 0,
        stock: 0,
    };

    export let product: Partial<Product> = initialProduct;
    export let onSubmit: (product: Product) => void;
    export let onCancel: () => void;

    let showScanner = false;
    let errors: Partial<Record<keyof Product, string>> = {};

    function validateForm(): boolean {
        errors = {};

        if (!product.barcode) {
            errors.barcode = "Barcode is required";
        }
        if (!product.name?.en) {
            errors.name = "English name is required";
        }
        if (!product.name?.de) {
            errors.name = "German name is required";
        }
        if (product.price === undefined || product.price < 0) {
            errors.price = "Valid price is required";
        }
        if (product.stock === undefined || product.stock < 0) {
            errors.stock = "Valid stock quantity is required";
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
        {product.barcode ? "Edit Product" : "Add New Product"}
    </h2>

    <form class="space-y-4" on:submit|preventDefault={handleSubmit}>
        <!-- Barcode Input with Scanner -->
        <div>
            <label class="block text-sm font-medium text-gray-700">
                Barcode
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
                    Scan
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
                        // showScanner = false;
                    }}
                />
            </div>
        {/if}

        <!-- Product Names -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">
                    Name (English)
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
                    Name (German)
                </label>
                <input
                    type="text"
                    bind:value={product.name.de}
                    class="mt-1 w-full p-2 border rounded"
                    class:border-red-500={errors.name}
                />
            </div>
        </div>

        <!-- Price and Stock -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">
                    Price (€)
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
                    Stock Quantity
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
                Cancel
            </button>
            <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded"
            >
                {product.barcode ? "Update" : "Add"} Product
            </button>
        </div>
    </form>
</div>
