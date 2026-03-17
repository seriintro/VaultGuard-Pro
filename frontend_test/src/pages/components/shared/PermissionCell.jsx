import React from 'react';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    style={{ verticalAlign: 'middle', marginRight: '5px' }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    style={{ verticalAlign: 'middle', marginRight: '5px' }}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PermissionCell = ({ enabled }) =>
  enabled ? (
    <span style={{ color: 'var(--button-bg)' }}>
      <CheckIcon />Enabled
    </span>
  ) : (
    <span style={{ color: 'var(--secondary-text)' }}>
      <XIcon />Disabled
    </span>
  );

export default PermissionCell;