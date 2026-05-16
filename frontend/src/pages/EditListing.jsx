// EditListing page - Edit existing listing
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const categories = ['Rooms', 'Furniture', 'Vehicles', 'Tools', 'Sports', 'Clothing', 'Books', 'Appliances', 'Other'];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    rentPerDay: '',
    city: '',
    images: ['']
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await axios.get(`/api/listings/${id}`);
      const listing = response.data;
      setFormData({
        title: listing.title,
        description: listing.description,
        category: listing.category,
        rentPerDay: listing.rentPerDay.toString(),
        city: listing.city,
        images: listing.images
      });
    } catch (error) {
      setError('Failed to load listing');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const images = formData.images.filter(img => img.trim() !== '');
      
      if (images.length === 0) {
        setError('Please provide at least one image URL');
        setLoading(false);
        return;
      }

      await axios.put(`/api/listings/${id}`, {
        ...formData,
        images,
        city: formData.city.toLowerCase(),
        rentPerDay: parseFloat(formData.rentPerDay)
      });

      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Edit Listing</h1>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group" style={styles.formGroup}>
            <label style={styles.label}>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div className="form-group" style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              style={styles.textarea}
            />
          </div>

          <div className="form-group" style={styles.formGroup}>
            <label style={styles.label}>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={styles.formGroup}>
            <label style={styles.label}>Rent Per Day (₹) *</label>
            <input
              type="number"
              name="rentPerDay"
              value={formData.rentPerDay}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              style={styles.input}
            />
          </div>

          <div className="form-group" style={styles.formGroup}>
            <label style={styles.label}>City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div className="form-group" style={styles.formGroup}>
            <label style={styles.label}>Image URLs *</label>
            {formData.images.map((image, index) => (
              <div key={index} style={styles.imageRow}>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  style={styles.input}
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="btn-danger"
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="btn"
              style={styles.addButton}
            >
              Add Another Image
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn" style={styles.submitButton}>
            {loading ? 'Updating...' : 'Update Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    padding: '2rem 1rem',
    background: 'linear-gradient(160deg, #f0fdfa, #ccfbf1)'
  },
  formContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 8px 40px rgba(13,148,136,0.12)'
  },
  title: {
    marginBottom: '1.5rem',
    color: '#134e4a',
    fontWeight: '700',
    fontFamily: 'Outfit, sans-serif'
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#134e4a'
  },
  input: {
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #e0f2f1',
    borderRadius: '8px',
    transition: 'all 0.2s'
  },
  textarea: {
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #e0f2f1',
    borderRadius: '8px',
    fontFamily: 'inherit',
    transition: 'all 0.2s'
  },
  select: {
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #e0f2f1',
    borderRadius: '8px',
    transition: 'all 0.2s'
  },
  imageRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },
  removeButton: {
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    color: '#dc2626',
    border: '1px solid #dc2626',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  addButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    color: '#0d9488',
    border: '1px solid #0d9488',
    borderRadius: '8px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  submitButton: {
    padding: '12px',
    fontSize: '1rem',
    backgroundColor: '#0d9488',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '0.5rem',
    fontWeight: '600',
    transition: 'background-color 0.2s'
  }
};

export default EditListing;
