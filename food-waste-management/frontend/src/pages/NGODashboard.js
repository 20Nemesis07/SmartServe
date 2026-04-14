import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useNGOAuthStore from '../context/useNGOAuthStore';
import { ngoAPI } from '../utils/api';
import '../styles/ngo-dashboard.css';

export default function NGODashboard() {
  const navigate = useNavigate();
  const { ngo, logoutNGO } = useNGOAuthStore();
  const [availableFood, setAvailableFood] = useState([]);
  const [claimedFood, setClaimedFood] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('available');
  const [claimingId, setClaimingId] = useState(null);
  const [claimNotes, setClaimNotes] = useState('');
  const [claimQuantity, setClaimQuantity] = useState('');
  const [totalFoodCollected, setTotalFoodCollected] = useState(ngo?.foodCollected || 0);

  useEffect(() => {
    fetchAvailableFood();
    fetchClaimedFood();
    fetchNGOProfile();
  }, []);

  // Auto-refresh NGO profile every 3 seconds to show real-time food collected updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNGOProfile();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchNGOProfile = async () => {
    try {
      const { data } = await ngoAPI.getNGOProfile();
      setTotalFoodCollected(data.ngo?.foodCollected || 0);
    } catch (err) {
      console.error('Failed to load NGO profile:', err);
    }
  };

  const fetchAvailableFood = async () => {
    try {
      setLoading(true);
      const { data } = await ngoAPI.getAvailableFood();
      setAvailableFood(data.foodSurplus || []);
      setError(null);
    } catch (err) {
      setError('Failed to load available food');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimedFood = async () => {
    try {
      const { data } = await ngoAPI.getClaimedFood();
      setClaimedFood(data.foodCollected || []);
    } catch (err) {
      console.error('Failed to load claimed food:', err);
    }
  };

  const handleClaimFood = async (foodId, availableQuantity) => {
    // Convert and validate quantity
    const quantity = parseInt(claimQuantity);
    if (!claimQuantity || quantity <= 0 || isNaN(quantity)) {
      setError('Please enter a valid quantity');
      return;
    }

    if (quantity > availableQuantity) {
      setError(`Quantity cannot exceed available amount (${availableQuantity} units)`);
      return;
    }

    try {
      await ngoAPI.claimFood({
        foodSurplusId: foodId,
        quantity: quantity,
        notes: claimNotes,
      });
      setSuccess('Food claimed successfully!');
      setClaimingId(null);
      setClaimNotes('');
      setClaimQuantity('');
      setError(null);
      fetchAvailableFood();
      fetchClaimedFood();
      fetchNGOProfile(); // Update total food collected
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to claim food';
      setError(errorMsg);
    }
  };

  const handleLogout = () => {
    logoutNGO();
    navigate('/');
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const time = new Date(date);
    const diff = Math.floor((now - time) / 1000 / 60);

    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  // Aggregate claimed food by meal and date
  const getAggregatedClaimedFood = () => {
    const aggregated = {};

    claimedFood.forEach(food => {
      const mealId = food.mealId?._id;
      const date = new Date(food.date).toLocaleDateString();
      const key = `${mealId}-${date}`;

      if (!aggregated[key]) {
        aggregated[key] = {
          ...food,
          totalQuantity: 0,
          claimCount: 0,
        };
      }

      aggregated[key].totalQuantity += food.quantity;
      aggregated[key].claimCount += 1;
    });

    return Object.values(aggregated);
  };

  return (
    <div className="ngo-dashboard">
      <header className="navbar">
        <div className="navbar-content">
          <h1>🤝 NGO Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {ngo?.name}</span>
            <button onClick={handleLogout} className="btn-secondary btn-small">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* NGO Info Card */}
        <div className="ngo-info-card card">
          <h3>{ngo?.name}</h3>
          <p>{ngo?.description}</p>
          <div className="ngo-stats">
            <div className="stat">
              <label>Total Food Collected</label>
              <strong>{totalFoodCollected} units</strong>
            </div>
            <div className="stat">
              <label>Contact Person</label>
              <strong>{ngo?.contactPerson}</strong>
            </div>
            <div className="stat">
              <label>Phone</label>
              <strong>{ngo?.phone}</strong>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Food ({availableFood.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'claimed' ? 'active' : ''}`}
            onClick={() => setActiveTab('claimed')}
          >
            Claimed Food ({claimedFood.length})
          </button>
        </div>

        {/* Available Food Tab */}
        {activeTab === 'available' && (
          <div className="tab-content">
            {loading ? (
              <div className="loading">Loading available food...</div>
            ) : availableFood.length === 0 ? (
              <div className="no-content">
                <p>No available food at the moment</p>
              </div>
            ) : (
              <div className="food-list">
                {availableFood.map((food) => (
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

                    {claimingId === food._id ? (
                      <div className="claim-form">
                        <div className="form-group">
                          <label>Quantity to Claim</label>
                          <input
                            type="number"
                            min="1"
                            max={food.quantity}
                            value={claimQuantity}
                            onChange={(e) => setClaimQuantity(parseInt(e.target.value) || '')}
                            placeholder={`Max: ${food.quantity} units`}
                          />
                          <small>Available: {food.quantity} units</small>
                        </div>
                        <div className="form-group">
                          <label>Notes (Optional)</label>
                          <textarea
                            placeholder="Add any notes about pickup time, special instructions, etc."
                            value={claimNotes}
                            onChange={(e) => setClaimNotes(e.target.value)}
                            rows="2"
                          />
                        </div>
                        <div className="form-actions">
                          <button
                            onClick={() => handleClaimFood(food._id, food.quantity)}
                            className="btn-primary btn-small"
                          >
                            Confirm Claim
                          </button>
                          <button
                            onClick={() => {
                              setClaimingId(null);
                              setClaimNotes('');
                              setClaimQuantity('');
                              setError(null);
                            }}
                            className="btn-secondary btn-small"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setClaimingId(food._id)}
                        className="btn-primary btn-small"
                      >
                        Claim Food
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Claimed Food Tab */}
        {activeTab === 'claimed' && (
          <div className="tab-content">
            {claimedFood.length === 0 ? (
              <div className="no-content">
                <p>You haven't claimed any food yet</p>
              </div>
            ) : (
              <div className="food-list">
                {getAggregatedClaimedFood().map((food) => (
                  <div key={`${food.mealId?._id}-${new Date(food.date).toLocaleDateString()}`} className="food-card card claimed">
                    <div className="food-header">
                      <div className="meal-info">
                        <h4>{food.mealId?.name || 'Meal'}</h4>
                        <p className="meal-type">
                          {food.mealId?.mealType?.toUpperCase()}
                        </p>
                      </div>
                      <div className="quantity-badge claimed">
                        {food.totalQuantity} units
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
                        <span>✅ Claimed {food.claimCount} time(s)</span>
                      </div>
                      {food.notes && (
                        <div className="food-notes">
                          <strong>Notes:</strong> {food.notes}
                        </div>
                      )}
                    </div>

                    <div className="status-badge">
                      <span className="badge status-claimed">Claimed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
