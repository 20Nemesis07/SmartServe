import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../context/useAuthStore';
import { mealAPI, bookingAPI, foodSurplusAPI } from '../utils/api';
import '../styles/mess-dashboard.css';

export default function MessDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [meals, setMeals] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showReportSurplus, setShowReportSurplus] = useState(null);
  const [showExcessFood, setShowExcessFood] = useState(false);
  const [showAddExcessFood, setShowAddExcessFood] = useState(false);

  const [excessFoodList, setExcessFoodList] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mealType: 'breakfast',
    date: selectedDate,
    baseQuantity: '',
    markPrice: '',
  });

  const [surplusFormData, setSurplusFormData] = useState({
    quantity: '',
    description: '',
  });

  const [manualFoodData, setManualFoodData] = useState({
    foodName: '',
    quantity: '',
    mealType: 'breakfast',
    description: '',
    date: selectedDate,
  });

  useEffect(() => {
    fetchMeals();
    fetchBookings();
    fetchExcessFood();
  }, [selectedDate]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const { data } = await mealAPI.getMealsForDate(selectedDate);
      setMeals(data.meals || []);
      setError(null);
    } catch (err) {
      setError('Failed to load meals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getAllBookings({ date: selectedDate });
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  const fetchExcessFood = async () => {
    try {
      const { data } = await foodSurplusAPI.getAvailableFoodSurplus();
      setExcessFoodList(data.foodSurplus || []);
    } catch (err) {
      console.error('Failed to load excess food:', err);
    }
  };

  const handleCreateMeal = async (e) => {
    e.preventDefault();
    try {
      await mealAPI.createMeal({
        ...formData,
        date: new Date(formData.date),
      });

      setSuccess('Meal created successfully!');
      setFormData({
        name: '',
        description: '',
        mealType: 'breakfast',
        date: selectedDate,
        baseQuantity: '',
        markPrice: '',
      });

      setShowCreateForm(false);
      fetchMeals();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create meal';
      setError(errorMsg);
    }
  };

  const handleAddExcessFood = async (e) => {
    e.preventDefault();
    try {
      await foodSurplusAPI.reportFoodSurplus({
        mealId: null,
        mealType: manualFoodData.mealType,
        quantity: parseInt(manualFoodData.quantity),
        description: `${manualFoodData.foodName} - ${manualFoodData.description}`,
        date: new Date(manualFoodData.date),
      });

      setSuccess('Excess food added successfully!');
      setManualFoodData({
        foodName: '',
        quantity: '',
        mealType: 'breakfast',
        description: '',
        date: selectedDate,
      });

      setShowAddExcessFood(false);
      fetchExcessFood();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to add excess food';
      setError(errorMsg);
    }
  };

  const handleReportSurplus = async (mealId) => {
    try {
      await foodSurplusAPI.reportFoodSurplus({
        mealId,
        quantity: parseInt(surplusFormData.quantity),
        description: surplusFormData.description,
      });

      setSuccess('Food surplus reported successfully!');
      setSurplusFormData({ quantity: '', description: '' });
      setShowReportSurplus(null);
      fetchExcessFood();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to report food surplus';
      setError(errorMsg);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSurplusFormChange = (e) => {
    const { name, value } = e.target;
    setSurplusFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualFoodChange = (e) => {
    const { name, value } = e.target;
    setManualFoodData((prev) => ({ ...prev, [name]: value }));
  };

  const getMealsByType = (type) =>
    meals.filter((meal) => meal.mealType === type);

  const getBookingsForMeal = (mealId) =>
    bookings.filter((booking) => booking.mealId === mealId);

  return (
    <div className="mess-dashboard">
      <header className="navbar">
        <div className="navbar-content">
          <h1>🍽️ Mess Committee Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="btn-secondary btn-small"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="controls-section">
          <div className="date-picker">
            <label htmlFor="date-input">Select Date:</label>
            <input
              type="date"
              id="date-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            {showCreateForm ? 'Cancel' : '+ Add New Meal'}
          </button>

          <button
            onClick={() => setShowExcessFood(!showExcessFood)}
            className="btn-secondary"
          >
            📦 Excess Food for NGO ({excessFoodList.length})
          </button>

          <button
            onClick={() => setShowAddExcessFood(!showAddExcessFood)}
            className="btn-primary"
          >
            {showAddExcessFood ? 'Cancel' : '➕ Add Excess Food'}
          </button>
        </div>

        {showCreateForm && (
          <div className="create-meal-form card">
            <h3>Create New Meal</h3>
            <form onSubmit={handleCreateMeal}>
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
                  <label>Expected Quantity</label>
                  <input
                    type="number"
                    name="baseQuantity"
                    value={formData.baseQuantity}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                />
              </div>

              <button type="submit" className="btn-primary">
                Create Meal
              </button>
            </form>
          </div>
        )}

        {showAddExcessFood && (
          <div className="add-excess-food-form card">
            <h3>➕ Add Excess Food for NGO Pickup</h3>
            <form onSubmit={handleAddExcessFood}>
              <div className="form-grid">
                <input
                  type="text"
                  name="foodName"
                  value={manualFoodData.foodName}
                  onChange={handleManualFoodChange}
                  placeholder="Food name"
                  required
                />

                <input
                  type="number"
                  name="quantity"
                  value={manualFoodData.quantity}
                  onChange={handleManualFoodChange}
                  placeholder="Quantity"
                  required
                />
              </div>

              <textarea
                name="description"
                value={manualFoodData.description}
                onChange={handleManualFoodChange}
                placeholder="Description"
              />

              <button type="submit" className="btn-primary">
                Add Excess Food
              </button>
            </form>
          </div>
        )}

        {showExcessFood && (
          <div className="excess-food-section card">
            <h3>📦 Excess Food Available for NGO Pickup</h3>
            {excessFoodList.length === 0 ? (
              <p className="no-meals">No excess food reported yet</p>
            ) : (
              <div className="excess-food-table">
                <table>
                  <thead>
                    <tr>
                      <th>Meal Name</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {excessFoodList.map((food) => (
                      <tr key={food._id}>
                        <td>
                          {food.mealId?.name ||
                            food.description?.split(' - ')[0] ||
                            'Manual Entry'}
                        </td>
                        <td>
                          {food.mealType ||
                            food.mealId?.mealType?.toUpperCase() ||
                            'N/A'}
                        </td>
                        <td>{food.quantity}</td>
                        <td>{new Date(food.date).toLocaleDateString()}</td>
                        <td>{food.description}</td>
                        <td>{food.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading meals...</div>
        ) : (
          <div className="meals-dashboard">
            {['breakfast', 'lunch', 'dinner'].map((mealType) => {
              const mealsByType = getMealsByType(mealType);

              return (
                <section key={mealType} className="meal-type-section">
                  <h2>{mealType.toUpperCase()}</h2>

                  {mealsByType.map((meal) => {
                    const mealBookings = getBookingsForMeal(meal._id);
                    const remaining = Math.max(
                      0,
                      (meal.actualQuantityPrepared || 0) -
                        (meal.actualQuantityConsumed || 0)
                    );

                    return (
                      <div key={meal._id} className="meal-row">
                        <h4>{meal.name}</h4>
                        <p>{meal.description}</p>
                        <p>Booked: {mealBookings.length}</p>
                        <p>Remaining: {remaining}</p>

                        {remaining > 0 && (
                          <button
                            onClick={() => setShowReportSurplus(meal._id)}
                            className="btn-primary btn-small"
                          >
                            Report Surplus
                          </button>
                        )}

                        {showReportSurplus === meal._id && (
                          <div className="surplus-form-inline">
                            <input
                              type="number"
                              name="quantity"
                              value={surplusFormData.quantity}
                              onChange={handleSurplusFormChange}
                              placeholder="Quantity"
                            />
                            <input
                              type="text"
                              name="description"
                              value={surplusFormData.description}
                              onChange={handleSurplusFormChange}
                              placeholder="Description"
                            />
                            <button
                              onClick={() => handleReportSurplus(meal._id)}
                              className="btn-primary btn-small"
                            >
                              Submit
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
