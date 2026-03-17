import React, { useState } from 'react';

const PERMISSION_OPTIONS = [
  { key: 'gate1', label: 'Gate 1 Access' },
  { key: 'gate2', label: 'Gate 2 Access' },
  { key: 'vault', label: 'Vault Access' },
];

const CreateRoleForm = ({ onCreate }) => {
  const [newRole, setNewRole] = useState('');
  const [permissions, setPermissions] = useState({ gate1: false, gate2: false, vault: false });

  const handleCreate = () => {
    onCreate(newRole, permissions);
    setNewRole('');
    setPermissions({ gate1: false, gate2: false, vault: false });
  };

  const togglePermission = (key) =>
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="logs-container">
      <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h2>Create New Role</h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--secondary-text)' }}>
            Role Name
          </label>
          <input
            style={{
              width: '100%', padding: '8px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px', color: 'var(--text-color)',
            }}
            placeholder="Enter role name"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--secondary-text)' }}>
            Permissions
          </label>
          <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
            {PERMISSION_OPTIONS.map(({ key, label }) => (
              <label
                key={key}
                style={{
                  display: 'flex', alignItems: 'center', padding: '8px 12px',
                  borderRadius: '4px',
                  backgroundColor: permissions[key] ? 'rgba(0, 194, 178, 0.1)' : 'transparent',
                  border: `1px solid ${permissions[key] ? 'var(--button-bg)' : 'var(--border-color)'}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={permissions[key]}
                  onChange={() => togglePermission(key)}
                  style={{ marginRight: '10px' }}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <button
          style={{
            backgroundColor: 'var(--button-bg)', color: 'white', border: 'none',
            padding: '10px', borderRadius: '6px', cursor: 'pointer', width: '100%',
            fontWeight: '500', display: 'flex', justifyContent: 'center',
            alignItems: 'center', gap: '8px',
          }}
          onClick={handleCreate}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Role
        </button>
      </div>
    </div>
  );
};

export default CreateRoleForm;