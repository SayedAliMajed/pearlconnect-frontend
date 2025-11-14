import React, { useState, useContext } from 'react';
import Container from '../ui/Container';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { AuthContext } from '../../contexts/AuthContext';

const ReviewForm = ({ onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    serviceId: '',
    providerId: '',
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
    setLoading(true);

    try {
      // Here you would make an API call to submit the review
      // For now, we'll just simulate success
      console.log('Submitting review:', formData);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage('Review submitted successfully!');
      setFormData({
        serviceId: '',
        providerId: '',
        rating: 5,
        comment: ''
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setMessage('Failed to submit review. Please try again.');
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
        </div>

        <div className="form-group">
          <label htmlFor="comment">Comment</label>
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
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
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
