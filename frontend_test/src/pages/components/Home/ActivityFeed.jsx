import React from 'react';

const formatActivityStatus = (status) => {
  if (status.includes('First Authentication') || status.includes('Second Authentication')) {
    return <span className="activity-status authentication">{status}</span>;
  }
  if (status.toLowerCase().includes('granted')) {
    return (
      <span className="activity-status success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        {status}
      </span>
    );
  }
  return (
    <span className="activity-status failure">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
      {status}
    </span>
  );
};

const ActivityFeed = ({ activities, isLoading }) => (
  <div className="activity-feed-container">
    <div className="activity-feed-card">
      <h2>Recent Activity</h2>
      {isLoading ? (
        <div className="loading">Loading activity feed...</div>
      ) : (
        <div className="activity-feed no-scroll">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-header">
                  <span className="activity-name">{activity.name}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
                <div className="activity-details">
                  <span className="activity-role">{activity.role}</span>
                  <span className="activity-gate">{activity.gate}</span>
                  {formatActivityStatus(activity.status)}
                </div>
              </div>
            ))
          ) : (
            <div className="no-activity">No recent activity</div>
          )}
        </div>
      )}
    </div>
  </div>
);

export default ActivityFeed;