<!-- src/routes/receipt/+page.svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    import type { Transaction } from "$lib/types";
    import { browser } from "$app/environment";

    let receipt: Transaction | null = null;
    let error: string | null = null;
    let language: "en" | "de" = "en";

    const t = {
        en: {
            receipt: "Receipt",
            date: "Date",
            time: "Time",
            cashier: "Cashier",
            items: "Items",
            total: "Total",
            paymentMethod: "Payment Method",
            cash: "Cash",
            card: "Card",
            cashReceived: "Cash Received",
            change: "Change",
            currency: "$",
            thankYou: "Thank you for your purchase!",
            error: "Invalid receipt data",
        },
        de: {
            receipt: "Quittung",
            date: "Datum",
            time: "Uhrzeit",
            cashier: "Kassierer",
            items: "Artikel",
            total: "Gesamt",
            paymentMethod: "Zahlungsart",
            cash: "Bar",
            card: "Karte",
            cashReceived: "Erhaltener Betrag",
            change: "Rückgeld",
            currency: "€",
            thankYou: "Vielen Dank für Ihren Einkauf!",
            error: "Ungültige Quittungsdaten",
        },
    };

    onMount(() => {
        if (browser) {
            try {
                const hash = window.location.hash.slice(1); // Remove the # character
                const params = new URLSearchParams(hash);
                const data = params.get("data");
                if (data) {
                    receipt = JSON.parse(atob(data));
                    language = receipt.language || "en";
                } else {
                    error = "No receipt data found";
                }
            } catch (e) {
                console.error("Failed to parse receipt data:", e);
                error = t[language].error;
            }
        }
    });
</script>

{#if error}
    <div class="text-red-500 p-4 text-center">{error}</div>
{:else if receipt}
    <div class="max-w-md mx-auto p-4">
        <div class="bg-white p-6 rounded-lg shadow">
            <div class="text-center mb-6">
                <h1 class="text-2xl font-bold mb-2">{receipt.storeName}</h1>
                <p class="text-gray-600">
                    {new Date(receipt.timestamp).toLocaleDateString(
                        language === "de" ? "de-DE" : "en-US",
                    )}
                    {new Date(receipt.timestamp).toLocaleTimeString(
                        language === "de" ? "de-DE" : "en-US",
                    )}
                </p>
                <p class="text-gray-600">
                    {t[language].cashier}: {receipt.cashierName}
                </p>
            </div>

            <div class="border-t border-b py-4 mb-4">
                {#each receipt.items as item}
                    <div class="flex justify-between py-1">
                        <span>{item.name[language]} × {item.quantity}</span>
                        <span
                            >{t[language].currency}{(
                                item.price * item.quantity
                            ).toFixed(2)}</span
                        >
                    </div>
                {/each}
            </div>

            <div class="font-bold text-lg flex justify-between mb-4">
                <span>{t[language].total}</span>
                <span>{t[language].currency}{receipt.total.toFixed(2)}</span>
            </div>

            <div class="text-gray-600">
                <p>
                    {t[language].paymentMethod}: {receipt.paymentMethod ===
                    "cash"
                        ? t[language].cash
                        : t[language].card}
                </p>
                {#if receipt.paymentMethod === "cash" && receipt.cashGiven}
                    <p>
                        {t[language].cashReceived}: {t[language]
                            .currency}{receipt.cashGiven.toFixed(2)}
                    </p>
                    <p>
                        {t[language].change}: {t[language]
                            .currency}{receipt.changeGiven?.toFixed(2)}
                    </p>
                {/if}
            </div>

            <div class="text-center mt-6 text-gray-600">
                <p>{t[language].thankYou}</p>
            </div>
        </div>
    </div>
{/if}
