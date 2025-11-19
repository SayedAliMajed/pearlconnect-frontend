/**
 * @fileoverview Multi-step Sign Up Page component for PearlConnect user registration
 *
 * Comprehensive user registration flow with progressive disclosure form, role selection,
 * multi-step validation, and optional profile information collection. Provides a smooth
 * onboarding experience for both customers and service providers.
 */

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { AuthContext } from '../../contexts/AuthContext';
import { signUp } from '../../services/auth';
import '../../pages/auth/SignUpPage.css';

/**
 * SignUpPage Component
 *
 * Multi-step user registration form with progressive disclosure. Divides the registration
 * process into logical steps to improve UX and reduce cognitive load. Features role-based
 * registration options, comprehensive validation, and optional profile enhancement.
 *
 * Features:
 * - Two-step form process (Account → Profile)
 * - Role selection (Customer/Provider) with visual indicators
 * - Progressive form validation with step-specific rules
 * - Optional profile information collection
 * - Responsive design with step progress indicator
 * - Automatic navigation to authenticated app after registration
 * - Error handling for server-side validation failures
 *
 * Form Steps:
 * 1. Account: Username, email, password, role selection
 * 2. Profile: Optional personal information (name, phone, address)
 *
 * @returns {JSX.Element} Multi-step registration interface
 */
const SignUpPage = () => {
  // Navigation hook for redirecting to authenticated app after successful registration
  const navigate = useNavigate();
  // AuthContext setter for updating global authentication state
  const { setUser } = useContext(AuthContext);

  // Comprehensive form state with all required and optional fields
  const [formData, setFormData] = useState({
    // Required account information fields
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer', // Default to customer role
    firstName: '',
    lastName: '',
    // Optional profile enhancement fields
    phone: '',
    address: ''
  });

  // UI state management for async operations and form progression
  const [loading, setLoading] = useState(false);          // Registration submission state
  const [errors, setErrors] = useState({});               // Field-level validation errors
  const [authError, setAuthError] = useState('');         // API-level authentication errors
  const [currentStep, setCurrentStep] = useState(1);      // Multi-step form progression (1-2)

  const {
    username,
    email,
    password,
    confirmPassword,
    role,
    firstName,
    lastName,
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

  const validate = () => {
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
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
    } else if (password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
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

    if (!validate()) {
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
                <div className="form-step">
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    fullWidth
                    className="signup-input"
                  />

                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    fullWidth
                    className="signup-input"
                  />

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

                  <div className="form-row">
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

                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Phone number (optional)"
                    value={phone}
                    onChange={handleChange}
                    fullWidth
                    className="signup-input"
                  />

                  <div className="textarea-group">
                    <textarea
                      name="address"
                      placeholder="Address (optional)"
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
