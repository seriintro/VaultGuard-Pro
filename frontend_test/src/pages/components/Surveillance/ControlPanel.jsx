import React from 'react';

const ControlPanel = ({
  isCameraOn, selectedCamera, cameras, zoomLevel,
  onStart, onStop, onCameraChange,
}) => (
  <div className="control-panel">
    <div className="control-section">
      <h3>Camera Controls</h3>
      <div className="button-group">
        <button onClick={onStart} disabled={isCameraOn}
          className={`control-button ${isCameraOn ? 'disabled' : 'primary'}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
          </svg>
          Start Camera
        </button>
        <button onClick={onStop} disabled={!isCameraOn}
          className={`control-button ${!isCameraOn ? 'disabled' : 'danger'}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><rect x="9" y="9" width="6" height="6" />
          </svg>
          Stop Camera
        </button>
      </div>
    </div>

    <div className="control-section">
      <h3>Camera Selection</h3>
      <div className="select-wrapper">
        <select value={selectedCamera} onChange={(e) => onCameraChange(e.target.value)} className="camera-select">
          {cameras.map((cam) => (
            <option key={cam.id} value={cam.id}>{cam.name}</option>
          ))}
        </select>
        <div className="select-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>

    <div className="control-section">
      <h3>Stream Status</h3>
      <div className="status-indicator">
        <div className={`status-circle ${isCameraOn ? 'active' : 'inactive'}`} />
        <span className="status-text">{isCameraOn ? 'Streaming' : 'Offline'}</span>
      </div>
    </div>

    <div className="control-section">
      <h3>Zoom Level</h3>
      <div className="zoom-level">
        <span>{(zoomLevel * 100).toFixed(0)}%</span>
      </div>
    </div>
  </div>
);

export default ControlPanel;