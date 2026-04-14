import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../context/useAuthStore';
import { mealAPI } from '../utils/api';
import '../styles/form-page.css';

export default function AddMealPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mealType: 'breakfast',
    date: selectedDate,
    markPrice: '',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await mealAPI.createMeal({
        ...formData,
        date: formData.date,
      });

      setSuccess('Meal created successfully!');
      setFormData({
        name: '',
        description: '',
        mealType: 'breakfast',
        date: selectedDate,
        markPrice: '',
      });

      setTimeout(() => navigate('/mess-dashboard'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create meal';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <header className="navbar">
        <div className="navbar-content">
          <button onClick={() => navigate('/mess-dashboard')} className="back-button">
            ← Back
          </button>
          <h1>➕ Add New Meal</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>
      </header>

      <div className="form-container">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit} className="card">
          <div className="form-grid">
            <div className="form-group">
              <label>Meal Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Meal Type</label>
              <select
                name="mealType"
                value={formData.mealType}
                onChange={handleFormChange}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            <div className="form-group">
              <label>Mark Price</label>
              <input
                type="number"
                name="markPrice"
                value={formData.markPrice}
                onChange={handleFormChange}
                placeholder="Price (optional)"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows="5"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Meal'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/mess-dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
