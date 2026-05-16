// Footer component - Site footer
import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.tagline}>RentLoop — Peer-to-peer rental marketplace</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#134e4a',
    color: '#ccfbf1',
    padding: '2rem 0',
    marginTop: 'auto',
    textAlign: 'center'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  tagline: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: '500'
  }
};

export default Footer;
