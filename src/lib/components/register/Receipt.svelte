<!-- src/lib/components/register/Receipt.svelte -->
<script lang="ts">
    import QRCode from "qrcode";
    import type { Transaction } from "$lib/types";
    import { settingsStore } from "$lib/stores/settings";
    import { onMount } from "svelte";
    import { base } from "$app/paths"; // Add this import

    export let transaction: Transaction;
    let qrCodeDataUrl: string = "";
    let receiptUrl: string = "";
    let error: string = "";
    let isGenerating = false;
    let dataSize = 0;

    $: language = $settingsStore.language;
    $: storeName = $settingsStore.storeName;
    $: cashierName = $settingsStore.cashierName;

    async function generateQRCode() {
        isGenerating = true;
        error = "";
        try {
            const receiptData = {
                timestamp: transaction.timestamp,
                storeName,
                cashierName,
                items: transaction.items,
                total: transaction.total,
                paymentMethod: transaction.paymentMethod,
                cashGiven: transaction.cashGiven,
                changeGiven: transaction.changeGiven,
                language,
            };

            const base64Data = btoa(JSON.stringify(receiptData));
            dataSize = base64Data.length;

            // Use base path for correct URL in both environments
            receiptUrl = `${window.location.origin}${base}/receipt/#data=${base64Data}`;

            console.log("Receipt URL:", receiptUrl);
            console.log("Data size:", dataSize, "bytes");

            qrCodeDataUrl = await QRCode.toDataURL(receiptUrl, {
                width: 512,
                margin: 1,
                errorCorrectionLevel: "M",
            });
        } catch (err) {
            console.error("Error generating QR code:", err);
            error =
                err instanceof Error
                    ? err.message
                    : "Failed to generate QR code";
        } finally {
            isGenerating = false;
        }
    }

    onMount(() => {
        generateQRCode();
    });
</script>

<div class="receipt">
    <div class="debug-info text-xs font-mono bg-gray-100 p-2 mb-4 rounded">
        Data size: {dataSize} bytes
        {#if dataSize > 2953}
            <div class="text-red-500">
                ⚠️ Exceeds QR code capacity (2953 bytes)
            </div>
        {/if}
    </div>

    {#if isGenerating}
        <div class="text-center py-4">
            <p>Generating QR code...</p>
        </div>
    {:else if error}
        <div class="text-red-500 text-center py-4">
            <p>Error: {error}</p>
            <p class="text-sm mt-2">
                Try reducing the number of items or simplifying product names.
            </p>
        </div>
    {:else if qrCodeDataUrl && receiptUrl}
        <div class="qr-container">
            <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="qr-code-wrapper bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors"
            >
                <img
                    src={qrCodeDataUrl}
                    alt="Receipt QR Code"
                    class="qr-code"
                />
            </a>
            <p class="text-sm text-gray-600 text-center mt-4">
                {language === "de"
                    ? "QR-Code scannen oder klicken, um digitale Quittung anzuzeigen"
                    : "Scan or click QR code to view digital receipt"}
            </p>
        </div>
    {:else}
        <div class="text-center py-4">
            <p>No QR code available</p>
        </div>
    {/if}
</div>

<style>
    .qr-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 1rem;
    }

    .qr-code-wrapper {
        width: 100%;
        max-width: 300px;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        padding: 1rem;
    }

    .qr-code {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>
