<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import {
        BrowserMultiFormatReader,
        NotFoundException,
    } from "@zxing/library";

    export let isScanning = false;
    export let onScanSuccess: (barcode: string) => void;
    export let onScanError: (error: Error) => void;

    let videoElement: HTMLVideoElement;
    let codeReader: BrowserMultiFormatReader;
    let selectedDeviceId: string | undefined = undefined;
    let availableDevices: MediaDeviceInfo[] = [];
    let hasPermission = false;
    let errorMessage = "";

    onMount(async () => {
        try {
            // Check for camera permissions
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            stream.getTracks().forEach((track) => track.stop()); // Stop the stream after permission check
            hasPermission = true;

            // Initialize barcode reader
            codeReader = new BrowserMultiFormatReader();
            await loadDevices();
        } catch (error) {
            hasPermission = false;
            errorMessage =
                "Camera access denied. Please grant permission and reload.";
            onScanError(error as Error);
        }
    });

    onDestroy(() => {
        stopScanning();
    });

    async function loadDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            availableDevices = devices.filter(
                (device) => device.kind === "videoinput",
            );
            if (availableDevices.length > 0) {
                selectedDeviceId = availableDevices[0].deviceId;
            }
        } catch (error) {
            errorMessage = "Error loading cameras";
            onScanError(error as Error);
        }
    }

    async function startScanning() {
        if (!selectedDeviceId) {
            errorMessage = "No camera selected";
            return;
        }

        try {
            errorMessage = "";
            isScanning = true;
            await codeReader.decodeFromVideoDevice(
                selectedDeviceId,
                videoElement,
                (result, error) => {
                    if (result) {
                        // Play success sound
                        const audio = new Audio("/beep.mp3"); // Add a beep sound file to your public folder
                        audio.play().catch(() => {}); // Ignore audio play errors

                        onScanSuccess(result.getText());
                    }
                    if (error && error?.name !== "NotFoundException") {
                        onScanError(error);
                    }
                },
            );
        } catch (error) {
            errorMessage = "Failed to start scanner";
            onScanError(error as Error);
            isScanning = false;
        }
    }

    function stopScanning() {
        if (codeReader) {
            codeReader.reset();
            isScanning = false;
        }
    }
</script>

<div class="scanner-container space-y-4">
    {#if !hasPermission}
        <div
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
            {errorMessage}
        </div>
    {:else}
        <div class="camera-select">
            <select
                class="w-full p-2 border rounded"
                bind:value={selectedDeviceId}
                disabled={isScanning}
            >
                {#each availableDevices as device}
                    <option value={device.deviceId}>
                        {device.label || `Camera ${device.deviceId}`}
                    </option>
                {/each}
            </select>
        </div>

        <div class="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
                bind:this={videoElement}
                class="absolute inset-0 w-full h-full object-contain"
            />
            {#if isScanning}
                <div
                    class="absolute inset-0 border-2 border-red-500 opacity-50 pointer-events-none"
                >
                    <!-- Scanning guide lines -->
                    <div
                        class="absolute top-1/2 w-full border-t border-red-500"
                    />
                    <div
                        class="absolute left-1/2 h-full border-l border-red-500"
                    />
                    <!-- Corner markers -->
                    <div
                        class="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-red-500"
                    />
                    <div
                        class="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-red-500"
                    />
                    <div
                        class="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-red-500"
                    />
                    <div
                        class="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-red-500"
                    />
                </div>
            {/if}
        </div>

        {#if errorMessage}
            <div class="text-red-500 text-sm">{errorMessage}</div>
        {/if}

        <button
            class="w-full py-2 px-4 rounded {isScanning
                ? 'bg-red-500'
                : 'bg-blue-500'} text-white"
            on:click={isScanning ? stopScanning : startScanning}
        >
            {isScanning ? "Stop Scanning" : "Start Scanning"}
        </button>
    {/if}
</div>

<style>
    video {
        transform: scaleX(-1); /* Mirror the video feed */
    }
</style>
