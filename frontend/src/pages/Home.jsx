// Home page - Landing page with hero, categories, and featured listings
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import ListingCard from '../components/ListingCard';
import SearchBar from '../components/SearchBar';

const categories = [
  { name: 'Rooms', emoji: '🏠' },
  { name: 'Furniture', emoji: '🛋️' },
  { name: 'Vehicles', emoji: '🚗' },
  { name: 'Tools', emoji: '🔧' },
  { name: 'Sports', emoji: '⚽' },
  { name: 'Clothing', emoji: '👗' },
  { name: 'Books', emoji: '📚' },
  { name: 'Appliances', emoji: '💻' },
  { name: 'Other', emoji: '📦' }
];

const Home = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      const response = await axios.get('/api/listings');
      setFeaturedListings(response.data.slice(0, 8));
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const handleSearch = (searchTerm) => {
    navigate(`/listings?search=${searchTerm}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/listings?category=${category}`);
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.badge}>✦ Peer-to-Peer Rental Platform</div>
        <h1 style={styles.heroTitle}>Rent Anything, From Anyone</h1>
        <p style={styles.heroSubtitle}>
          Your trusted marketplace for renting rooms, furniture, vehicles, and more
        </p>
        <div style={styles.searchContainer}>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Categories */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Browse by Category</h2>
        <div style={styles.categories}>
          {categories.map(category => (
            <div 
              key={category.name}
              className="category-card"
              style={styles.categoryCard}
              onClick={() => handleCategoryClick(category.name)}
            >
              <div style={styles.categoryIcon}>{category.emoji}</div>
              <p style={styles.categoryName}>{category.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Featured Listings</h2>
        <div className="listing-grid" style={styles.grid}>
          {featuredListings.map(listing => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.howItWorks}>
        <div style={styles.howItWorksContent}>
          <h2 style={styles.howItWorksTitle}>How It Works</h2>
          <div style={styles.steps}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <h3 style={styles.stepTitle}>Post</h3>
              <p style={styles.stepDescription}>List your items for rent with photos and details</p>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <h3 style={styles.stepTitle}>Chat</h3>
              <p style={styles.stepDescription}>Connect with renters through real-time messaging</p>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <h3 style={styles.stepTitle}>Rent</h3>
              <p style={styles.stepDescription}>Arrange pickup and payment offline</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh'
  },
  hero: {
    background: 'linear-gradient(160deg, #f0fdfa 0%, #ccfbf1 50%, #f0fdf4 100%)',
    padding: '5rem 1rem',
    textAlign: 'center'
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#ccfbf1',
    color: '#0d9488',
    padding: '0.5rem 1.25rem',
    borderRadius: '50px',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '1.5rem'
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#134e4a',
    marginBottom: '1rem',
    fontFamily: 'Outfit, sans-serif'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    color: '#4b7c78',
    marginBottom: '2.5rem'
  },
  searchContainer: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  section: {
    maxWidth: '1200px',
    margin: '4rem auto',
    padding: '0 1rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#134e4a',
    marginBottom: '2.5rem',
    textAlign: 'center',
    fontFamily: 'Outfit, sans-serif'
  },
  categories: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem'
  },
  categoryCard: {
    backgroundColor: '#f8fffe',
    border: '2px solid transparent',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  categoryIcon: {
    fontSize: '1.5rem',
    marginBottom: '0.75rem'
  },
  categoryName: {
    margin: 0,
    fontWeight: '600',
    fontSize: '0.75rem',
    color: '#0d9488',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  howItWorks: {
    backgroundColor: '#134e4a',
    padding: '4rem 1rem',
    marginTop: '4rem'
  },
  howItWorksContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  howItWorksTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#ccfbf1',
    marginBottom: '3rem',
    textAlign: 'center',
    fontFamily: 'Outfit, sans-serif'
  },
  steps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '3rem'
  },
  step: {
    textAlign: 'center'
  },
  stepNumber: {
    width: '70px',
    height: '70px',
    borderRadius: '12px',
    backgroundColor: '#0d9488',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.75rem',
    fontWeight: 'bold',
    margin: '0 auto 1.5rem'
  },
  stepTitle: {
    color: '#ccfbf1',
    fontSize: '1.5rem',
    marginBottom: '0.75rem',
    fontFamily: 'Outfit, sans-serif'
  },
  stepDescription: {
    color: '#99c8c4',
    fontSize: '1rem',
    lineHeight: '1.6'
  }
};

export default Home;
