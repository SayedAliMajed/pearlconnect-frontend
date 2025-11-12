// src/components/auth/SignInPage.jsx

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { AuthContext } from '../../contexts/AuthContext';
import { signIn } from '../../services/auth';
import '../../pages/auth/SignInPage.css';

const SignInPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const { email, password, rememberMe } = formData;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!email) {
      newErrors.email = 'Username or email is required';
    } else if (email.includes('@') && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email format is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with:', { email, password });

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setLoading(true);
    setAuthError('');
    console.log('Making sign-in request...');

    try {
      // Send username field as expected by backend
      const userData = await signIn({ username: email, password });
      console.log('Sign-in successful:', userData);
      setUser(userData);
      navigate('/');
    } catch (error) {
      console.log('Sign-in error:', error);
      setAuthError(error.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-background">
        <div className="signin-overlay">
          <Container size="small" className="signin-container">
            <Card className="signin-card">
              <div className="signin-header">
                <h1 className="signin-title">Welcome Back</h1>
                <p className="signin-subtitle">
                  Sign in to your PearlConnect account to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="signin-form">
                <Input
                  type="text"
                  name="email"
                  placeholder="Enter your username or email"
                  value={email}
                  onChange={handleChange}
                  error={errors.email}
                  fullWidth
                  className="signin-input"
                />

                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handleChange}
                  error={errors.password}
                  fullWidth
                  className="signin-input"
                />

                <div className="signin-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={rememberMe}
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Remember me</span>
                  </label>
                  
                  <Link to="/forgot-password" className="forgot-password-link">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="signin-button btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    backgroundColor: 'var(--primary-teal)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? '0.6' : '1'
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                {authError && (
                  <div className="signin-error-message">
                    {authError}
                  </div>
                )}
              </form>



              <div className="signin-footer">
                <p className="signup-text">
                  Don't have an account?{' '}
                  <Link to="/sign-up" className="signup-link">
                    Sign up
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

export default SignInPage;
