<script lang="ts">
  import Scanner from '$lib/components/register/Scanner.svelte';
  import Cart from '$lib/components/register/Cart.svelte';
  import Payment from '$lib/components/register/Payment.svelte';
  import { cartStore } from '$lib/stores/cart';

  let isScanning = false;
  
  function handleScan(barcode: string) {
    // TODO: Look up product by barcode and add to cart
    console.log('Scanned barcode:', barcode);
  }

  function handleScanError(error: Error) {
    console.error('Scan error:', error);
    // TODO: Add proper error handling/user notification
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
  <div class="space-y-4">
    <div class="bg-white p-4 rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4">Scanner</h2>
      <Scanner
        {isScanning}
        onScanSuccess={handleScan}
        onScanError={handleScanError}
      />
    </div>
  </div>

  <div class="space-y-4">
    <div class="bg-white p-4 rounded-lg shadow">
      <Cart />
    </div>
    <div class="bg-white p-4 rounded-lg shadow">
      <Payment />
    </div>
  </div>
</div>
