export async function getAvailableCameras(): Promise<MediaDeviceInfo[]> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Error getting cameras:', error);
    return [];
  }
}

export async function initializeCamera(deviceId?: string): Promise<MediaStream> {
  const constraints: MediaStreamConstraints = {
    video: deviceId ? { deviceId: { exact: deviceId } } : true
  };
  
  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.error('Error initializing camera:', error);
    throw error;
  }
}

export function stopCamera(stream: MediaStream) {
  stream.getTracks().forEach(track => track.stop());
}
