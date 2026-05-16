// CategoryFilter component - Filter listings by category
import React from 'react';

const categories = ['Rooms', 'Furniture', 'Vehicles', 'Tools', 'Sports', 'Clothing', 'Books', 'Appliances', 'Other'];

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Category</h3>
      <select 
        value={selectedCategory} 
        onChange={(e) => onCategoryChange(e.target.value)}
        style={styles.select}
      >
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '1.5rem'
  },
  title: {
    marginBottom: '0.75rem',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#134e4a'
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #e0f2f1',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#134e4a',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

export default CategoryFilter;
