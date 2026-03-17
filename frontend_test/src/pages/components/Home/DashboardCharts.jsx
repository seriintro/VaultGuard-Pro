import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from 'recharts';

const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'var(--card-bg)',
    borderColor: 'var(--border-color)',
    color: 'var(--text-color)',
  },
};

const axisProps = {
  stroke: 'var(--secondary-text)',
  tick: { fill: 'var(--secondary-text)', fontSize: 12 },
};

export const AccessAttemptsChart = ({ data, isLoading }) => (
  <div className="chart-card">
    <h2>Access Attempts Over Time</h2>
    {isLoading ? (
      <div className="loading">Loading chart data...</div>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip {...tooltipStyle} />
          <Legend />
          <Line type="monotone" dataKey="granted" name="Granted" stroke="#00c2b2" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="denied" name="Denied" stroke="#ff6b6b" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    )}
  </div>
);

export const FaceRecognitionChart = ({ data, isLoading }) => (
  <div className="chart-card">
    <h2>Face Recognition Statistics</h2>
    {isLoading ? (
      <div className="loading">Loading chart data...</div>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip {...tooltipStyle} />
          <Legend />
          <Bar dataKey="count" name="Faces" fill="#4d79ff" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>
);

export const HeatmapChart = ({ data, isLoading }) => (
  <div className="chart-container full-width">
    <div className="chart-card">
      <h2>User Activity Heatmap</h2>
      {isLoading ? (
        <div className="loading">Loading heatmap data...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="hour" {...axisProps}
              label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5, fill: 'var(--secondary-text)' }}
            />
            <YAxis {...axisProps}
              label={{ value: 'Access Attempts', angle: -90, position: 'insideLeft', fill: 'var(--secondary-text)' }}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(value, name) => [`${value} attempts`, name]}
              labelFormatter={(label) => `Hour: ${label}:00`}
            />
            <Legend />
            <Area type="monotone" dataKey="Gate 1" stackId="1" stroke="#00c2b2" fill="#00c2b2" fillOpacity={0.6} />
            <Area type="monotone" dataKey="Gate 2" stackId="1" stroke="#4d79ff" fill="#4d79ff" fillOpacity={0.6} />
            <Area type="monotone" dataKey="Vault" stackId="1" stroke="#ffc107" fill="#ffc107" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>
);