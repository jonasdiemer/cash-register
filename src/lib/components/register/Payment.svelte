<script lang="ts">
    import Receipt from "./Receipt.svelte";
    import { cartStore } from "$lib/stores/cart";
    import { settingsStore } from "$lib/stores/settings";
    import { transactionStore } from "$lib/stores/transactions";
    import type { Transaction } from "$lib/types";
    import { _ } from "svelte-i18n";

    let paymentMethod: "cash" | "card" = "cash";
    let cashGiven = "";
    let showChangeModal = false;
    let change = 0;
    let completedTransaction: Transaction | null = null;

    $: total = cartStore.getTotal($cartStore);
    $: canProcessPayment =
        paymentMethod === "card" ||
        (paymentMethod === "cash" && Number(cashGiven) >= total);
    $: if (paymentMethod === "cash" && cashGiven) {
        change = Number(cashGiven) - total;
    }

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
            timestamp: new Date(), // Changed from Date.now()
            items: [...$cartStore],
            total,
            paymentMethod,
            cashGiven: paymentMethod === "cash" ? Number(cashGiven) : undefined,
            changeGiven: paymentMethod === "cash" ? change : undefined,
        };

        try {
            await transactionStore.addTransaction(transaction);
            completedTransaction = transaction;
            cartStore.clear();
            showChangeModal = false;
            cashGiven = "";
        } catch (error) {
            console.error("Failed to save transaction:", error);
        }
    }
</script>

<div class="payment">
    <h2 class="text-xl font-bold mb-4">{$_("register.payment.title")}</h2>

    <div class="space-y-4">
        <!-- Total Display -->
        <div class="text-2xl font-bold text-center p-4 bg-gray-100 rounded">
            {$_("register.payment.total")}: {$_(
                "register.payment.currency",
            )}{total.toFixed(2)}
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
                    💵 {$_("register.payment.cash")}
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
                    💳 {$_("register.payment.card")}
                </div>
            </label>
        </div>

        <!-- Cash Payment Input -->
        {#if paymentMethod === "cash"}
            <div class="space-y-2">
                <label class="block">
                    <span class="text-gray-700"
                        >{$_("register.payment.cashReceived")}</span
                    >
                    <input
                        type="number"
                        bind:value={cashGiven}
                        min={total}
                        step="0.01"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        placeholder={$_("register.payment.enterAmount")}
                    />
                </label>

                {#if Number(cashGiven) > 0}
                    <div class="text-right">
                        {$_("register.payment.changeDue")}: {$_(
                            "register.payment.currency",
                        )}{change.toFixed(2)}
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
            {$_("register.payment.processPayment")}
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
                {$_("register.payment.changeModal.title")}
            </h3>

            <div class="text-3xl font-bold text-center my-6">
                {$_("register.payment.currency")}{change.toFixed(2)}
            </div>

            <div class="space-y-2">
                <button
                    class="w-full py-2 px-4 bg-green-500 text-white rounded"
                    on:click={completeTransaction}
                >
                    {$_("register.payment.changeModal.completeSale")}
                </button>

                <button
                    class="w-full py-2 px-4 border border-gray-300 rounded"
                    on:click={() => (showChangeModal = false)}
                >
                    {$_("register.payment.changeModal.back")}
                </button>
            </div>
        </div>
    </div>
{/if}

<!-- Receipt Modal -->
{#if completedTransaction}
    <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
        <div
            class="bg-white p-6 rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">
                    {$_("register.payment.receipt")}
                </h3>
                <button
                    class="text-gray-500 hover:text-gray-700"
                    on:click={() => (completedTransaction = null)}
                >
                    ×
                </button>
            </div>

            <div class="border-t border-b py-4 my-4">
                <Receipt transaction={completedTransaction} />
            </div>

            <div class="flex justify-end mt-4">
                <button
                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    on:click={() => (completedTransaction = null)}
                >
                    {$_("register.payment.close")}
                </button>
            </div>
        </div>
    </div>
{/if}
