import React, { useMemo } from 'react';
import SidebarLayout from '../SidebarLayout';
import { StatCard, SecurityScoreCard } from './components/Home/StatCards';
import { AccessAttemptsChart, FaceRecognitionChart, HeatmapChart } from './components/Home/DashboardCharts';
import ActivityFeed from './components/Home/ActivityFeed';
import useDashboard from './hooks/useDashboard';
import { getScoreColor } from './utils/securityUtils';
import '../Home.css';

function Home() {
  const {
    userCount, roleCount, accessData, faceData,
    recentActivity, securityScore, heatmapData, isLoading,
  } = useDashboard();

  const scoreColor = useMemo(() => getScoreColor(securityScore.score), [securityScore.score]);

  return (
    <SidebarLayout title="Admin Dashboard">
      <div className="badge">Free</div>

      <div className="stats-container">
        <StatCard title="User Count" value={userCount} />
        <StatCard title="Role Count" value={roleCount} />
      </div>

      <div className="dashboard-row">
        <AccessAttemptsChart data={accessData} isLoading={isLoading} />
        <FaceRecognitionChart data={faceData} isLoading={isLoading} />
      </div>

      <div className="stats-container">
        <SecurityScoreCard score={securityScore.score} color={scoreColor} />
      </div>

      <ActivityFeed activities={recentActivity} isLoading={isLoading} />

      <HeatmapChart data={heatmapData} isLoading={isLoading} />
    </SidebarLayout>
  );
}

export default Home;