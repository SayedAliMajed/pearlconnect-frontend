import React, { useState, useEffect, useContext } from 'react';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ReviewForm from '../../components/reviews/ReviewForm';
import { AuthContext } from '../../contexts/AuthContext';

// Custom hook for reviews
function useReview(jwt) {
	const [reviews, setReviews] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	// Helper: Auth headers
	const authHeaders = jwt
		? { 'Authorization': `Bearer ${jwt}`, 'Content-Type': 'application/json' }
		: { 'Content-Type': 'application/json' };

	// Get all reviews
	async function getReviews() {
		try {
			setLoading(true);
			const res = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/reviews`, { headers: authHeaders });
			const data = await res.json();
			if (!res.ok) throw new Error(data.err || 'Failed to fetch reviews');
			setReviews(data);
			return data;
		} catch (err) {
			setError(err.message);
			return [];
		} finally {
			setLoading(false);
		}
	}

	return {
		reviews,
		error,
		loading,
		getReviews,
		setError,
	};
}

const ReviewsPage = () => {
  const { user } = useContext(AuthContext);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { reviews, error, loading, getReviews } = useReview(localStorage.getItem('token'));

  useEffect(() => {
    getReviews();
  }, []);

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    getReviews(); // Refresh reviews
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="reviews-page">
      <Container size="xlarge">
        {/* Header */}
        <div className="reviews-header">
          <h1>Customer Reviews</h1>
          <p>Read reviews from our satisfied customers and share your experience</p>
          {user && (
            <Button
              variant="primary"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </Button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && user && (
          <div className="review-form-section">
            <ReviewForm onSuccess={handleReviewSuccess} />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message" style={{ color: 'red', margin: '1rem 0' }}>
            {error}
          </div>
        )}

        {/* Reviews List */}
        <div className="reviews-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            reviews.map(review => (
              <Card key={review._id || review.id} className="review-card">
                <div className="review-content">
                  <div className="review-header">
                    <div className="review-rating">
                      {renderStars(review.rating || 0)}
                      <span className="rating-number">({review.rating}/5)</span>
                    </div>
                    <div className="review-date">
                      {formatDate(review.createdAt || review.date)}
                    </div>
                  </div>

                  <div className="review-body">
                    <h4>{review.service?.title || 'Service'}</h4>
                    <p className="review-comment">{review.comment}</p>
                    <div className="review-meta">
                      <span className="review-author">
                        By: {review.reviewer?.username || review.reviewer?.name || 'Anonymous'}
                      </span>
                      {review.provider && (
                        <span className="review-provider">
                          Provider: {review.provider.name || review.provider.username}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="no-reviews">
              <h3>No reviews yet</h3>
              <p>Be the first to leave a review for our services!</p>
              {!user && (
                <p>Please sign in to write a review.</p>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ReviewsPage;
