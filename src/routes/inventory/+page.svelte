<!-- cash-register/src/routes/inventory/+page.svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    import ProductList from "$lib/components/inventory/ProductList.svelte";
    import ProductForm from "$lib/components/inventory/ProductForm.svelte";
    import ProductSearch from "$lib/components/inventory/ProductSearch.svelte";
    import { inventoryStore } from "$lib/stores/inventory";
    import type { Product } from "$lib/types";
    import { _ } from "svelte-i18n";

    let showAddModal = false;
    let searchQuery = "";
    let sortField: "name" | "price" | "stock" = "name";
    let sortDirection: "asc" | "desc" = "asc";
    let editingProduct: Product | null = null;
    let loading = true;
    let error: string | null = null;

    onMount(async () => {
        try {
            await inventoryStore.initialize();
        } catch (e) {
            error = $_("inventory.errors.loadFailed");
            console.error(e);
        } finally {
            loading = false;
        }
    });

    async function handleProductSubmit(product: Product) {
        try {
            if (editingProduct) {
                await inventoryStore.updateProduct(product);
            } else {
                await inventoryStore.addProduct(product);
            }
            showAddModal = false;
            editingProduct = null;
        } catch (e) {
            console.error("Error saving product:", e);
            alert($_("inventory.errors.saveFailed"));
        }
    }

    function handleEdit(product: Product) {
        editingProduct = { ...product };
        showAddModal = true;
    }
</script>

<div class="space-y-6 p-6">
    <!-- Header with Search and Add Button -->
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">{@html $_("inventory.title")}</h1>
        <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            on:click={() => {
                editingProduct = null;
                showAddModal = true;
            }}
        >
            {@html $_("inventory.addProduct")}
        </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex gap-4">
            <div class="flex-1">
                <ProductSearch bind:value={searchQuery} />
            </div>
            <select bind:value={sortField} class="px-3 py-2 border rounded">
                <option value="name">{@html $_("inventory.sort.byName")}</option
                >
                <option value="price"
                    >{@html $_("inventory.sort.byPrice")}</option
                >
                <option value="stock"
                    >{@html $_("inventory.sort.byStock")}</option
                >
            </select>
            <button
                class="px-3 py-2 border rounded"
                on:click={() =>
                    (sortDirection = sortDirection === "asc" ? "desc" : "asc")}
                aria-label={$_("inventory.sort.direction", {
                    values: {
                        direction:
                            sortDirection === "asc"
                                ? "descending"
                                : "ascending",
                    },
                })}
            >
                {sortDirection === "asc" ? "↑" : "↓"}
            </button>
        </div>
    </div>

    <!-- Loading State -->
    {#if loading}
        <div class="text-center py-8">
            <span class="text-gray-500">{@html $_("common.loading")}</span>
        </div>
        <!-- Error State -->
    {:else if error}
        <div class="text-center py-8 text-red-500">
            {error}
        </div>
        <!-- Product List -->
    {:else}
        <ProductList
            {searchQuery}
            {sortField}
            {sortDirection}
            onEdit={handleEdit}
        />
    {/if}

    <!-- Add/Edit Product Modal -->
    {#if showAddModal}
        <div
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            role="dialog"
            aria-labelledby="modal-title"
        >
            <div class="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
                <ProductForm
                    product={editingProduct || undefined}
                    onSubmit={handleProductSubmit}
                    onCancel={() => {
                        showAddModal = false;
                        editingProduct = null;
                    }}
                />
            </div>
        </div>
    {/if}
</div>
