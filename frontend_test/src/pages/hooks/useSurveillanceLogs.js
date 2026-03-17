import { useState, useEffect } from 'react';
import axios from 'axios';

const useSurveillanceLogs = () => {
  const [logs, setLogs] = useState({ recognized: [], unrecognized: [] });
  const [filteredLogs, setFilteredLogs] = useState({ recognized: [], unrecognized: [] });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLogs(logs);
      return;
    }
    const lower = searchTerm.toLowerCase();

    const filterLog = (log) => {
      const date = new Date(log.timestamp);
      return (
        (log.name && log.name.toLowerCase().includes(lower)) ||
        date.toLocaleDateString().includes(searchTerm) ||
        date.toLocaleTimeString().includes(searchTerm) ||
        date.getFullYear().toString().includes(searchTerm)
      );
    };

    setFilteredLogs({
      recognized: logs.recognized.filter(filterLog),
      unrecognized: logs.unrecognized.filter((log) => {
        const date = new Date(log.timestamp);
        return (
          date.toLocaleDateString().includes(searchTerm) ||
          date.toLocaleTimeString().includes(searchTerm) ||
          date.getFullYear().toString().includes(searchTerm)
        );
      }),
    });
  }, [searchTerm, logs]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/surveillance-logs');
      setLogs(res.data);
      setFilteredLogs(res.data);
    } catch (err) {
      console.error('Error fetching surveillance logs:', err);
    }
  };

  return { filteredLogs, searchTerm, setSearchTerm };
};

export default useSurveillanceLogs;