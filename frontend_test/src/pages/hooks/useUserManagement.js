import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ name: '', role: '', password: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/users');
      setUsers(res.data);
      setFilteredUsers(res.data);
      localStorage.setItem('userCount', res.data.length);
    } catch {
      setErrorMessage('Failed to load users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await apiClient.get('/roles');
      setRoles(Object.keys(res.data));
    } catch {
      setErrorMessage('Failed to load roles. Some features may be limited.');
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    const timer = setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [fetchUsers, fetchRoles]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, users]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 2MB');
      e.target.value = null;
      return;
    }
    setSelectedFile(file);
  };

  const resetForm = () => {
    setForm({ name: '', role: '', password: '' });
    setSelectedFile(null);
    setEditMode(false);
    setSelectedUser(null);
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (editMode) {
        await apiClient.put(`/users/${selectedUser}`, form);
        setSuccessMessage(`User ${selectedUser} updated successfully`);
        await fetchUsers();
        resetForm();
        return;
      }

      if (!selectedFile) {
        setErrorMessage('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const base64Image = ev.target.result.split(',')[1];
          await apiClient.post('/users', {
            name: form.name,
            role: form.role,
            password: form.password,
            image: base64Image,
          });
          setSuccessMessage('User created successfully');
          await fetchUsers();
          resetForm();
        } catch (err) {
          setErrorMessage(err.response?.data?.message || 'Failed to create user');
        } finally {
          setIsSubmitting(false);
        }
      };
      reader.onerror = () => {
        setErrorMessage('Failed to read image file');
        setIsSubmitting(false);
      };
      reader.readAsDataURL(selectedFile);
      return;
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, role: user.role, password: '********' });
    setEditMode(true);
    setSelectedUser(user.name);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleDelete = async (username) => {
    try {
      await apiClient.delete(`/users/${username}`);
      setSuccessMessage(`User ${username} deleted successfully`);
      await fetchUsers();
    } catch {
      setErrorMessage('Failed to delete user');
    }
  };

  return {
    users,
    filteredUsers,
    roles,
    form,
    editMode,
    errorMessage,
    successMessage,
    searchQuery,
    isSubmitting,
    isLoading,
    setSearchQuery,
    handleChange,
    handleFileChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
  };
};

export default useUserManagement;