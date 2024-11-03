<script lang="ts">
    import { cartStore } from "$lib/stores/cart";
    import { settingsStore } from "$lib/stores/settings";
    import { transactionStore } from "$lib/stores/transactions"; // Add this import

    let paymentMethod: "cash" | "card" = "cash";
    let cashGiven = "";
    let showChangeModal = false;
    let change = 0;

    $: total = cartStore.getTotal($cartStore);
    $: language = $settingsStore.language;
    $: canProcessPayment =
        paymentMethod === "card" ||
        (paymentMethod === "cash" && Number(cashGiven) >= total);
    $: if (paymentMethod === "cash" && cashGiven) {
        change = Number(cashGiven) - total;
    }

    const t = {
        en: {
            payment: "Payment",
            total: "Total",
            cash: "Cash",
            card: "Card",
            cashReceived: "Cash Received",
            enterAmount: "Enter amount",
            changeDue: "Change due",
            processPayment: "Process Payment",
            changeModal: {
                title: "Change Due",
                completeSale: "Complete Sale",
                back: "Back",
            },
            currency: "$",
        },
        de: {
            payment: "Zahlung",
            total: "Gesamt",
            cash: "Bar",
            card: "Karte",
            cashReceived: "Bargeld erhalten",
            enterAmount: "Betrag eingeben",
            changeDue: "Rückgeld",
            processPayment: "Zahlung verarbeiten",
            changeModal: {
                title: "Rückgeld",
                completeSale: "Verkauf abschließen",
                back: "Zurück",
            },
            currency: "€",
        },
    };

    function handlePayment() {
        if (!canProcessPayment) return;

        if (paymentMethod === "cash") {
            showChangeModal = true;
        } else {
            completeTransaction();
        }
    }

    async function completeTransaction() {
        const transaction = {
            timestamp: Date.now(),
            items: [...$cartStore],
            total,
            paymentMethod,
            cashReceived:
                paymentMethod === "cash" ? Number(cashGiven) : undefined,
            change: paymentMethod === "cash" ? change : undefined,
        };

        try {
            await transactionStore.addTransaction(transaction);
            cartStore.clear();
            showChangeModal = false;
            cashGiven = "";
        } catch (error) {
            console.error("Failed to save transaction:", error);
            // Handle error appropriately
        }
    }
</script>

<div class="payment">
    <h2 class="text-xl font-bold mb-4">{t[language].payment}</h2>

    <div class="space-y-4">
        <!-- Total Display -->
        <div class="text-2xl font-bold text-center p-4 bg-gray-100 rounded">
            {t[language].total}: {t[language].currency}{total.toFixed(2)}
        </div>

        <!-- Payment Method Selection -->
        <div class="flex gap-4">
            <label class="flex-1">
                <input
                    type="radio"
                    bind:group={paymentMethod}
                    value="cash"
                    class="sr-only peer"
                />
                <div
                    class="text-center p-4 border rounded cursor-pointer peer-checked:bg-blue-50 peer-checked:border-blue-500"
                >
                    💵 {t[language].cash}
                </div>
            </label>

            <label class="flex-1">
                <input
                    type="radio"
                    bind:group={paymentMethod}
                    value="card"
                    class="sr-only peer"
                />
                <div
                    class="text-center p-4 border rounded cursor-pointer peer-checked:bg-blue-50 peer-checked:border-blue-500"
                >
                    💳 {t[language].card}
                </div>
            </label>
        </div>

        <!-- Cash Payment Input -->
        {#if paymentMethod === "cash"}
            <div class="space-y-2">
                <label class="block">
                    <span class="text-gray-700">{t[language].cashReceived}</span
                    >
                    <input
                        type="number"
                        bind:value={cashGiven}
                        min={total}
                        step="0.01"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        placeholder={t[language].enterAmount}
                    />
                </label>

                {#if Number(cashGiven) > 0}
                    <div class="text-right">
                        {t[language].changeDue}: {t[language]
                            .currency}{change.toFixed(2)}
                    </div>
                {/if}
            </div>
        {/if}

        <!-- Process Payment Button -->
        <button
            class="w-full py-3 px-4 bg-green-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canProcessPayment || $cartStore.length === 0}
            on:click={handlePayment}
        >
            {t[language].processPayment}
        </button>
    </div>
</div>

<!-- Change Modal -->
{#if showChangeModal}
    <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
        <div class="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 class="text-xl font-bold mb-4">
                {t[language].changeModal.title}
            </h3>

            <div class="text-3xl font-bold text-center my-6">
                {t[language].currency}{change.toFixed(2)}
            </div>

            <div class="space-y-2">
                <button
                    class="w-full py-2 px-4 bg-green-500 text-white rounded"
                    on:click={completeTransaction}
                >
                    {t[language].changeModal.completeSale}
                </button>

                <button
                    class="w-full py-2 px-4 border border-gray-300 rounded"
                    on:click={() => (showChangeModal = false)}
                >
                    {t[language].changeModal.back}
                </button>
            </div>
        </div>
    </div>
{/if}
