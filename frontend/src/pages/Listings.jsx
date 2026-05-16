// Listings page - Browse all listings with search and filters
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import ListingCard from '../components/ListingCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: '',
    maxPrice: ''
  });
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.city) params.append('city', filters.city.toLowerCase());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await axios.get(`/api/listings?${params.toString()}`);
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm });
    setSearchParams({ ...filters, search: searchTerm });
  };

  const handleCategoryChange = (category) => {
    setFilters({ ...filters, category });
    setSearchParams({ ...filters, category });
  };

  return (
    <div className="container" style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.title}>Filters</h2>
        
        <CategoryFilter 
          selectedCategory={filters.category}
          onCategoryChange={handleCategoryChange}
        />

        <div style={styles.filterGroup}>
          <label style={styles.label}>City</label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            placeholder="Enter city"
            style={styles.input}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Max Price per Day</label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            placeholder="Enter max price"
            style={styles.input}
            min="0"
          />
        </div>

        <button onClick={fetchListings} style={styles.button}>
          Apply Filters
        </button>
      </div>

      <div style={styles.main}>
        <SearchBar onSearch={handleSearch} />
        
        {loading ? (
          <p>Loading listings...</p>
        ) : listings.length === 0 ? (
          <p>No listings found</p>
        ) : (
          <>
            <p style={styles.count}>{listings.length} listings found</p>
            <div className="listing-grid" style={styles.grid}>
              {listings.map(listing => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 1rem',
    backgroundColor: '#f0fdfa',
    minHeight: '80vh'
  },
  sidebar: {
    width: '250px',
    flexShrink: 0,
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRight: '1px solid #e0f2f1',
    borderRadius: '8px',
    height: 'fit-content'
  },
  main: {
    flex: 1,
    padding: '1rem'
  },
  title: {
    marginBottom: '1.5rem',
    color: '#134e4a',
    fontWeight: '700',
    fontFamily: 'Outfit, sans-serif'
  },
  filterGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#134e4a'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #e0f2f1',
    borderRadius: '8px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#0d9488',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s'
  },
  count: {
    marginBottom: '1.5rem',
    color: '#4b7c78',
    fontSize: '0.95rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem'
  }
};

export default Listings;
