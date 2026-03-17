import React from 'react';
import PermissionCell from '../shared/PermissionCell';

const RolesTable = ({ filteredRoles, onDelete }) => {
  if (Object.keys(filteredRoles).length === 0) {
    return <p>No roles found matching your search criteria.</p>;
  }

  return (
    <table className="logs-table">
      <thead>
        <tr>
          <th>Role Name</th>
          <th>Gate 1 Access</th>
          <th>Gate 2 Access</th>
          <th>Vault Access</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(filteredRoles).map(([role, perms]) => (
          <tr key={role}>
            <td>{role}</td>
            <td><PermissionCell enabled={perms.gate1} /></td>
            <td><PermissionCell enabled={perms.gate2} /></td>
            <td><PermissionCell enabled={perms.vault} /></td>
            <td>
              <button
                onClick={() => onDelete(role)}
                style={{
                  backgroundColor: 'rgba(220, 53, 69, 0.1)',
                  color: '#dc3545',
                  border: '1px solid #dc3545',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RolesTable;