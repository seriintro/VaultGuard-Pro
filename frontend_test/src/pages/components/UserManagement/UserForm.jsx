import React from 'react';

const UserForm = ({
  form, editMode, roles, isSubmitting,
  onChange, onFileChange, onSubmit, onCancel,
}) => (
  <div className="form-section">
    <div className="section-title">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      {editMode ? 'Edit User' : 'Add New User'}
    </div>

    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="name">Username</label>
        <input id="name" name="name" value={form.name} onChange={onChange}
          placeholder="Enter username" className="input-field" required disabled={editMode} />
      </div>

      <div className="form-group">
        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={form.role} onChange={onChange}
          className="input-field select-field" required>
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" value={form.password}
          onChange={onChange}
          placeholder={editMode ? 'Leave unchanged or enter new password' : 'Enter password'}
          className="input-field" required={!editMode} />
      </div>

      {!editMode && (
        <div className="form-group">
          <label htmlFor="image">Face Image</label>
          <div className="file-input-wrapper">
            <input id="image" type="file" accept="image/jpeg,image/png"
              onChange={onFileChange} className="file-input" required />
            <small>Max size: 2MB</small>
          </div>
        </div>
      )}

      <div className="form-buttons">
        <button type="submit" className={`btn btn-primary ${isSubmitting ? 'btn-loading' : ''}`}
          disabled={isSubmitting}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {editMode
              ? <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              : <path d="M12 5v14M5 12h14" />}
          </svg>
          {isSubmitting ? 'Processing...' : editMode ? 'Update User' : 'Add User'}
        </button>

        {editMode && (
          <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isSubmitting}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Cancel
          </button>
        )}
      </div>
    </form>
  </div>
);

export default UserForm;