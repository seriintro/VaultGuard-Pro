import React from 'react';
import SidebarLayout from '../SidebarLayout';
import ControlPanel from './components/Surveillance/ControlPanel';
import FeedDisplay from './components/Surveillance/FeedDisplay';
import useSurveillance from './hooks/useSurveillance';
import './components/Surveillance/Surveillance.css';
const Surveillance = () => {
  const {
    isStreaming, isCameraOn, selectedCamera, setSelectedCamera,
    zoomLevel, feedDisplayRef, videoRef, cameras,
    startStream, stopStream, takeScreenshot, zoomIn, zoomOut, toggleFullscreen,
  } = useSurveillance();

  return (
    <SidebarLayout title="Surveillance">
      <div className="surveillance-container">
        <ControlPanel
          isCameraOn={isCameraOn}
          selectedCamera={selectedCamera}
          cameras={cameras}
          zoomLevel={zoomLevel}
          onStart={startStream}
          onStop={stopStream}
          onCameraChange={setSelectedCamera}
        />
        <FeedDisplay
          isStreaming={isStreaming}
          isCameraOn={isCameraOn}
          selectedCamera={selectedCamera}
          cameras={cameras}
          zoomLevel={zoomLevel}
          feedDisplayRef={feedDisplayRef}
          videoRef={videoRef}
          onScreenshot={takeScreenshot}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onFullscreen={toggleFullscreen}
        />
      </div>
    </SidebarLayout>
  );
};

export default Surveillance;