import React from 'react';

const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : '?');

const getRoleBadgeClass = (role) => {
  const base = 'role-badge';
  switch (role.toLowerCase()) {
    case 'admin': return `${base} role-admin`;
    case 'employee': return `${base} role-user`;
    case 'visitor': return `${base} role-guest`;
    default: return base;
  }
};

const UsersTable = ({
  users, filteredUsers, searchQuery, onEdit, onDelete, onClearSearch,
}) => (
  <div className="table-container">
    <div className="table-header">
      <div className="table-title">All Users ({filteredUsers.length})</div>
      <div className="search-container">
        <span className="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input type="text" placeholder="Search users..." className="search-input"
          value={searchQuery} onChange={(e) => onClearSearch(e.target.value)} />
      </div>
    </div>

    {filteredUsers.length > 0 ? (
      <>
        <table className="user-table">
          <thead>
            <tr><th>User</th><th>Role</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.name}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">{getInitial(user.name)}</div>
                    {user.name}
                  </div>
                </td>
                <td><span className={getRoleBadgeClass(user.role)}>{user.role}</span></td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => onEdit(user)} className="btn btn-xs btn-warning">Edit</button>
                    <button onClick={() => onDelete(user.name)} className="btn btn-xs btn-danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <div className="pagination-text">Showing {filteredUsers.length} of {users.length} users</div>
          <button className="pagination-btn pagination-btn-active">1</button>
        </div>
      </>
    ) : (
      <div className="empty-state">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <div className="empty-state-text">No users found</div>
        {searchQuery && <div className="empty-state-subtext">Try a different search term</div>}
      </div>
    )}
  </div>
);

export default UsersTable;