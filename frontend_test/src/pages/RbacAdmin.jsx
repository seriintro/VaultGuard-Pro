import React, { useState } from 'react';
import SidebarLayout from '../SidebarLayout';
import SearchBar from './components/shared/SearchBar';
import RolesTable from './components/RbacAdmin/RolesTable';
import CreateRoleForm from './components/RbacAdmin/CreateRoleForm';
import AssignRoleForm from './components/RbacAdmin/AssignRoleForm';
import useRbac from './hooks/useRbac';

const TABS = [
  { id: 'roles', label: 'Roles & Permissions' },
  { id: 'createRole', label: 'Create New Role' },
  { id: 'assignRole', label: 'Assign Roles' },
];

const RbacAdmin = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const {
    roles, users, filteredRoles, searchTerm, setSearchTerm,
    createRole, assignRole, deleteRole,
  } = useRbac();

  return (
    <SidebarLayout title="RBAC Admin Console">
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClear={() => setSearchTerm('')}
        placeholder="Search roles"
      />

      <div className="tab-navigation">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`tab-button ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'roles' && (
        <div className="logs-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2>Role Management</h2>
          </div>
          <RolesTable filteredRoles={filteredRoles} onDelete={deleteRole} />
        </div>
      )}

      {activeTab === 'createRole' && (
        <CreateRoleForm onCreate={createRole} />
      )}

      {activeTab === 'assignRole' && (
        <AssignRoleForm users={users} roles={roles} onAssign={assignRole} />
      )}
    </SidebarLayout>
  );
};

export default RbacAdmin;