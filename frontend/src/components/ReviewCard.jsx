// ReviewCard component - Displays a single review
import React from 'react';

const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.userInfo}>
          {review.reviewer.profilePhoto && (
            <img 
              src={review.reviewer.profilePhoto} 
              alt={review.reviewer.name}
              style={styles.avatar}
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <div>
            <p style={styles.name}>{review.reviewer.name}</p>
            <p style={styles.stars}>{renderStars(review.rating)}</p>
          </div>
        </div>
        <p style={styles.date}>
          {new Date(review.createdAt).toLocaleDateString()}
        </p>
      </div>
      <p style={styles.comment}>{review.comment}</p>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: '#fff'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem'
  },
  userInfo: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  name: {
    margin: 0,
    fontWeight: 'bold'
  },
  stars: {
    margin: '0.25rem 0 0 0',
    color: '#f59e0b',
    fontSize: '1.1rem'
  },
  date: {
    margin: 0,
    color: '#888',
    fontSize: '0.9rem'
  },
  comment: {
    margin: 0,
    lineHeight: '1.6'
  }
};

export default ReviewCard;
