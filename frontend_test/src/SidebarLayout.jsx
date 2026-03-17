import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import NotificationsComponent from './NotificationsComponent';
import './Home.css';

function SidebarLayout({ children, title }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon" onClick={navigateToHome} style={{ cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3a9 9 0 0 0 0 18 9 9 0 0 0 0-18z"></path>
              <path d="M12 12v.01"></path>
              <path d="M12 8v.01"></path>
              <path d="M12 16v.01"></path>
            </svg>
          </div>
          <div className="desktop-toggle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
        </div>

        <div className="search-bar">
          <span className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input type="text" placeholder="Search..." />
        </div>

        <div className={`nav-item ${window.location.pathname === '/rbac' ? 'active' : ''}`} 
          onClick={() => navigate('/rbac')}>
          <span className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path>
            </svg>
          </span>
          <span>RBAC Admin Console</span>
        </div>

        <div className={`nav-item ${window.location.pathname === '/logs' ? 'active' : ''}`}
          onClick={() => navigate('/logs')}>
          <span className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </span>
          <span>Access Logs</span>
        </div>

        <div className={`nav-item ${window.location.pathname === '/users' ? 'active' : ''}`}
          onClick={() => navigate('/users')}>
          <span className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </span>
          <span>User Management</span>
        </div>

        <div className={`nav-item ${window.location.pathname === '/surveillance' ? 'active' : ''}`}
          onClick={() => navigate('/surveillance')}>
          <span className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </span>
          <span>Surveillance</span>
        </div>

        <div className={`nav-item ${window.location.pathname === '/surveillance-logs' ? 'active' : ''}`}
          onClick={() => navigate('/surveillance-logs')}>
          <span className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </span>
          <span>Surveillance Logs</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginLeft: '5px'}}>
            <path d="M6 9l6 6 6-6"></path>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>{title}</h1>
          <div className="header-actions">
            {/* Replace the bell button with our notification component */}
            <NotificationsComponent />
            <button className="icon-btn header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </button>
          </div>
        </div>
        
        {/* This is where each page's content will be rendered */}
        {children}
      </div>
    </div>
  );
}

export default SidebarLayout;