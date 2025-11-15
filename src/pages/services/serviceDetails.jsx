import { useState, useEffect } from 'react';
import { useReview } from '../hooks/useReview';
import { useBooking } from '../hooks/useBooking';

export default function ServicePage({ service, jwt, userId }) {
  const [bookingData, setBookingData] = useState({ date: '', time: '' });
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  const { reviews, getReviews, createReview } = useReview(jwt);
  const { createBooking } = useBooking(jwt);

  // Fetch reviews for this service
  useEffect(() => {
    if (service?._id) getReviews(service._id);
  }, [service]);

  // Fetch available times 
  useEffect(() => {
    if (!bookingData.date) return;
    setLoadingTimes(true);
    fetch(`/api/availability/${service.provider}?date=${bookingData.date}`)
      .then(res => res.json())
      .then(data => {
        setAvailableTimes(data.slots || []);
        setLoadingTimes(false);
      })
      .catch(err => {
        console.error(err);
        setAvailableTimes([]);
        setLoadingTimes(false);
      });
  }, [bookingData.date]);

  // Handle booking
  const handleBooking = async () => {
    if (!bookingData.date || !bookingData.time) return alert('Select date and time');
    const payload = {
      serviceId: service._id,
      providerId: service.provider,
      date: bookingData.date,
      time: bookingData.time,
      customerId: userId,
    };
    const res = await createBooking(payload);
    if (res) alert('Booking created!');
  };

  // Handle adding a new review
  const handleReviewSubmit = async () => {
    if (!reviewData.comment) return alert('Add a comment');
    const payload = {
      serviceId: service._id,
      rating: reviewData.rating,
      comment: reviewData.comment,
      reviewerId: userId,
      providerId: service.provider,
    };
    const res = await createReview(payload);
    if (res) {
      setReviewData({ rating: 5, comment: '' });
      alert('Review added!');
    }
  };

  return (
    <div>
      {/* Service Details */}
      <h2>{service.title}</h2>
      <p>{service.description}</p>
      <p>Price: {service.price} BHD</p>
      {service.images?.map(img => (
        <img key={img.url} src={img.url} alt={img.alt} width="200" />
      ))}

      <hr />

      {/* Booking Section */}
      <h3>Book this service</h3>
      <input
        type="date"
        value={bookingData.date}
        onChange={e => setBookingData({ ...bookingData, date: e.target.value })}
      />
      {loadingTimes ? (
        <p>Loading available times...</p>
      ) : (
        <select
          value={bookingData.time}
          onChange={e => setBookingData({ ...bookingData, time: e.target.value })}
        >
          <option value="">Select time</option>
          {availableTimes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      )}
      <button onClick={handleBooking}>Book Now</button>

      <hr />

      {/* Reviews Section */}
      <h3>Reviews</h3>
      {reviews.length === 0 && <p>No reviews yet</p>}
      {reviews.map(r => (
        <div key={r._id}>
          <strong>Rating: {r.rating}/5</strong>
          <p>{r.comment}</p>
        </div>
      ))}

      {/* Add Review */}
      <h4>Add Review</h4>
      <select
        value={reviewData.rating}
        onChange={e => setReviewData({ ...reviewData, rating: Number(e.target.value) })}
      >
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <textarea
        value={reviewData.comment}
        onChange={e => setReviewData({ ...reviewData, comment: e.target.value })}
      />
      <button onClick={handleReviewSubmit}>Submit Review</button>
    </div>
  );
}
