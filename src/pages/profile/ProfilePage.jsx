import React, { useState, useContext, useEffect } from 'react';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { AuthContext } from '../../contexts/AuthContext';
import { updateUser, getCurrentUser } from '../../services/userService';

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        phone: user.profile?.phone || '',
        address: user.profile?.address || ''
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

      // Prepare the update data with profile structure
      const updateData = {
        username: formData.username,
        email: formData.email,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address
        }
      };

      // Make API call to update user
      const result = await updateUser(user._id, updateData);

      // Fetch the updated user data
      const updatedUser = await getCurrentUser();

      // Update the auth context
      setUser(updatedUser);

      setIsEditing(false);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      username: user.username || '',
      email: user.email || '',
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      phone: user.profile?.phone || '',
      address: user.profile?.address || ''
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
                  {isEditing ? (
                    <Input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    <p className="form-value">{user.username}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Email</label>
                  {isEditing ? (
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    <p className="form-value">{user.email}</p>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    <p className="form-value">{user.profile?.firstName || 'Not provided'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  ) : (
                    <p className="form-value">{user.profile?.lastName || 'Not provided'}</p>
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
                    <p className="form-value">{user.profile?.phone || 'Not provided'}</p>
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
                  <p className="form-value">{user.profile?.address || 'Not provided'}</p>
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
