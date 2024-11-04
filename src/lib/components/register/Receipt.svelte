<!-- src/lib/components/register/Receipt.svelte -->
<script lang="ts">
    import QRCode from "qrcode";
    import type { Transaction } from "$lib/types";
    import { settingsStore } from "$lib/stores/settings";
    import { onMount } from "svelte";
    import { base } from "$app/paths";
    import { _ } from "svelte-i18n";

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

    function getTooltipText(size: number) {
        const key =
            size > 2953
                ? "register.receipt.dataSizeWarning"
                : "register.receipt.dataSize";
        return $_(key, { values: { size } }); // This will return a string
    }

    onMount(() => {
        generateQRCode();
    });
</script>

<div class="receipt">
    {#if isGenerating}
        <div class="text-center py-4">
            <p>{$_("common.loading")}</p>
        </div>
    {:else if error}
        <div class="text-red-500 text-center py-4">
            <p>Error: {error}</p>
            <p class="text-sm mt-2">
                {$_("register.receipt.errorTryAgain")}
            </p>
        </div>
    {:else if qrCodeDataUrl && receiptUrl}
        <div class="qr-container">
            <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="qr-code-wrapper bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors group relative"
                title={getTooltipText(dataSize)}
            >
                <img
                    src={qrCodeDataUrl}
                    alt="Receipt QR Code"
                    class="qr-code"
                />
                {#if dataSize > 2953}
                    <div class="absolute top-2 right-2 text-red-500 text-lg">
                        ⚠️
                    </div>
                {/if}
            </a>
            <p class="text-sm text-gray-600 text-center mt-4">
                {$_("register.receipt.scanOrClick")}
            </p>
        </div>
    {:else}
        <div class="text-center py-4">
            <p>{$_("register.receipt.noQrCode")}</p>
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
