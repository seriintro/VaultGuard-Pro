import { useState, useRef } from 'react';

const CAMERAS = [
  { id: 'main', name: 'Main Entrance' },
  { id: 'parking', name: 'Parking Lot' },
  { id: 'hallway', name: 'Main Hallway' },
  { id: 'backdoor', name: 'Back Door' },
];

const useSurveillance = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState('main');
  const [zoomLevel, setZoomLevel] = useState(1);
  const feedDisplayRef = useRef(null);
  const videoRef = useRef(null);

  const startStream = () => { setIsStreaming(true); setIsCameraOn(true); };
  const stopStream = () => { setIsStreaming(false); setIsCameraOn(false); };

  const takeScreenshot = () => {
    if (!isStreaming) return;
    const canvas = document.createElement('canvas');
    const video = document.querySelector('.live-feed-image');
    if (!video) return;
    canvas.width = video.width;
    canvas.height = video.height;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `surveillance-${selectedCamera}-${new Date().toISOString().slice(0, 19)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const zoomIn = () => setZoomLevel((z) => Math.min(3, z + 0.25));
  const zoomOut = () => setZoomLevel((z) => Math.max(1, z - 0.25));

  const toggleFullscreen = () => {
    if (!feedDisplayRef.current) return;
    if (!document.fullscreenElement) {
      feedDisplayRef.current.requestFullscreen().catch((err) =>
        console.error(`Fullscreen error: ${err.message}`)
      );
    } else {
      document.exitFullscreen?.();
    }
  };

  return {
    isStreaming,
    isCameraOn,
    selectedCamera,
    setSelectedCamera,
    zoomLevel,
    feedDisplayRef,
    videoRef,
    cameras: CAMERAS,
    startStream,
    stopStream,
    takeScreenshot,
    zoomIn,
    zoomOut,
    toggleFullscreen,
  };
};

export default useSurveillance;