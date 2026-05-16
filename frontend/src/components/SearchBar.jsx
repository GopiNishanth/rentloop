// SearchBar component - Search input for listings
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Search listings..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        Search
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    backgroundColor: '#fff',
    padding: '0.5rem',
    borderRadius: '50px',
    boxShadow: '0 4px 20px rgba(13,148,136,0.1)'
  },
  input: {
    flex: 1,
    padding: '0.75rem 1.25rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '50px',
    outline: 'none',
    backgroundColor: 'transparent'
  },
  button: {
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    backgroundColor: '#0d9488',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s'
  }
};

export default SearchBar;
