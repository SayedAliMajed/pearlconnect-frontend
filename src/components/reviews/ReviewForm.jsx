import React, { useState, useContext } from 'react';
import Container from '../ui/Container';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { AuthContext } from '../../contexts/AuthContext';

const ReviewForm = ({ serviceId, providerId, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors({});
    setLoading(true);

    // Validation
    const validationErrors = {};
    if (!formData.comment.trim()) {
      validationErrors.comment = 'Review comment is required';
    }
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      validationErrors.rating = 'Please select a rating between 1 and 5 stars';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please sign in to submit a review');
        return;
      }

      const reviewData = {
        serviceId: serviceId,
        providerId: providerId,
        customerId: user._id || user.id,
        rating: formData.rating,
        comment: formData.comment.trim()
      };

      console.log('Submitting review:', reviewData);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Review submitted successfully:', result);

        setMessage('Review submitted successfully!');
        setFormData({
          rating: 5,
          comment: ''
        });

        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.err || errorData.message || 'Failed to submit review';
        console.error('Review submission error:', errorData);
        setMessage(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(num => (
      <span
        key={num}
        className={`star ${num <= formData.rating ? 'selected' : ''}`}
        onClick={() => setFormData(prev => ({ ...prev, rating: num }))}
        style={{ cursor: 'pointer', fontSize: '24px', margin: '0 2px' }}
      >
        {num <= formData.rating ? '⭐' : '☆'}
      </span>
    ));
  };

  if (!user) {
    return (
      <Container size="small">
        <p>Please sign in to write a review.</p>
      </Container>
    );
  }

  return (
    <Container size="small">
      <form onSubmit={handleSubmit}>
        <h3>Write a Review</h3>

        <div className="form-group">
          <label>Rating</label>
          <div className="rating-stars">
            {renderStars()}
          </div>
          {errors.rating && (
            <div className="field-error" style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
              {errors.rating}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="comment">Comment *</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Share your experience..."
            rows="4"
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.comment ? '1px solid #dc2626' : '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          {errors.comment && (
            <div className="field-error" style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
              {errors.comment}
            </div>
          )}
        </div>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div style={{ marginTop: '1rem' }}>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default ReviewForm;
