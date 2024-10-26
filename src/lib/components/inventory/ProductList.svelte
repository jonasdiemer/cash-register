<script lang="ts">
  import type { Product } from '$lib/types';
  import { inventoryStore } from '$lib/stores/inventory';

  export let searchQuery = '';
  export let sortField: 'name' | 'price' | 'stock' = 'name';
  export let sortDirection: 'asc' | 'desc' = 'asc';
  export let onEdit: (product: Product) => void;

  $: filteredProducts = $inventoryStore
    .filter(product => 
      product.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.de.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery)
    )
    .sort((a, b) => {
      const aValue = sortField === 'name' ? a.name.en : a[sortField];
      const bValue = sortField === 'name' ? b.name.en : b[sortField];
      return sortDirection === 'asc' 
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });
</script>

<div class="bg-white rounded-lg shadow-sm overflow-hidden">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Barcode
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Name (EN/DE)
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Price
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Stock
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      {#each filteredProducts as product (product.barcode)}
        <tr class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            {product.barcode}
          </td>
          <td class="px-6 py-4">
            <div>{product.name.en}</div>
            <div class="text-sm text-gray-500">{product.name.de}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            €{product.price.toFixed(2)}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class={product.stock < 5 ? 'text-red-500' : ''}>
              {product.stock}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button
              class="text-blue-500 hover:text-blue-700 mr-2"
              on:click={() => onEdit(product)}
            >
              Edit
            </button>
            <button
              class="text-red-500 hover:text-red-700"
              on:click={() => {
                if (confirm('Are you sure you want to delete this product?')) {
                  inventoryStore.removeProduct(product.barcode);
                }
              }}
            >
              Delete
            </button>
          </td>
        </tr>
      {/each}
      
      {#if filteredProducts.length === 0}
        <tr>
          <td colspan="5" class="px-6 py-4 text-center text-gray-500">
            No products found
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>
