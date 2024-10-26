<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { BrowserMultiFormatReader } from '@zxing/library';
  
  export let isScanning = false;
  export let onScanSuccess: (barcode: string) => void;
  export let onScanError: (error: Error) => void;

  let videoElement: HTMLVideoElement;
  let codeReader: BrowserMultiFormatReader;
  let selectedDeviceId: string | undefined = undefined;
  let availableDevices: MediaDeviceInfo[] = [];

  onMount(async () => {
    try {
      codeReader = new BrowserMultiFormatReader();
      await loadDevices();
    } catch (error) {
      onScanError(error as Error);
    }
  });

  onDestroy(() => {
    if (codeReader) {
      codeReader.reset();
    }
  });

  async function loadDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      availableDevices = devices.filter(device => device.kind === 'videoinput');
      if (availableDevices.length > 0) {
        selectedDeviceId = availableDevices[0].deviceId;
      }
    } catch (error) {
      onScanError(error as Error);
    }
  }

  async function startScanning() {
    if (!selectedDeviceId) return;
    
    try {
      isScanning = true;
      await codeReader.decodeFromVideoDevice(
        selectedDeviceId, 
        videoElement,
        (result, error) => {
          if (result) {
            onScanSuccess(result.getText());
          }
          if (error && error?.name !== 'NotFoundException') {
            onScanError(error);
          }
        }
      );
    } catch (error) {
      onScanError(error as Error);
      isScanning = false;
    }
  }

  function stopScanning() {
    codeReader.reset();
    isScanning = false;
  }
</script>

<div class="scanner-container space-y-4">
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
    <div class="absolute inset-0 border-2 border-red-500 opacity-50 pointer-events-none" />
  </div>

  <button
    class="w-full py-2 px-4 rounded {isScanning ? 'bg-red-500' : 'bg-blue-500'} text-white"
    on:click={isScanning ? stopScanning : startScanning}
  >
    {isScanning ? 'Stop Scanning' : 'Start Scanning'}
  </button>
</div>
