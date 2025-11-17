import React, { useState, useContext, useEffect } from 'react';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { AuthContext } from '../../contexts/AuthContext';

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.profile?.fullName || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage('');

      // Here you would make an API call to update the user profile
      // For now, we'll just update the local state
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setIsEditing(false);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      fullName: user.profile?.fullName || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  if (!user) {
    return (
      <Container size="large">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Please sign in to view your profile</h2>
          <p>You need to be logged in to access your profile.</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="profile-page">
      <Container size="large">
        {/* Header */}
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account information and preferences</p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Profile Card */}
        <Card className="profile-card">
          <div className="profile-content">
            {/* Profile Picture Section */}
            <div className="profile-picture-section">
              <div className="profile-avatar">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=00AD96&color=fff&size=100`}
                  alt="Profile"
                  className="profile-avatar-image"
                />
              </div>
              {isEditing && (
                <Button variant="secondary" size="small">
                  Change Photo
                </Button>
              )}
            </div>

            {/* Profile Form */}
            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Username</label>
                  <p className="form-value">{user.username}</p>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <p className="form-value">{user.email}</p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    <p className="form-value">{user.profile?.fullName || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    <p className="form-value">{user.phone || 'Not provided'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Member Since</label>
                  <p className="form-value">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    fullWidth
                  />
                ) : (
                  <p className="form-value">{user.address || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            {isEditing ? (
              <>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </Card>

        {/* Account Statistics */}
        <div className="profile-stats">
          <div className="stats-grid">
            <Card className="stat-card">
              <h3>Total Bookings</h3>
              <p className="stat-number">0</p>
            </Card>
            <Card className="stat-card">
              <h3>Reviews Written</h3>
              <p className="stat-number">0</p>
            </Card>
            <Card className="stat-card">
              <h3>Favorite Services</h3>
              <p className="stat-number">0</p>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProfilePage;
