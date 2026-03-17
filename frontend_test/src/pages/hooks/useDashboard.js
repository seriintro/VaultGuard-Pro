import { useState, useEffect } from 'react';
import {
  processAccessLogs,
  calculateSecurityScore,
  adjustScoreWithSurveillance,
  generateHeatmapData,
} from '../utils/securityUtils';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const useDashboard = () => {
  const [userCount, setUserCount] = useState(
    parseInt(localStorage.getItem('userCount')) || 0
  );
  const [roleCount, setRoleCount] = useState(
    parseInt(localStorage.getItem('roleCount')) || 0
  );
  const [accessData, setAccessData] = useState([]);
  const [faceData, setFaceData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [securityScore, setSecurityScore] = useState({ score: 0, trend: 'improving' });
  const [heatmapData, setHeatmapData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        await Promise.all([
          fetchUserCount(),
          fetchRoleCount(),
          fetchAccessLogs(),
          fetchSurveillanceLogs(),
        ]);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();

    const handleStorageChange = (e) => {
      if (e.key === 'userCount' || e.key === null) {
        const val = localStorage.getItem('userCount');
        if (val) setUserCount(parseInt(val));
      }
      if (e.key === 'roleCount' || e.key === null) {
        const val = localStorage.getItem('roleCount');
        if (val) setRoleCount(parseInt(val));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchUserCount = async () => {
    const res = await fetch(`${API_BASE_URL}/users`);
    const data = await res.json();
    setUserCount(data.length);
    localStorage.setItem('userCount', data.length);
  };

  const fetchRoleCount = async () => {
    const res = await fetch(`${API_BASE_URL}/roles`);
    const data = await res.json();
    const count = Object.keys(data).length;
    setRoleCount(count);
    localStorage.setItem('roleCount', count);
  };

  const fetchAccessLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/access-logs`);
      const data = await res.json();
      setAccessData(processAccessLogs(data));
      setRecentActivity(
        [...data].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)
      );
      const score = calculateSecurityScore(data);
      setSecurityScore((prev) => ({ ...prev, score }));
      setHeatmapData(generateHeatmapData(data));
    } catch (err) {
      console.error('Error fetching access logs:', err);
      setAccessData([]);
      setRecentActivity([]);
    }
  };

  const fetchSurveillanceLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/surveillance-logs`);
      const data = await res.json();
      const recognized = data.recognized.length;
      const unrecognized = data.unrecognized.length;
      setFaceData([
        { name: 'Recognized', count: recognized },
        { name: 'Unrecognized', count: unrecognized },
      ]);
      setSecurityScore((prev) => ({
        score: adjustScoreWithSurveillance(prev.score, recognized, unrecognized),
        trend: 'improving',
      }));
    } catch (err) {
      console.error('Error fetching surveillance logs:', err);
      setFaceData([
        { name: 'Recognized', count: 0 },
        { name: 'Unrecognized', count: 0 },
      ]);
    }
  };

  return {
    userCount,
    roleCount,
    accessData,
    faceData,
    recentActivity,
    securityScore,
    heatmapData,
    isLoading,
  };
};

export default useDashboard;