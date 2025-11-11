// src/components/auth/SignUpPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import './SignUpPage.css';

const SignUpPage = () => {
  const navigate = useNavigate();
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
  const [currentStep, setCurrentStep] = useState(1);

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

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
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
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Signing up with:', formData);
      // navigate('/dashboard');
    } catch (error) {
      console.error('Sign up error:', error);
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

              {/* Progress Indicator */}
              <div className="signup-progress">
                <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-label">Account</span>
                </div>
                <div className="progress-line"></div>
                <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-label">Profile</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="signup-form">
                {/* Step 1: Account Information */}
                {currentStep === 1 && (
                  <div className="form-step">
                    <h2 className="step-title">Account Information</h2>
                    
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

                    <div className="form-actions">
                      <Button
                        type="button"
                        variant="primary"
                        size="large"
                        onClick={handleNext}
                        className="next-button"
                      >
                        Next Step
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Profile Information */}
                {currentStep === 2 && (
                  <div className="form-step">
                    <h2 className="step-title">Profile Information (Optional)</h2>
                    <p className="step-description">Tell us a bit more about yourself</p>
                    
                    <Input
                      type="text"
                      name="fullName"
                      placeholder="Full name"
                      value={fullName}
                      onChange={handleChange}
                      fullWidth
                      className="signup-input"
                    />

                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
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
                        type="button"
                        variant="secondary"
                        size="large"
                        onClick={handlePrevious}
                        className="back-button"
                      >
                        Back
                      </Button>
                      
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
