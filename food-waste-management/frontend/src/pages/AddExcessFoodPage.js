import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../context/useAuthStore';
import { mealAPI, foodSurplusAPI } from '../utils/api';
import '../styles/form-page.css';

export default function AddExcessFoodPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [meals, setMeals] = useState([]);
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    mealId: '',
    quantity: '',
    mealType: 'breakfast',
    description: '',
    date: selectedDate,
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const { data } = await mealAPI.getMealsForDate(selectedDate);
      setMeals(data.meals || []);
    } catch (err) {
      setError('Failed to load meals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.mealId) {
        setError('Please select a meal');
        return;
      }

      await foodSurplusAPI.reportFoodSurplus({
        mealId: formData.mealId,
        quantity: parseInt(formData.quantity),
        description: formData.description,
        date: formData.date,
      });

      setSuccess('Excess food reported successfully!');
      setFormData({
        mealId: '',
        quantity: '',
        mealType: 'breakfast',
        description: '',
        date: selectedDate,
      });

      setTimeout(() => navigate('/mess-dashboard'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to report food';
      setError(errorMsg);
    }
  };

  return (
    <div className="form-page">
      <header className="navbar">
        <div className="navbar-content">
          <button onClick={() => navigate('/mess-dashboard')} className="back-button">
            ← Back
          </button>
          <h1>➕ Add Excess Food</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>
      </header>

      <div className="form-container">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {loading ? (
          <div className="loading">Loading meals...</div>
        ) : (
          <form onSubmit={handleSubmit} className="card">
            <div className="form-grid">
              <div className="form-group">
                <label>Select Meal</label>
                <select
                  name="mealId"
                  value={formData.mealId}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select a meal</option>
                  {meals.map((meal) => (
                    <option key={meal._id} value={meal._id}>
                      {meal.name} ({meal.mealType.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity (units)</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  placeholder="0"
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Any additional notes..."
                rows="5"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Report Excess Food
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
        )}
      </div>
    </div>
  );
}
