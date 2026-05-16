// ListingCard component - Displays listing preview card
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="card"
      style={styles.card} 
      onClick={() => navigate(`/listings/${listing._id}`)}
    >
      <img 
        src={listing.images[0]} 
        alt={listing.title} 
        style={styles.image}
        onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
      />
      <div style={styles.content}>
        <h3 style={styles.title}>{listing.title}</h3>
        <p style={styles.category}>{listing.category}</p>
        <p style={styles.city}>{listing.city}</p>
        <div style={styles.footer}>
          <span style={styles.price}>₹{listing.rentPerDay}/day</span>
          <span style={listing.available ? styles.available : styles.unavailable}>
            {listing.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
        {listing.owner && (
          <p style={styles.owner}>By {listing.owner.name}</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #e0f2f1',
    borderRadius: '14px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    backgroundColor: '#fff',
    boxShadow: '0 2px 12px rgba(13,148,136,0.08)'
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  content: {
    padding: '1rem'
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.2rem',
    color: '#134e4a',
    fontWeight: '600'
  },
  category: {
    color: '#4b7c78',
    fontSize: '0.9rem',
    margin: '0.25rem 0'
  },
  city: {
    color: '#64748b',
    fontSize: '0.9rem',
    margin: '0.25rem 0'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem'
  },
  price: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#0d9488'
  },
  available: {
    backgroundColor: '#ccfbf1',
    color: '#0d9488',
    fontSize: '0.85rem',
    fontWeight: '600',
    padding: '0.25rem 0.75rem',
    borderRadius: '50px'
  },
  unavailable: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    fontSize: '0.85rem',
    fontWeight: '600',
    padding: '0.25rem 0.75rem',
    borderRadius: '50px'
  },
  owner: {
    color: '#4b7c78',
    fontSize: '0.85rem',
    marginTop: '0.5rem'
  }
};

export default ListingCard;
