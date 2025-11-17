// src/components/auth/SignUpPage.jsx

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { AuthContext } from '../../contexts/AuthContext';
import { signUp } from '../../services/auth';
import '../../pages/auth/SignUpPage.css';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    // Required fields
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    // Optional profile fields
    fullName: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');


  const {
    username,
    email,
    password,
    confirmPassword,
    role,
    fullName,
    phone,
    address
  } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(fullName.trim())) {
      newErrors.fullName = 'Full name can only contain letters and spaces';
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setAuthError('');

    try {
      const userData = await signUp(formData);
      setUser(userData);
      navigate('/');
    } catch (error) {
      setAuthError(error.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-background">
        <div className="signup-overlay">
          <Container size="medium" className="signup-container">
            <Card className="signup-card">
              <div className="signup-header">
                <h1 className="signup-title">Join PearlConnect</h1>
                <p className="signup-subtitle">
                  Create your account to get started with local services
                </p>
              </div>

              <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-section">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <Input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={handleChange}
                      error={errors.fullName}
                      fullWidth
                      className="signup-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Username *</label>
                    <Input
                      type="text"
                      name="username"
                      placeholder="Choose a username"
                      value={username}
                      onChange={handleChange}
                      error={errors.username}
                      fullWidth
                      className="signup-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={handleChange}
                      error={errors.email}
                      fullWidth
                      className="signup-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={handleChange}
                      fullWidth
                      className="signup-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Password *</label>
                      <Input
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={handleChange}
                        error={errors.password}
                        fullWidth
                        className="signup-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm Password *</label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        fullWidth
                        className="signup-input"
                      />
                    </div>
                  </div>

                  <div className="role-selection">
                    <label className="role-label">I want to:</label>
                    <div className="role-options">
                      <label className="role-option">
                        <input
                          type="radio"
                          name="role"
                          value="customer"
                          checked={role === 'customer'}
                          onChange={handleChange}
                        />
                        <div className="role-content">
                          <span className="role-title">Find Services</span>
                          <span className="role-description">Book local services</span>
                        </div>
                      </label>

                      <label className="role-option">
                        <input
                          type="radio"
                          name="role"
                          value="provider"
                          checked={role === 'provider'}
                          onChange={handleChange}
                        />
                        <div className="role-content">
                          <span className="role-title">Provide Services</span>
                          <span className="role-description">Offer your services</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="textarea-group">
                    <label className="form-label">Address</label>
                    <textarea
                      name="address"
                      placeholder="Enter your address (optional)"
                      value={address}
                      onChange={handleChange}
                      className="signup-textarea"
                      rows="3"
                    />
                  </div>

                  <div className="form-actions">
                    <Button
                      type="submit"
                      variant="primary"
                      size="large"
                      disabled={loading}
                      className="signup-button"
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>
                </div>

                {authError && (
                  <div className="signup-error-message">
                    {authError}
                  </div>
                )}
              </form>

              <div className="signup-footer">
                <p className="signin-text">
                  Already have an account?{' '}
                  <Link to="/sign-in" className="signin-link">
                    Sign in
                  </Link>
                </p>
              </div>
            </Card>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
