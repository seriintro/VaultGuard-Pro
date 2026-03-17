import React from 'react';
import { findTimestampField, formatDate, formatTime } from '../../utils/dateUtils';

const LogsTable = ({ logs, filteredLogs }) => {
  if (filteredLogs.length === 0) {
    return <p>No logs found matching your search criteria.</p>;
  }

  const headerKeys = logs.length > 0
    ? Object.keys(logs[0]).filter((key) => !findTimestampField({ [key]: true }))
    : [];

  return (
    <table className="logs-table">
      <thead>
        <tr>
          {headerKeys.map((key) => (
            <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</th>
          ))}
          <th>Date</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {filteredLogs.map((log, index) => {
          const logData = { ...log };
          const timestampField = findTimestampField(logData);
          let dateStr = '';
          let timeStr = '';

          if (timestampField && logData[timestampField]) {
            const date = new Date(logData[timestampField]);
            if (!isNaN(date.getTime())) {
              dateStr = formatDate(logData[timestampField]);
              timeStr = formatTime(logData[timestampField]);
            } else {
              dateStr = timeStr = logData[timestampField];
            }
            delete logData[timestampField];
          }

          return (
            <tr key={index}>
              {Object.values(logData).map((val, idx) => (
                <td key={idx}>{val}</td>
              ))}
              <td>{dateStr}</td>
              <td>{timeStr}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default LogsTable;