import React from 'react';

const FeedDisplay = ({
  isStreaming, isCameraOn, selectedCamera, cameras, zoomLevel,
  feedDisplayRef, videoRef,
  onScreenshot, onZoomIn, onZoomOut, onFullscreen,
}) => {
  const cameraName = cameras.find((c) => c.id === selectedCamera)?.name;

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h2>Live Feed: {cameraName}</h2>
        <div className="feed-status">
          {isCameraOn && (
            <div className="recording-indicator">
              <div className="rec-circle" />
              <span>REC</span>
            </div>
          )}
          <div className="timestamp">
            {new Date().toLocaleTimeString()} - {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="feed-display" ref={feedDisplayRef}>
        {isStreaming ? (
          <img
            ref={videoRef}
            src={`http://localhost:5000/live_feed?camera=${selectedCamera}`}
            alt="Live Surveillance"
            className="live-feed-image"
            style={{ transform: `scale(${zoomLevel})` }}
          />
        ) : (
          <div className="no-feed">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-text)" strokeWidth="1.5">
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
              <line x1="12" y1="2" x2="12" y2="12" />
            </svg>
            <p>Stream stopped. Click &quot;Start Camera&quot; to view the live feed.</p>
          </div>
        )}
      </div>

      <div className="feed-footer">
        <div className="feed-controls">
          {[
            { title: 'Take Screenshot', onClick: onScreenshot, disabled: !isStreaming,
              icon: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></> },
            { title: 'Zoom In', onClick: onZoomIn, disabled: !isStreaming || zoomLevel >= 3,
              icon: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></> },
            { title: 'Zoom Out', onClick: onZoomOut, disabled: !isStreaming || zoomLevel <= 1,
              icon: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></> },
            { title: 'Full Screen', onClick: onFullscreen, disabled: !isStreaming,
              icon: <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/> },
          ].map(({ title, onClick, disabled, icon }) => (
            <button key={title} className="icon-control" title={title} onClick={onClick} disabled={disabled}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-color)" strokeWidth="2">
                {icon}
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedDisplay;