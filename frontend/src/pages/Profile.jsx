// Profile page - Public user profile view
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import ReviewCard from '../components/ReviewCard';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      // Fetch user info from dedicated endpoint
      const userResponse = await axios.get(`/api/auth/user/${userId}`);
      setUser(userResponse.data);

      // Fetch user's listings
      const listingsResponse = await axios.get('/api/listings');
      const userListings = listingsResponse.data.filter(
        listing => listing.owner._id === userId && listing.available
      );
      setListings(userListings);

      // Fetch user reviews
      const reviewsResponse = await axios.get(`/api/reviews/user/${userId}`);
      setReviews(reviewsResponse.data.reviews);
      setAverageRating(reviewsResponse.data.averageRating);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      alert('Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post('/api/reviews', {
        reviewedUserId: userId,
        rating,
        comment
      });

      // Add new review to the list
      setReviews([response.data, ...reviews]);
      
      // Recalculate average rating
      const newAverage = ((parseFloat(averageRating) * reviews.length) + rating) / (reviews.length + 1);
      setAverageRating(newAverage.toFixed(1));

      // Reset form
      setRating(0);
      setComment('');
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={styles.container}>Loading...</div>;
  if (!user) return <div style={styles.container}>User not found</div>;

  return (
    <div className="container" style={styles.container}>
      {/* User Info */}
      <div style={styles.header}>
        {user?.profilePhoto && (
          <img 
            src={user.profilePhoto} 
            alt={user.name}
            style={styles.avatar}
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
        <div>
          <h1 style={styles.name}>{user?.name || 'User'}</h1>
          <p style={styles.city}>{user?.city}</p>
          {user?.createdAt && (
            <p style={styles.joined}>
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
          {averageRating > 0 && (
            <p style={styles.rating}>
              ★ {averageRating} ({reviews.length} reviews)
            </p>
          )}
        </div>
      </div>

      {/* Active Listings */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Active Listings ({listings.length})</h2>
        {listings.length === 0 ? (
          <p style={styles.empty}>No active listings</p>
        ) : (
          <div style={styles.grid}>
            {listings.map(listing => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* Reviews */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Reviews ({reviews.length})</h2>
        
        {/* Review Form - Only show if logged in and not viewing own profile */}
        {isAuthenticated && currentUser?._id !== userId && (
          <div style={styles.reviewForm}>
            <h3>Leave a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div style={styles.starRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      ...styles.star,
                      color: star <= rating ? '#f59e0b' : '#ddd'
                    }}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review..."
                style={styles.textarea}
                rows="4"
                required
              />
              <button 
                type="submit" 
                style={styles.submitButton}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {reviews.length === 0 ? (
          <p style={styles.empty}>No reviews yet</p>
        ) : (
          reviews.map(review => (
            <ReviewCard key={review._id} review={review} />
          ))
        )}
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 1rem',
    minHeight: '80vh'
  },
  header: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    marginBottom: '3rem',
    padding: '2rem',
    backgroundColor: '#f0fdfa',
    borderRadius: '14px',
    border: '1px solid #e0f2f1'
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: '#0d9488',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    fontWeight: 'bold'
  },
  name: {
    margin: '0 0 0.5rem 0',
    fontSize: '2rem',
    color: '#134e4a',
    fontWeight: '700',
    fontFamily: 'Outfit, sans-serif'
  },
  city: {
    margin: '0.25rem 0',
    color: '#4b7c78',
    fontSize: '1.1rem'
  },
  joined: {
    margin: '0.25rem 0',
    color: '#64748b',
    fontSize: '0.9rem'
  },
  rating: {
    margin: '0.5rem 0 0 0',
    color: '#f59e0b',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: '3rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    color: '#134e4a',
    fontWeight: '700',
    fontFamily: 'Outfit, sans-serif'
  },
  empty: {
    textAlign: 'center',
    color: '#4b7c78',
    padding: '2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  reviewForm: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '10px',
    border: '1px solid #e0f2f1',
    marginBottom: '2rem'
  },
  starRating: {
    fontSize: '2rem',
    marginBottom: '1rem',
    display: 'flex',
    gap: '0.5rem'
  },
  star: {
    cursor: 'pointer',
    transition: 'color 0.2s'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #e0f2f1',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
    transition: 'all 0.2s'
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#0d9488',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s'
  }
};

export default Profile;
