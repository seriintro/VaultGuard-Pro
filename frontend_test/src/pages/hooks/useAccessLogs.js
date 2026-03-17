import { useState, useEffect } from 'react';
import axios from 'axios';

const useAccessLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLogs(logs);
      return;
    }

    const filtered = logs.filter((log) => {
      const values = Object.values(log);
      const timestampField = Object.keys(log).find(
        (key) => key.includes('time') || key.includes('date') || key === 'created_at'
      );
      if (timestampField && log[timestampField]) {
        const date = new Date(log[timestampField]);
        if (!isNaN(date.getTime())) {
          values.push(date.toLocaleDateString(), date.toLocaleTimeString());
        }
      }
      return values.some(
        (val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredLogs(filtered);
  }, [searchTerm, logs]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/access-logs');
      const reversed = [...res.data].reverse();
      setLogs(reversed);
      setFilteredLogs(reversed);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  return {
    logs,
    filteredLogs,
    searchTerm,
    setSearchTerm,
  };
};

export default useAccessLogs;