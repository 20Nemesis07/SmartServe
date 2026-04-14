import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import useAuthStore from '../context/useAuthStore';
import { mealAPI, bookingAPI } from '../utils/api';
import '../styles/dashboard.css';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [meals, setMeals] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedQRCode, setSelectedQRCode] = useState(null);

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
      const { data } = await bookingAPI.getMyBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  useEffect(() => {
    fetchMeals();
    fetchBookings();
  }, [selectedDate]);

  const handleBookMeal = async (mealId) => {
    try {
      await bookingAPI.createBooking({
        mealId,
        date: selectedDate,
        mealType: getMealType(selectedDate),
      });
      setSuccess('Meal booked successfully!');
      fetchMeals();
      fetchBookings();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Booking failed';
      setError(errorMsg);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingAPI.cancelBooking(bookingId);
      setSuccess('Booking cancelled successfully!');
      fetchMeals();
      fetchBookings();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Cancellation failed';
      setError(errorMsg);
    }
  };

  const getMealType = (date) => {
    const hour = new Date().getHours();
    if (hour < 12) return 'breakfast';
    if (hour < 17) return 'lunch';
    return 'dinner';
  };

  const isBooked = (mealId) => {
    return bookings.some(b => b.mealId === mealId && b.status !== 'cancelled');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getQRCodeValue = (booking) => {
    return JSON.stringify({
      bookingId: booking._id,
      studentName: user?.name,
      mealName: booking.mealId?.name,
      date: new Date(booking.date).toLocaleDateString(),
      status: booking.status,
    });
  };

  const downloadQRCode = (booking) => {
    const qrElement = document.getElementById(`qr-${booking._id}`);
    const canvas = qrElement.querySelector('canvas');
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `booking-${booking._id}.png`;
    link.click();
  };

  return (
    <div className="dashboard">
      <header className="navbar">
        <div className="navbar-content">
          <h1>🍽️ Food Waste Management</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="btn-secondary btn-small">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="dashboard-content">
          <section className="meals-section">
            <h2>Available Meals</h2>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <div className="date-picker">
              <label htmlFor="date-input">Select Date:</label>
              <input
                type="date"
                id="date-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="loading">Loading meals...</div>
            ) : meals.length === 0 ? (
              <div className="no-meals">No meals available for this date</div>
            ) : (
              <div className="meals-grid">
                {meals.map((meal) => (
                  <div key={meal._id} className="meal-card">
                    <div className="meal-header">
                      <h3>{meal.name}</h3>
                      <span className={`meal-badge ${meal.mealType}`}>
                        {meal.mealType.toUpperCase()}
                      </span>
                    </div>

                    <p>{meal.description}</p>

                    <div className="meal-details">
                      <div className="detail-item">
                        <strong>Type:</strong>
                        <div className="tags">
                          {meal.vegetarian && <span className="tag vegetarian">🥬 Veg</span>}
                          {meal.vegan && <span className="tag vegan">🌱 Vegan</span>}
                          {meal.glutenFree && <span className="tag glutenfree">🌾 GF</span>}
                        </div>
                      </div>

                      {meal.nutrition && (
                        <div className="detail-item">
                          <strong>Nutrition:</strong>
                          <p className="nutrition">
                            {meal.nutrition.calories} cal | {meal.nutrition.protein}g protein
                          </p>
                        </div>
                      )}

                      <div className="detail-item">
                        <strong>Expected:</strong>
                        <p>{meal.baseQuantity} students | {meal.bookings?.length || 0} booked</p>
                      </div>
                    </div>

                    {isBooked(meal._id) ? (
                      <button
                        onClick={() => {
                          const booking = bookings.find(b => b.mealId === meal._id);
                          handleCancelBooking(booking._id);
                        }}
                        className="btn-danger"
                      >
                        Cancel Booking
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBookMeal(meal._id)}
                        className="btn-primary"
                      >
                        Book Meal
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="bookings-sidebar">
            <h3>Your Bookings</h3>
            {bookings.length === 0 ? (
              <p className="no-bookings">No active bookings</p>
            ) : (
              <div className="bookings-list">
                {bookings
                  .filter(b => b.status !== 'cancelled')
                  .map((booking) => (
                    <div key={booking._id} className="booking-item">
                      <h4>{booking.mealId?.name}</h4>
                      <p className={`status ${booking.status}`}>{booking.status.toUpperCase()}</p>
                      <small>{new Date(booking.date).toLocaleDateString()}</small>

                      <button
                        onClick={() =>
                          setSelectedQRCode(selectedQRCode === booking._id ? null : booking._id)
                        }
                        className="btn-qr"
                      >
                        {selectedQRCode === booking._id ? 'Hide QR Code' : 'Show QR Code'}
                      </button>

                      {selectedQRCode === booking._id && (
                        <div className="qr-code-container" id={`qr-${booking._id}`}>
                          <div className="qr-code-wrapper">
                            <QRCodeCanvas
                              value={getQRCodeValue(booking)}
                              size={200}
                              level="H"
                              includeMargin={true}
                            />
                          </div>
                          <button
                            onClick={() => downloadQRCode(booking)}
                            className="btn-download-qr"
                          >
                            📥 Download QR Code
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
