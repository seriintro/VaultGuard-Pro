import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Notifications.css';

function NotificationsComponent() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  
  const API_BASE_URL = 'http://127.0.0.1:5000/api';

  useEffect(() => {
    fetchNotifications();
    
    // Set up polling to check for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    // Add event listener for clicks outside dropdown
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle clicks outside of the dropdown to close it
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/surveillance-logs`);
      
      // Get unknown person logs
      const unknownLogs = response.data.unrecognized || [];
      
      // Get the stored read status from localStorage
      const readStatus = JSON.parse(localStorage.getItem('notificationReadStatus') || '{}');
      
      // Get the deleted notifications from localStorage
      const deletedNotifications = JSON.parse(localStorage.getItem('deletedNotifications') || '[]');
      
      // Mark notifications as read/unread, filter out deleted ones, and sort by timestamp (newest first)
      const processedNotifications = unknownLogs
        .filter(log => !deletedNotifications.includes(log.timestamp))
        .map(log => ({
          ...log,
          read: readStatus[log.timestamp] || false
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setNotifications(processedNotifications);
      
      // Calculate unread count
      const unread = processedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const markAllAsRead = () => {
    const readStatus = {};
    
    // Mark all as read
    const updatedNotifications = notifications.map(notification => {
      readStatus[notification.timestamp] = true;
      return { ...notification, read: true };
    });
    
    // Update state
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    
    // Save to localStorage
    localStorage.setItem('notificationReadStatus', JSON.stringify(readStatus));
  };

  const markAsRead = (timestamp) => {
    // Get current read status
    const readStatus = JSON.parse(localStorage.getItem('notificationReadStatus') || '{}');
    
    // Mark this notification as read
    readStatus[timestamp] = true;
    
    // Update notifications state
    const updatedNotifications = notifications.map(notification => {
      if (notification.timestamp === timestamp) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    setNotifications(updatedNotifications);
    
    // Recalculate unread count
    const unread = updatedNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
    
    // Save to localStorage
    localStorage.setItem('notificationReadStatus', JSON.stringify(readStatus));
  };

  const deleteNotification = (e, timestamp) => {
    // Stop the event from bubbling up and triggering markAsRead
    e.stopPropagation();
    
    // Get current deleted notifications
    const deletedNotifications = JSON.parse(localStorage.getItem('deletedNotifications') || '[]');
    
    // Add this timestamp to deleted notifications
    deletedNotifications.push(timestamp);
    
    // Update state - remove the notification
    const updatedNotifications = notifications.filter(notification => 
      notification.timestamp !== timestamp
    );
    
    setNotifications(updatedNotifications);
    
    // Recalculate unread count
    const unread = updatedNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
    
    // Save to localStorage
    localStorage.setItem('deletedNotifications', JSON.stringify(deletedNotifications));
  };

  return (
    <div className="notifications-container" ref={dropdownRef}>
      <div className="notification-icon" onClick={toggleDropdown}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>
      
      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-read-btn" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No unknown persons detected</div>
            ) : (
              notifications.map((notification, index) => (
                <div 
                  key={index} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(notification.timestamp)}
                >
                  <div className="notification-icon-small">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      Unknown Person Detected
                      {!notification.read && <span className="unread-dot"></span>}
                    </div>
                    <div className="notification-time">{notification.timestamp}</div>
                  </div>
                  <div 
                    className="delete-notification" 
                    onClick={(e) => deleteNotification(e, notification.timestamp)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF5555" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsComponent;