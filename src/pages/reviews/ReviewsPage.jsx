import { useState } from 'react';

// Helper: Validate review fields
function validateReview({ bookingId, reviewerId, providerId, serviceId, rating, comment }) {
	if (!bookingId || !reviewerId || !providerId || !serviceId || !comment) return false;
	if (typeof rating !== 'number' || rating < 1 || rating > 5) return false;
	return true;
}

export function useReview(jwt) {
	const [reviews, setReviews] = useState([]);
	const [error, setError] = useState(null);

	// Helper: Auth headers
	const authHeaders = jwt
		? { 'Authorization': `Bearer ${jwt}`, 'Content-Type': 'application/json' }
		: { 'Content-Type': 'application/json' };

	// Create a review
	async function createReview(reviewData) {
		if (!validateReview(reviewData)) {
			setError('Invalid review data');
			return null;
		}
		try {
			const res = await fetch('/api/reviews', {
				method: 'POST',
				headers: authHeaders,
				body: JSON.stringify(reviewData),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.err || 'Failed to create review');
			setReviews(prev => [...prev, data]);
			return data;
		} catch (err) {
			setError(err.message);
			return null;
		}
	}

	// Get all reviews
	async function getReviews() {
		try {
			const res = await fetch('/api/reviews', { headers: authHeaders });
			const data = await res.json();
			if (!res.ok) throw new Error(data.err || 'Failed to fetch reviews');
			setReviews(data);
			return data;
		} catch (err) {
			setError(err.message);
			return [];
		}
	}

	// Get a single review
	async function getReview(reviewId) {
		try {
			const res = await fetch(`/api/reviews/${reviewId}`, { headers: authHeaders });
			const data = await res.json();
			if (!res.ok) throw new Error(data.err || 'Failed to fetch review');
			return data;
		} catch (err) {
			setError(err.message);
			return null;
		}
	}

	// Update a review
	async function updateReview(reviewId, updateData) {
		if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
			setError('Rating must be 1-5');
			return null;
		}
		try {
			const res = await fetch(`/api/reviews/${reviewId}`, {
				method: 'PATCH',
				headers: authHeaders,
				body: JSON.stringify(updateData),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.err || 'Failed to update review');
			setReviews(prev =>
				prev.map(r => (r._id === reviewId ? { ...r, ...data } : r))
			);
			return data;
		} catch (err) {
			setError(err.message);
			return null;
		}
	}

	// Delete a review
	async function deleteReview(reviewId) {
		try {
			const res = await fetch(`/api/reviews/${reviewId}`, {
				method: 'DELETE',
				headers: authHeaders,
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.err || 'Failed to delete review');
			setReviews(prev => prev.filter(r => r._id !== reviewId));
			return data;
		} catch (err) {
			setError(err.message);
			return null;
		}
	}

	return {
		reviews,
		error,
		createReview,
		getReviews,
		getReview,
		updateReview,
		deleteReview,
		setError,
	};
}
