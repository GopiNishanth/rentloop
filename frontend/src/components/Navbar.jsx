// Navbar component - Main navigation bar
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" className="logo" style={styles.logo}>
          <span style={styles.logoRent}>Rent</span>
          <span style={styles.logoLoop}>Loop</span>
        </Link>
        
        <div style={styles.links}>
          <Link to="/listings" style={styles.link}>Browse</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/create-listing" style={styles.link}>Post Item</Link>
              <Link to="/messages" style={styles.link}>Messages</Link>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.signUpButton}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0f2f1',
    padding: '1rem 0'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '1.5rem',
    fontWeight: '700',
    textDecoration: 'none',
    display: 'flex'
  },
  logoRent: {
    color: '#0d9488'
  },
  logoLoop: {
    color: '#134e4a'
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  },
  link: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '1rem',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '500',
    transition: 'color 0.2s'
  },
  signUpButton: {
    backgroundColor: '#0d9488',
    color: '#ffffff',
    padding: '8px 20px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontSize: '1rem',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '600',
    transition: 'background-color 0.2s'
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: '#64748b',
    border: '1px solid #e0f2f1',
    padding: '8px 20px',
    borderRadius: '50px',
    fontSize: '1rem',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

export default Navbar;
