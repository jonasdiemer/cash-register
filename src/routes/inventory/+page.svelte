<script lang="ts">
  import ProductList from '$lib/components/inventory/ProductList.svelte';
  import ProductForm from '$lib/components/inventory/ProductForm.svelte';
  import ProductSearch from '$lib/components/inventory/ProductSearch.svelte';
  import { inventoryStore } from '$lib/stores/inventory';
  
  let showAddModal = false;
  let searchQuery = '';
  let sortField: 'name' | 'price' | 'stock' = 'name';
  let sortDirection: 'asc' | 'desc' = 'asc';
</script>

<div class="space-y-6">
  <!-- Header with Search and Add Button -->
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-bold">Inventory Management</h1>
    <button
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      on:click={() => showAddModal = true}
    >
      Add Product
    </button>
  </div>

  <!-- Search and Filters -->
  <div class="bg-white p-4 rounded-lg shadow-sm">
    <div class="flex gap-4">
      <ProductSearch 
        bind:value={searchQuery}
        class="flex-1"
      />
      <select
        bind:value={sortField}
        class="px-3 py-2 border rounded"
      >
        <option value="name">Sort by Name</option>
        <option value="price">Sort by Price</option>
        <option value="stock">Sort by Stock</option>
      </select>
      <button
        class="px-3 py-2 border rounded"
        on:click={() => sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'}
      >
        {sortDirection === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  </div>

  <!-- Product List -->
  <ProductList
    {searchQuery}
    {sortField}
    {sortDirection}
    onEdit={(product) => {
      // TODO: Implement edit functionality
    }}
  />

  <!-- Add/Edit Product Modal -->
  {#if showAddModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
        <ProductForm
          onSubmit={(product) => {
            // TODO: Handle product submission
            showAddModal = false;
          }}
          onCancel={() => showAddModal = false}
        />
      </div>
    </div>
  {/if}
</div>
