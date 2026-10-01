import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import api from '../../api/api';

const NotificationBell = () => {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('api/police/notifications/');
      setAlerts(response.data);
      setUnreadCount(response.data.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('api/police/notifications/');
      setUnreadCount(0);
      setAlerts(alerts.map(a => ({ ...a, is_read: true })));
    } catch (error) {
      console.error('Failed to mark read:', error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', marginRight: '20px' }}>
      <button 
        onClick={toggleDropdown}
        style={{ 
          background: 'transparent', 
          border: 'none', 
          cursor: 'pointer', 
          position: 'relative', 
          fontSize: '1.4rem', 
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px'
        }}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', 
            top: '-2px', 
            right: '-4px', 
            background: '#ef4444', 
            color: 'white',
            borderRadius: '50%', 
            padding: '2px 6px', 
            fontSize: '0.7rem', 
            fontWeight: 'bold',
            border: '2px solid white'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', 
          top: '50px', 
          right: '-10px', 
          width: '350px', 
          background: 'white',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', 
          borderRadius: '12px', 
          zIndex: 1000, 
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ 
            padding: '14px 18px', 
            background: '#f8fafc', 
            borderBottom: '1px solid #e2e8f0', 
            fontWeight: 'bold',
            color: '#0f172a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Critical Alerts</span>
            {unreadCount > 0 && <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>{unreadCount} New</span>}
          </div>
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {alerts.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No recent critical alerts.</div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} style={{
                  padding: '14px 18px', 
                  borderBottom: '1px solid #f1f5f9',
                  background: alert.is_read ? '#ffffff' : '#fef2f2',
                  transition: 'background 0.2s'
                }}>
                  <div style={{ fontWeight: '700', color: '#b91c1c', marginBottom: '6px', fontSize: '0.9rem' }}>
                    {alert.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', whiteSpace: 'pre-line', lineHeight: '1.4' }}>
                    {alert.message}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>
                    {new Date(alert.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
