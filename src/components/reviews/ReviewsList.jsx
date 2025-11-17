import React, { useEffect, useState, useContext } from 'react';
import Card from '../ui/Card';
import { AuthContext } from '../../contexts/AuthContext';

const ReviewsList = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadReviews();
    }
  }, [user]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const providerId = user._id || user.id;
      const response = await fetch(
        `${import.meta.env.VITE_BACK_END_SERVER_URL}/reviews?providerId=${providerId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
      } else {
        console.log('Failed to load reviews');
        setReviews([]);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  if (reviews.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
        <p>No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="reviews-list">
      {reviews.map((review) => (
        <Card key={review._id || review.id} style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <strong>{review.reviewerId?.username || 'Anonymous'}</strong>
            <span>{'⭐'.repeat(review.rating || 0)}</span>
          </div>
          <p style={{ margin: 0, color: '#666' }}>{review.comment}</p>
          <small style={{ color: '#999' }}>
            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
          </small>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsList;
