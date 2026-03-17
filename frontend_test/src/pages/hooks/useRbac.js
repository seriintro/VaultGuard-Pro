import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../constants/api';

const useRbac = () => {
  const [roles, setRoles] = useState({});
  const [users, setUsers] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRoles(roles);
    } else {
      const filtered = {};
      Object.entries(roles).forEach(([role, perms]) => {
        if (role.toLowerCase().includes(searchTerm.toLowerCase())) {
          filtered[role] = perms;
        }
      });
      setFilteredRoles(filtered);
    }
  }, [searchTerm, roles]);

  const fetchData = async () => {
    try {
      const [rolesRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}${ENDPOINTS.ROLES}`),
        axios.get(`${API_BASE_URL}${ENDPOINTS.USERS}`),
      ]);
      setRoles(rolesRes.data);
      setFilteredRoles(rolesRes.data);
      setUsers(usersRes.data);
      const roleCount = Object.keys(rolesRes.data).length;
      localStorage.setItem('roleCount', roleCount);
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error fetching RBAC data:', err);
    }
  };

  const createRole = async (newRole, permissions) => {
    if (!newRole.trim()) return;
    const permissionFlags = [];
    if (permissions.gate1) permissionFlags.push('access_gate1');
    if (permissions.gate2) permissionFlags.push('access_gate2');
    if (permissions.vault) permissionFlags.push('access_vault');
    try {
      await axios.post(`${API_BASE_URL}${ENDPOINTS.ROLES}`, {
        role: newRole,
        permissions: permissionFlags,
      });
      await fetchData();
    } catch (err) {
      console.error('Error creating role:', err);
    }
  };

  const assignRole = async (assignData) => {
    if (!assignData.username.trim() || !assignData.role.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}${ENDPOINTS.ASSIGN_ROLE}`, assignData);
      await fetchData();
    } catch (err) {
      console.error('Error assigning role:', err);
    }
  };

  const deleteRole = async (roleName) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}${ENDPOINTS.ROLES}/${roleName}`);
      alert(response.data.message || `Role ${roleName} deleted successfully`);
      await fetchData();
    } catch (err) {
      console.error('Error deleting role:', err);
      const msg =
        err.response?.data?.message || `Failed to delete role ${roleName}. Please try again.`;
      alert(msg);
    }
  };

  return {
    roles,
    users,
    filteredRoles,
    searchTerm,
    setSearchTerm,
    createRole,
    assignRole,
    deleteRole,
  };
};

export default useRbac;