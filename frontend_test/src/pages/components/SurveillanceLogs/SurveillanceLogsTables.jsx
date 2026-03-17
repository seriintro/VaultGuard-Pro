import React from 'react';
import { formatDate, formatTime } from '../../utils/dateUtils';

export const RecognizedTable = ({ logs }) =>
  logs.length > 0 ? (
    <table className="logs-table">
      <thead>
        <tr><th>Date</th><th>Time</th><th>Name</th><th>Camera ID</th><th>Confidence</th></tr>
      </thead>
      <tbody>
        {logs.map((log, i) => (
          <tr key={i}>
            <td>{formatDate(log.timestamp)}</td>
            <td>{formatTime(log.timestamp)}</td>
            <td>{log.name || 'Unknown'}</td>
            <td>{log.camera_id || 'N/A'}</td>
            <td>{log.confidence ? `${(log.confidence * 100).toFixed(2)}%` : 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : <p>No recognized face logs found matching your search.</p>;

export const UnrecognizedTable = ({ logs }) =>
  logs.length > 0 ? (
    <table className="logs-table">
      <thead>
        <tr><th>Date</th><th>Time</th><th>Camera ID</th><th>Alert Level</th></tr>
      </thead>
      <tbody>
        {logs.map((log, i) => (
          <tr key={i}>
            <td>{formatDate(log.timestamp)}</td>
            <td>{formatTime(log.timestamp)}</td>
            <td>{log.camera_id || 'N/A'}</td>
            <td>{log.alert_level || 'Low'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : <p>No unrecognized face logs found matching your search.</p>;