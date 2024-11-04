<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { _, init, locale } from "svelte-i18n";
    import type { ReceiptData } from "./types";

    let receipt: ReceiptData | null = null;
    let error: string | null = null;
    let isInitialized = false;

    onMount(async () => {
        if (browser) {
            try {
                const hash = window.location.hash.slice(1);
                const params = new URLSearchParams(hash);
                const data = params.get("data");
                if (data) {
                    receipt = JSON.parse(atob(data)) as ReceiptData;
                    // Initialize i18n with the receipt's language
                    await init({
                        fallbackLocale: "en",
                        initialLocale: receipt.language,
                    });
                    // Set the locale explicitly
                    locale.set(receipt.language);
                    isInitialized = true;
                } else {
                    error = "No receipt data found";
                }
            } catch (e) {
                console.error("Failed to parse receipt data:", e);
                error = "Failed to load receipt";
            }
        }
    });
</script>

{#if error}
    <div class="text-red-500 p-4 text-center">{error}</div>
{:else if receipt && isInitialized}
    <div class="max-w-md mx-auto p-4">
        <div class="bg-white p-6 rounded-lg shadow">
            <div class="text-center mb-6">
                <h1 class="text-2xl font-bold mb-2">{receipt.storeName}</h1>
                <p class="text-gray-600">
                    {new Date(receipt.timestamp).toLocaleDateString(
                        receipt.language === "de" ? "de-DE" : "en-US",
                    )}
                    {new Date(receipt.timestamp).toLocaleTimeString(
                        receipt.language === "de" ? "de-DE" : "en-US",
                    )}
                </p>
                <p class="text-gray-600">
                    {$_("register.receipt.cashier")}: {receipt.cashierName}
                </p>
            </div>

            <div class="border-t border-b py-4 mb-4">
                {#each receipt.items as item}
                    <div class="flex justify-between py-1">
                        <span
                            >{item.name[receipt.language]} × {item.quantity}</span
                        >
                        <span>
                            {$_("register.payment.currency")}{(
                                item.price * item.quantity
                            ).toFixed(2)}
                        </span>
                    </div>
                {/each}
            </div>

            <div class="font-bold text-lg flex justify-between mb-4">
                <span>{$_("register.payment.total")}</span>
                <span
                    >{$_("register.payment.currency")}{receipt.total.toFixed(
                        2,
                    )}</span
                >
            </div>

            <div class="text-gray-600">
                <p>
                    {$_("register.payment.paymentMethod")}: {$_(
                        `register.payment.${receipt.paymentMethod}`,
                    )}
                </p>
                {#if receipt.paymentMethod === "cash" && receipt.cashGiven}
                    <p>
                        {$_("register.payment.cashReceived")}: {$_(
                            "register.payment.currency",
                        )}{receipt.cashGiven.toFixed(2)}
                    </p>
                    <p>
                        {$_("register.payment.changeDue")}: {$_(
                            "register.payment.currency",
                        )}{receipt.changeGiven?.toFixed(2)}
                    </p>
                {/if}
            </div>

            <div class="text-center mt-6 text-gray-600">
                <p>{$_("register.receipt.thankYou")}</p>
            </div>
        </div>
    </div>
{:else}
    <div class="p-4 text-center">Loading...</div>
{/if}
