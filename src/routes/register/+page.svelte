<!-- cash-register/src/routes/register/+page.svelte -->
<script lang="ts">
    import Scanner from "$lib/components/register/Scanner.svelte";
    import Cart from "$lib/components/register/Cart.svelte";
    import Payment from "$lib/components/register/Payment.svelte";
    import { cartStore } from "$lib/stores/cart";
    import { inventoryStore } from "$lib/stores/inventory";

    let isScanning = false;
    let scanError = "";

    async function handleScan(barcode: string) {
        try {
            const product = inventoryStore.findByBarcode(barcode);
            if (product) {
                cartStore.addItem(product);
                scanError = "";
            } else {
                scanError = `Product not found for barcode: ${barcode}`;
            }
        } catch (error) {
            console.error("Error processing scan:", error);
            scanError = `Error processing barcode: ${barcode}`;
        }
    }

    function handleScanError(error: Error) {
        console.error("Scan error:", error);
        scanError = error.message;
    }
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="space-y-4">
        <div class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-xl font-bold mb-4">Scanner</h2>
            {#if scanError}
                <div
                    class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                >
                    {scanError}
                </div>
            {/if}
            <Scanner
                bind:isScanning
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
