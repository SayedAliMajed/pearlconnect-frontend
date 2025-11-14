import React, { useState, useEffect, useContext } from 'react';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { AuthContext } from '../../contexts/AuthContext';
import ServiceManagement from '../../components/providers/ServiceManagement';
import AvailabilityCalendar from '../../components/providers/AvailabilityCalendar';

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalServices: 0,
    activeBookings: 0,
    totalReviews: 0,
    averageRating: 0
  });

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  const loadDashboardStats = async () => {
    try {
      // This would aggregate data from multiple API endpoints
      // For now, we'll use placeholder data
      setStats({
        totalServices: 0,
        activeBookings: 0,
        totalReviews: 0,
        averageRating: 0
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'services', label: 'My Services', icon: '🛠️' },
    { id: 'availability', label: 'Availability', icon: '⏰' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' }
  ];

  if (!user) {
    return (
      <Container size="large">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Please sign in to access your provider dashboard</h2>
          <p>You need to be logged in as a service provider to access this page.</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="provider-dashboard">
      <Container size="xlarge">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Provider Dashboard</h1>
          <p>Welcome back, {user.username}! Manage your services and bookings.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {/* Stats Cards */}
              <div className="stats-grid">
                <Card className="stat-card">
                  <div className="stat-content">
                    <div className="stat-number">{stats.totalServices}</div>
                    <div className="stat-label">Total Services</div>
                  </div>
                  <div className="stat-icon">🛠️</div>
                </Card>

                <Card className="stat-card">
                  <div className="stat-content">
                    <div className="stat-number">{stats.activeBookings}</div>
                    <div className="stat-label">Active Bookings</div>
                  </div>
                  <div className="stat-icon">📅</div>
                </Card>

                <Card className="stat-card">
                  <div className="stat-content">
                    <div className="stat-number">{stats.totalReviews}</div>
                    <div className="stat-label">Total Reviews</div>
                  </div>
                  <div className="stat-icon">⭐</div>
                </Card>

                <Card className="stat-card">
                  <div className="stat-content">
                    <div className="stat-number">{stats.averageRating.toFixed(1)}</div>
                    <div className="stat-label">Average Rating</div>
                  </div>
                  <div className="stat-icon">📈</div>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                  <Button
                    variant="primary"
                    onClick={() => setActiveTab('services')}
                  >
                    ➕ Add New Service
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setActiveTab('availability')}
                  >
                    ⏰ Set Availability
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setActiveTab('bookings')}
                  >
                    📅 View Bookings
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <ServiceManagement />
          )}

          {activeTab === 'availability' && (
            <AvailabilityCalendar />
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-tab">
              <h3>My Bookings</h3>
              <p>Booking management will be implemented here.</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              <h3>My Reviews</h3>
              <p>Review management will be implemented here.</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ProviderDashboard;
