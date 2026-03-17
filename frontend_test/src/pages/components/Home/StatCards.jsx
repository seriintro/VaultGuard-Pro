import React from 'react';

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const ChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

export const StatCard = ({ title, value, icon = 'down' }) => (
  <div className="stat-card">
    <div className="stat-title">
      {title}
      {icon === 'down' ? <ChevronDown /> : <ChevronUp />}
    </div>
    <div className="stat-value">{value}</div>
  </div>
);

export const SecurityScoreCard = ({ score, color }) => (
  <div className="stat-card">
    <div className="stat-title">
      Security Score
      <ChevronUp />
    </div>
    <div className="stat-value" style={{ color }}>{score}/100</div>
    <div className="security-trend improving">Improving</div>
  </div>
);