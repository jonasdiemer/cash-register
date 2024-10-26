<!-- cash-register/src/routes/inventory/+page.svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    import ProductList from "$lib/components/inventory/ProductList.svelte";
    import ProductForm from "$lib/components/inventory/ProductForm.svelte";
    import ProductSearch from "$lib/components/inventory/ProductSearch.svelte";
    import { inventoryStore } from "$lib/stores/inventory";
    import type { Product } from "$lib/types";

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
            error = "Failed to load inventory";
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
            alert("Failed to save product. Please try again.");
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
        <h1 class="text-2xl font-bold">Inventory Management</h1>
        <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            on:click={() => {
                editingProduct = null;
                showAddModal = true;
            }}
        >
            Add Product
        </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex gap-4">
            <ProductSearch bind:value={searchQuery} class="flex-1" />
            <select bind:value={sortField} class="px-3 py-2 border rounded">
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
            </select>
            <button
                class="px-3 py-2 border rounded"
                on:click={() =>
                    (sortDirection = sortDirection === "asc" ? "desc" : "asc")}
            >
                {sortDirection === "asc" ? "↑" : "↓"}
            </button>
        </div>
    </div>

    <!-- Loading State -->
    {#if loading}
        <div class="text-center py-8">
            <span class="text-gray-500">Loading inventory...</span>
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
