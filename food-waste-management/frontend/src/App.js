import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './context/useAuthStore';
import useNGOAuthStore from './context/useNGOAuthStore';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MessRegister from './pages/MessRegister';
import NGOLogin from './pages/NGOLogin';
import NGORegister from './pages/NGORegister';
import StudentDashboard from './pages/StudentDashboard';
import MessDashboard from './pages/MessDashboard';
import NGODashboard from './pages/NGODashboard';
import AddMealPage from './pages/AddMealPage';
import ExcessFoodPage from './pages/ExcessFoodPage';
import AddExcessFoodPage from './pages/AddExcessFoodPage';
import YourBookingsPage from './pages/YourBookingsPage';
import './styles/global.css';

// Protected Route Component for Student/Mess Staff
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Protected Route Component for NGO
const NGOProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useNGOAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/ngo/login" />;
  }

  return children;
};

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Student/Mess Staff Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mess/register" element={<MessRegister />} />

        {/* NGO Routes */}
        <Route path="/ngo/login" element={<NGOLogin />} />
        <Route path="/ngo/register" element={<NGORegister />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === 'student' ? <StudentDashboard /> : <MessDashboard />}
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/*"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/your-bookings"
          element={
            <ProtectedRoute requiredRole="student">
              <YourBookingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mess/*"
          element={
            <ProtectedRoute requiredRole="mess_staff">
              <MessDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mess-dashboard"
          element={
            <ProtectedRoute requiredRole="mess_staff">
              <MessDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-meal-page"
          element={
            <ProtectedRoute requiredRole="mess_staff">
              <AddMealPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/excess-food-page"
          element={
            <ProtectedRoute requiredRole="mess_staff">
              <ExcessFoodPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-excess-food-page"
          element={
            <ProtectedRoute requiredRole="mess_staff">
              <AddExcessFoodPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo/dashboard"
          element={
            <NGOProtectedRoute>
              <NGODashboard />
            </NGOProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
