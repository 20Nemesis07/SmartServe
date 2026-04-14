import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../context/useAuthStore';
import { mealAPI, bookingAPI } from '../utils/api';
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

  useEffect(() => {
    fetchMeals();
    fetchBookings();
  }, [selectedDate]);

  // Auto-refresh bookings every 5 seconds to show real-time booking updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBookings();
    }, 5000);

    return () => clearInterval(interval);
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMealsByType = (type) =>
    meals.filter((meal) => meal.mealType === type);

  const getBookingsForMeal = (mealId) =>
    bookings.filter((booking) => {
      // Handle both populated object and string ID
      const bookingMealId = booking.mealId?._id || booking.mealId;
      return bookingMealId === mealId || bookingMealId?.toString() === mealId?.toString();
    });

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

        <div className="controls-section">
          <div className="date-picker">
            <label htmlFor="date-input">Select Date:</label>
            <input
              type="date"
              id="date-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <button
            onClick={() => navigate('/add-meal-page')}
            className="btn-primary"
          >
            + Add New Meal
          </button>

          <button
            onClick={() => navigate('/excess-food-page')}
            className="btn-secondary"
          >
            📦 Excess Food for NGO
          </button>

          <button
            onClick={() => navigate('/add-excess-food-page')}
            className="btn-primary"
          >
            ➕ Add Excess Food
          </button>
        </div>

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

                    return (
                      <div key={meal._id} className="meal-row">
                        <h4>{meal.name}</h4>
                        <p>{meal.description}</p>
                        <p>Booked: {mealBookings.length}</p>
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
