import React from 'react';
import SidebarLayout from '../SidebarLayout';
import UserForm from './components/UserManagement/UserForm';
import UsersTable from './components/UserManagement/UsersTable';
import useUserManagement from './hooks/useUserManagement';
import '../UserManagement.css';

const AlertIcon = ({ type }) =>
  type === 'error' ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );

const UserManagement = () => {
  const {
    users, filteredUsers, roles, form, editMode,
    errorMessage, successMessage, searchQuery, isSubmitting,
    setSearchQuery, handleChange, handleFileChange,
    handleSubmit, handleEdit, handleDelete, resetForm,
  } = useUserManagement();

  return (
    <SidebarLayout title="User Management">
      <div className="user-management-container">
        {errorMessage && (
          <div className="alert alert-error">
            <AlertIcon type="error" />{errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success">
            <AlertIcon type="success" />{successMessage}
          </div>
        )}

        <UserForm
          form={form}
          editMode={editMode}
          roles={roles}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        <UsersTable
          users={users}
          filteredUsers={filteredUsers}
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClearSearch={setSearchQuery}
        />
      </div>
    </SidebarLayout>
  );
};

export default UserManagement;