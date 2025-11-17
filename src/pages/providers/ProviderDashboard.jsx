import React, { useState, useEffect, useContext } from 'react';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { AuthContext } from '../../contexts/AuthContext';
import ServiceManagement from '../../components/providers/ServiceManagement';
import BookingList from '../../components/bookings/BookingList';
import ReviewsList from '../../components/reviews/ReviewsList';

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
      const token = localStorage.getItem('token');
      const providerId = user._id || user.id;

      // Fetch services count
      const servicesRes = await fetch(
        `${import.meta.env.VITE_API_URL}/services?provider=${providerId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const servicesData = await servicesRes.json();
      const totalServices = servicesData.services?.length || 0;

      // Fetch bookings (if endpoint exists)
      let activeBookings = 0;
      try {
        const bookingsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/bookings?provider=${providerId}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          activeBookings = bookingsData.bookings?.length || 0;
        }
      } catch (err) {
        console.log('Bookings endpoint not available yet');
      }

      // Fetch reviews (if endpoint exists)
      let totalReviews = 0;
      let averageRating = 0;
      try {
        const reviewsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/provider-reviews`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          totalReviews = reviewsData.length || 0;
          if (totalReviews > 0) {
            const sum = reviewsData.reduce((acc, review) => acc + (review.rating || 0), 0);
            averageRating = sum / totalReviews;
          }
        }
      } catch (err) {
        console.log('Reviews endpoint not available yet');
      }

      setStats({
        totalServices,
        activeBookings,
        totalReviews,
        averageRating
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'services', label: 'My Services', icon: '🛠️' },
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

          {activeTab === 'bookings' && (
            <div className="bookings-tab">
              <h3>My Bookings</h3>
              <BookingList showAll={false} />
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              <h3>My Reviews</h3>
              <ReviewsList />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ProviderDashboard;
