// Dashboard page - User's listings and reviews management
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ReviewCard from '../components/ReviewCard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch user's listings
      const listingsResponse = await axios.get('/api/listings');
      const userListings = listingsResponse.data.filter(
        listing => listing.owner._id === user._id
      );
      setListings(userListings);

      // Fetch user's reviews
      const reviewsResponse = await axios.get(`/api/reviews/user/${user._id}`);
      setReviews(reviewsResponse.data.reviews);
      setAverageRating(reviewsResponse.data.averageRating);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await axios.delete(`/api/listings/${listingId}`);
      setListings(listings.filter(l => l._id !== listingId));
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  const handleToggleAvailability = async (listingId) => {
    try {
      const response = await axios.patch(`/api/listings/${listingId}/toggle`);
      setListings(listings.map(l => 
        l._id === listingId ? response.data : l
      ));
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Failed to update availability');
    }
  };

  if (loading) return <div style={styles.container}>Loading...</div>;

  return (
    <div className="container" style={styles.container}>
      <h1 style={styles.title}>My Dashboard</h1>

      <div style={styles.tabs}>
        <button
          style={activeTab === 'listings' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('listings')}
        >
          My Listings ({listings.length})
        </button>
        <button
          style={activeTab === 'reviews' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('reviews')}
        >
          My Reviews ({reviews.length})
        </button>
      </div>

      {activeTab === 'listings' && (
        <div>
          {listings.length === 0 ? (
            <p style={styles.empty}>You haven't created any listings yet.</p>
          ) : (
            <div style={styles.listingsGrid}>
              {listings.map(listing => (
                <div key={listing._id} style={styles.listingCard}>
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title}
                    style={styles.listingImage}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
                  />
                  <div style={styles.listingContent}>
                    <h3 style={styles.listingTitle}>{listing.title}</h3>
                    <p style={styles.listingPrice}>₹{listing.rentPerDay}/day</p>
                    <p style={listing.available ? styles.available : styles.unavailable}>
                      {listing.available ? 'Available' : 'Unavailable'}
                    </p>
                    <div style={styles.actions}>
                      <button
                        onClick={() => navigate(`/edit-listing/${listing._id}`)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleAvailability(listing._id)}
                        style={styles.toggleButton}
                      >
                        Toggle
                      </button>
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="btn-danger"
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div>
          {averageRating > 0 && (
            <div style={styles.ratingBox}>
              <h2>Average Rating: ★ {averageRating}</h2>
              <p>{reviews.length} total reviews</p>
            </div>
          )}
          
          {reviews.length === 0 ? (
            <p style={styles.empty}>You haven't received any reviews yet.</p>
          ) : (
            reviews.map(review => (
              <ReviewCard key={review._id} review={review} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 1rem',
    minHeight: '80vh',
    backgroundColor: '#f0fdfa'
  },
  title: {
    marginBottom: '2rem',
    color: '#134e4a',
    fontWeight: '700',
    fontFamily: 'Outfit, sans-serif'
  },
  tabs: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  },
  tab: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ffffff',
    border: '1px solid #0d9488',
    cursor: 'pointer',
    fontSize: '1rem',
    borderRadius: '8px',
    color: '#0d9488',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  activeTab: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0d9488',
    border: '1px solid #0d9488',
    cursor: 'pointer',
    fontSize: '1rem',
    borderRadius: '8px',
    color: '#ffffff',
    fontWeight: '600'
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    padding: '3rem'
  },
  listingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  listingCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff'
  },
  listingImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  listingContent: {
    padding: '1rem'
  },
  listingTitle: {
    margin: '0 0 0.5rem 0'
  },
  listingPrice: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    margin: '0.5rem 0'
  },
  available: {
    color: '#27ae60',
    fontWeight: 'bold',
    margin: '0.5rem 0'
  },
  unavailable: {
    color: '#e74c3c',
    fontWeight: 'bold',
    margin: '0.5rem 0'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  editButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: 'transparent',
    color: '#0d9488',
    border: '1px solid #0d9488',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  toggleButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: 'transparent',
    color: '#f59e0b',
    border: '1px solid #f59e0b',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  deleteButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: 'transparent',
    color: '#dc2626',
    border: '1px solid #dc2626',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  ratingBox: {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    textAlign: 'center'
  }
};

export default Dashboard;
