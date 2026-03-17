import React, { useState } from 'react';

const darkSelectStyles = {
  width: '100%', padding: '8px 12px',
  backgroundColor: '#1e1e2f',
  border: '1px solid var(--border-color)',
  borderRadius: '4px', color: 'var(--text-color)',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
  backgroundSize: '16px', paddingRight: '32px', cursor: 'pointer',
};

const darkOptionStyles = { backgroundColor: '#1e1e2f', color: 'var(--text-color)' };

const AssignRoleForm = ({ users, roles, onAssign }) => {
  const [assignData, setAssignData] = useState({ username: '', role: '' });

  const handleAssign = () => {
    onAssign(assignData);
    setAssignData({ username: '', role: '' });
  };

  return (
    <div className="logs-container">
      <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h2>Assign Role to User</h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--secondary-text)' }}>
            Username
          </label>
          <select style={darkSelectStyles} value={assignData.username}
            onChange={(e) => setAssignData({ ...assignData, username: e.target.value })}>
            <option value="" style={darkOptionStyles}>Select user</option>
            {users.map((user) => (
              <option key={user.name} value={user.name} style={darkOptionStyles}>{user.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--secondary-text)' }}>
            Role to Assign
          </label>
          <select style={darkSelectStyles} value={assignData.role}
            onChange={(e) => setAssignData({ ...assignData, role: e.target.value })}>
            <option value="" style={darkOptionStyles}>Select role</option>
            {Object.keys(roles).map((role) => (
              <option key={role} value={role} style={darkOptionStyles}>{role}</option>
            ))}
          </select>
        </div>

        <button
          style={{
            backgroundColor: 'var(--button-bg)', color: 'white', border: 'none',
            padding: '10px', borderRadius: '6px', cursor: 'pointer', width: '100%',
            fontWeight: '500', display: 'flex', justifyContent: 'center',
            alignItems: 'center', gap: '8px',
          }}
          onClick={handleAssign}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          Assign Role
        </button>
      </div>
    </div>
  );
};

export default AssignRoleForm;