import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../context/useAuthStore';
import { foodSurplusAPI } from '../utils/api';
import '../styles/form-page.css';

export default function ExcessFoodPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [excessFoodList, setExcessFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExcessFood();
  }, []);

  const fetchExcessFood = async () => {
    try {
      setLoading(true);
      const { data } = await foodSurplusAPI.getAvailableFoodSurplus();
      setExcessFoodList(data.foodSurplus || []);
      setError(null);
    } catch (err) {
      setError('Failed to load excess food');
      console.error(err);
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
          <h1>📦 Excess Food for NGO</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>
      </header>

      <div className="form-container">
        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">Loading excess food...</div>
        ) : excessFoodList.length === 0 ? (
          <div className="no-content card">
            <p>No excess food available</p>
          </div>
        ) : (
          <div className="food-list">
            {excessFoodList.map((food) => (
              <div key={food._id} className="food-card card">
                <div className="food-header">
                  <div className="meal-info">
                    <h4>{food.mealId?.name || 'Meal'}</h4>
                    <p className="meal-type">
                      {food.mealId?.mealType?.toUpperCase()}
                    </p>
                  </div>
                  <div className="quantity-badge">
                    {food.quantity} units
                  </div>
                </div>

                <div className="food-details">
                  <p className="description">
                    {food.mealId?.description}
                  </p>
                  <div className="meta-info">
                    <span>
                      📅 {new Date(food.date).toLocaleDateString()}
                    </span>
                    <span>📝 Reported {getTimeAgo(food.createdAt)}</span>
                  </div>
                  {food.description && (
                    <div className="food-notes">
                      <strong>Notes:</strong> {food.description}
                    </div>
                  )}
                </div>

                <div className="status-badge">
                  <span className={`badge ${food.status}`}>
                    {food.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const getTimeAgo = (date) => {
  const now = new Date();
  const time = new Date(date);
  const diff = Math.floor((now - time) / 1000 / 60);

  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} minutes ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
  return `${Math.floor(diff / 1440)} days ago`;
};
