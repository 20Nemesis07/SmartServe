import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import useAuthStore from '../context/useAuthStore';
import { bookingAPI } from '../utils/api';
import '../styles/form-page.css';

export default function YourBookingsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQRCode, setSelectedQRCode] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [selectedDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await bookingAPI.getStudentBookings({ date: selectedDate });
      setBookings(data.bookings || []);
      setError(null);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const getQRCodeValue = (booking) => {
    return JSON.stringify({
      bookingId: booking._id,
      studentId: booking.studentId?._id,
      studentName: booking.studentId?.name,
      mealId: booking.mealId?._id,
      mealName: booking.mealId?.name,
      date: new Date(booking.date).toLocaleDateString(),
      mealType: booking.mealType,
      status: booking.status,
    });
  };

  const downloadQRCode = (booking) => {
    const qrElement = document.getElementById(`qr-${booking._id}`);
    if (qrElement) {
      const canvas = qrElement.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `booking-${booking._id}.png`;
        link.click();
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    const bookingDate = new Date(b.date).toISOString().split('T')[0];
    return b.status !== 'cancelled' && bookingDate === selectedDate;
  });

  return (
    <div className="form-page">
      <header className="navbar">
        <div className="navbar-content">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            ← Back
          </button>
          <h1>📋 Your Bookings</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>
      </header>

      <div className="form-container">
        {error && <div className="error">{error}</div>}

        {/* Date Picker Section */}
        <div className="card date-section">
          <label htmlFor="date-input">Select Date:</label>
          <input
            type="date"
            id="date-input"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            className="date-input"
          />
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="loading">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="card no-content">
            <p>No bookings for {selectedDate}</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="booking-card card">
                <div className="booking-header">
                  <h3>{booking.mealId?.name || 'Meal'}</h3>
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="label">Type:</span>
                    <span className="value">{booking.mealType.toUpperCase()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Date:</span>
                    <span className="value">{new Date(booking.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Meal Description:</span>
                    <span className="value">{booking.mealId?.description}</span>
                  </div>
                </div>

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
      </div>
    </div>
  );
}
