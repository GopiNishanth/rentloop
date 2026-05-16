// ListingDetail page - Single listing view with full details
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ReviewCard from '../components/ReviewCard';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await axios.get(`/api/listings/${id}`);
      setListing(response.data);
      
      // Fetch owner reviews
      if (response.data.owner) {
        const reviewsResponse = await axios.get(`/api/reviews/user/${response.data.owner._id}`);
        setReviews(reviewsResponse.data.reviews);
        setAverageRating(reviewsResponse.data.averageRating);
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactOwner = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('/api/conversations', {
        listingId: listing._id,
        participantId: listing.owner._id
      });
      navigate(`/messages?conversation=${response.data._id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const response = await axios.patch(`/api/listings/${listing._id}/toggle`);
      setListing(response.data);
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Failed to update availability');
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
        reviewedUserId: listing.owner._id,
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
  if (!listing) return <div style={styles.container}>Listing not found</div>;

  return (
    <div className="container" style={styles.container}>
      <div style={styles.content}>
        {/* Image Gallery */}
        <div style={styles.imageSection}>
          <img 
            src={listing.images[currentImageIndex]} 
            alt={listing.title}
            style={styles.mainImage}
            onError={(e) => e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'}
          />
          {listing.images.length > 1 && (
            <div style={styles.thumbnails}>
              {listing.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${listing.title} ${index + 1}`}
                  style={{
                    ...styles.thumbnail,
                    border: index === currentImageIndex ? '2px solid #3498db' : '1px solid #ddd'
                  }}
                  onClick={() => setCurrentImageIndex(index)}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=No+Image'}
                />
              ))}
            </div>
          )}
        </div>

        {/* Listing Details */}
        <div style={styles.details}>
          <h1 style={styles.title}>{listing.title}</h1>
          
          <div style={styles.meta}>
            <span style={styles.category}>{listing.category}</span>
            <span style={styles.city}>{listing.city}</span>
            <span style={listing.available ? styles.available : styles.unavailable}>
              {listing.available ? 'Available' : 'Unavailable'}
            </span>
          </div>

          <div style={styles.price}>
            <span style={styles.priceAmount}>₹{listing.rentPerDay}</span>
            <span style={styles.priceLabel}> per day</span>
          </div>

          <div style={styles.description}>
            <h2>Description</h2>
            <p>{listing.description}</p>
          </div>

          {/* Owner Info */}
          <div style={styles.ownerSection}>
            <h2>Owner</h2>
            <div style={styles.ownerInfo}>
              {listing.owner.profilePhoto && (
                <img 
                  src={listing.owner.profilePhoto} 
                  alt={listing.owner.name}
                  style={styles.ownerAvatar}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <div>
                <Link to={`/profile/${listing.owner._id}`} style={styles.ownerName}>
                  {listing.owner.name}
                </Link>
                <p style={styles.ownerCity}>{listing.owner.city}</p>
                {averageRating > 0 && (
                  <p style={styles.rating}>★ {averageRating} ({reviews.length} reviews)</p>
                )}
              </div>
            </div>
            
            {isAuthenticated && user?._id !== listing.owner._id && (
              <button onClick={handleContactOwner} style={styles.contactButton}>
                Contact Owner
              </button>
            )}

            {isAuthenticated && user?._id === listing.owner._id && (
              <button onClick={handleToggleAvailability} style={styles.toggleButton}>
                {listing.available ? 'Mark as Rented' : 'Mark as Available'}
              </button>
            )}
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div style={styles.reviewsSection}>
              <h2>Reviews</h2>
              {reviews.map(review => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}

          {/* Review Form - Only show if logged in and not the owner */}
          {isAuthenticated && user?._id !== listing.owner._id && (
            <div style={styles.reviewForm}>
              <h2>Leave a Review for {listing.owner.name}</h2>
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
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    padding: '2rem 1rem'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem'
  },
  imageSection: {
    position: 'sticky',
    top: '2rem',
    height: 'fit-content'
  },
  mainImage: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '1rem'
  },
  thumbnails: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  thumbnail: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  details: {},
  title: {
    fontSize: '2rem',
    marginBottom: '1rem'
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap'
  },
  category: {
    backgroundColor: '#ecf0f1',
    padding: '0.5rem 1rem',
    borderRadius: '4px'
  },
  city: {
    color: '#666'
  },
  available: {
    color: '#27ae60',
    fontWeight: 'bold'
  },
  unavailable: {
    color: '#e74c3c',
    fontWeight: 'bold'
  },
  price: {
    marginBottom: '2rem'
  },
  priceAmount: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  priceLabel: {
    fontSize: '1.2rem',
    color: '#666'
  },
  description: {
    marginBottom: '2rem',
    lineHeight: '1.6'
  },
  ownerSection: {
    borderTop: '1px solid #e0f2f1',
    paddingTop: '2rem',
    marginBottom: '2rem',
    backgroundColor: '#f0fdfa',
    padding: '1.5rem',
    borderRadius: '10px',
    border: '1px solid #e0f2f1'
  },
  ownerInfo: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  ownerAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  ownerName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#3498db',
    textDecoration: 'none'
  },
  ownerCity: {
    color: '#666',
    margin: '0.25rem 0'
  },
  rating: {
    color: '#f59e0b',
    margin: '0.25rem 0',
    fontWeight: '600'
  },
  contactButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#0d9488',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    width: '100%',
    transition: 'background-color 0.2s'
  },
  toggleButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: 'transparent',
    color: '#0d9488',
    border: '1px solid #0d9488',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '0.5rem',
    fontWeight: '600',
    width: '100%',
    transition: 'all 0.2s'
  },
  reviewsSection: {
    borderTop: '1px solid #ddd',
    paddingTop: '2rem'
  },
  reviewForm: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    marginTop: '2rem'
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
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box'
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

export default ListingDetail;
