import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
};

// Meal APIs
export const mealAPI = {
  getMeals: (params) => api.get('/meals', { params }),
  getMealById: (id) => api.get(`/meals/${id}`),
  getMealsForDate: (date) => api.get(`/meals/date/${date}`),
  createMeal: (data) => api.post('/meals', data),
  updateMeal: (id, data) => api.put(`/meals/${id}`, data),
  deleteMeal: (id) => api.delete(`/meals/${id}`),
  updateMealStats: (id, data) => api.put(`/meals/${id}/stats`, data),
};

// Booking APIs
export const bookingAPI = {
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getAllBookings: (params) => api.get('/bookings', { params }),
  getBookingsByMeal: (mealId) => api.get(`/bookings/meal/${mealId}`),
  createBooking: (data) => api.post('/bookings', data),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  markAsConsumed: (id) => api.put(`/bookings/${id}/consumed`),
  getBookingStats: (date) => api.get(`/bookings/stats/${date}`),
};

// Food Surplus APIs
export const foodSurplusAPI = {
  getAllFoodSurplus: () => api.get('/food-surplus'),
  getAvailableFoodSurplus: () => api.get('/food-surplus/available'),
  getFoodSurplusById: (id) => api.get(`/food-surplus/${id}`),
  reportFoodSurplus: (data) => api.post('/food-surplus', data),
  updateFoodSurplusStatus: (id, data) => api.put(`/food-surplus/${id}`, data),
  deleteFoodSurplus: (id) => api.delete(`/food-surplus/${id}`),
};

// NGO APIs
export const ngoAPI = {
  registerNGO: (data) => api.post('/ngo/register', data),
  loginNGO: (data) => api.post('/ngo/login', data),
  getNGOProfile: () => api.get('/ngo/profile'),
  updateNGOProfile: (data) => api.put('/ngo/profile', data),
  getAvailableFood: () => api.get('/ngo/available-food'),
  claimFood: (data) => api.post('/ngo/claim-food', data),
  getClaimedFood: () => api.get('/ngo/claimed-food'),
};

export default api;
