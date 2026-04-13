# 🛠️ Implementation Notes & Architecture Guide

## Understanding the Architecture

### Backend Structure (MVC Pattern)

```
Request Flow:
1. User makes HTTP request to /api/auth/login
2. Express routes to authRoutes.js
3. Route calls authController.login()
4. Controller queries User model via MongoDB
5. Password validated with bcryptjs.compare()
6. JWT token generated
7. Response sent back with token + user data
```

### Frontend Structure (Component-Based)

```
User Interaction Flow:
1. User visits Login.js page
2. Form submitted
3. axios call to backend API
4. Zustand store updates (useAuthStore)
5. Token saved to localStorage
6. Router.navigate('/dashboard')
7. Protected route checks authentication
8. Dashboard component renders
```

---

## Key Technologies Explained

### MongoDB Models (6 Models)

**User Model** - Stores user information
- Password hashing happens on save using bcryptjs
- Different fields based on role (student has registrationNumber, etc.)
- Methods: matchPassword() for login verification

**Meal Model** - Tracks all meal information
- Links to Bookings via array of booking IDs
- Tracks nutrition info, dietary preferences
- Status changes: scheduled → prepared → served → completed

**Booking Model** - Student meal reservations
- Links student to meal
- Tracks booking status: booked → consumed/cancelled
- Unique index ensures one booking per student per meal
- Auto-prevents duplicate bookings

**FoodSurplus Model** - Leftover food tracking
- Links to specific meal and NGO
- Status: available → claimed → donated/disposed
- For NGO integration feature

**NGO Model** - Partner organizations
- Stores NGO details and verification status
- Tracks food collected, beneficiaries
- Ready for NGO dashboard feature

**Analytics Model** - Daily waste statistics
- Auto-calculated after meals completed
- Tracks: booked vs prepared vs consumed vs wasted
- Calculates waste percentage and CO2 saved

### Authentication Flow

```
1. User Registration:
   - Password hashed with bcryptjs (salt rounds: 10)
   - Stored in MongoDB
   - JWT token generated
   - Token + user data returned

2. User Login:
   - Email found in database
   - Password compared with stored hash
   - If match: JWT token generated
   - Token sent back, stored in localStorage

3. Authenticated Requests:
   - Token sent in Authorization header
   - Middleware (auth.js) validates JWT
   - Decoded userId attached to request
   - authRole.js checks if role is authorized
   - If valid, request proceeds; else 403 Forbidden

4. Logout:
   - Token removed from localStorage
   - User redirected to login
   - Session ends client-side
```

### API Call Pattern

All API calls follow this pattern:

```javascript
// In api.js
export const mealAPI = {
  getMeals: (params) => api.get('/meals', { params }),
  // ...
}

// In component
const { data } = await mealAPI.getMeals({ date: '2024-04-11' });

// What happens:
// 1. axios creates GET request
// 2. Interceptor adds Authorization header with token
// 3. Request sent to http://localhost:5000/api/meals
// 4. Backend validates JWT & role
// 5. Query filters meals by date in MongoDB
// 6. Results returned as JSON
// 7. Component state updated with new data
```

---

## Understanding Key Features

### Feature 1: Meal Booking

**Front-end:**
```
StudentDashboard shows meals for selected date
User clicks "Book Meal"
→ bookingAPI.createBooking() called
→ Booking document created in MongoDB
→ Meal's bookings array updated
→ User's bookingHistory updated
→ Success message shown
```

**Backend Validation:**
- Meal must exist (check by ID)
- Student can't book same meal twice (unique index)
- Booking timestamp recorded
- Links created between collections

### Feature 2: Booking Cancellation

**Rules:**
- Only students can cancel their own bookings
- Only within 24 hours of meal
- Changes booking status to "cancelled"
- Removes from meal's bookings array

**Front-end Checks:**
```javascript
const hoursUntilMeal = (mealDate - now) / (1000 * 60 * 60);
if (hoursUntilMeal <= 0) {
  throw "Cannot cancel - meal time passed";
}
```

### Feature 3: Meal Management

**Mess Staff Only:**
- Create meals with nutritional content
- Update meal for the day
- Track actual quantities
- System auto-calculates waste

**Waste Calculation:**
```
wasteQuantity = actualQuantityPrepared - actualQuantityConsumed
wastePercentage = (wasteQuantity / actualQuantityPrepared) * 100
```

---

## Frontend State Management (Zustand)

### useAuthStore

Stores:
- `user` - Current user object
- `token` - JWT token
- `isLoading` - Loading state during API calls
- `error` - Error messages

Methods:
- `register()` - Create new account
- `login()` - Authenticate user
- `logout()` - Clear auth
- `updateProfile()` - Update user info
- `isAuthenticated()` - Check if logged in
- `getUserRole()` - Get user's role

**Why Zustand?**
- Lightweight (only 1KB)
- No boilerplate like Redux
- Perfect for simple apps like this
- State persists to localStorage

---

## Backend Request/Response Examples

### Example 1: Login Request

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@test.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Rahul Kumar",
    "email": "student@test.com",
    "role": "student",
    "registrationNumber": "2023001"
  }
}
```

### Example 2: Create Booking

```
POST /api/bookings
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "mealId": "507f1f77bcf86cd799439012",
  "date": "2024-04-12",
  "mealType": "lunch",
  "quantity": 1,
  "specialRequests": "Extra spicy"
}

Response (201):
{
  "success": true,
  "booking": {
    "_id": "507f1f77bcf86cd799439013",
    "studentId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Rahul Kumar",
      "email": "student@test.com"
    },
    "mealId": {...},
    "status": "booked",
    "date": "2024-04-12",
    "createdAt": "2024-04-11T10:30:00Z"
  }
}
```

---

## Routing & Protected Routes

### Frontend Routes

```Javascript
Routes:
/ → redirects to /dashboard
/login → LoginPage (public)
/register → RegisterPage (public)
/dashboard → StudentDashboard OR MessDashboard (protected)
/student/* → StudentDashboard (protected, role: student)
/mess/* → MessDashboard (protected, role: mess_staff)
* → redirects to /login
```

### Protected Route Component

```javascript
<ProtectedRoute requiredRole="student">
  <StudentDashboard />
</ProtectedRoute>

// Checks:
// 1. Is token present? If not → redirect to /login
// 2. Is role correct? If not → redirect to /login
// 3. Both valid? → render component
```

---

## Error Handling Strategy

### Frontend
```javascript
try {
  const { data } = await mealAPI.getMeals();
  setMeals(data.meals);
} catch (error) {
  // error.response?.data?.message has backend error
  // Show user-friendly message
  setError(error.response?.data?.message || 'Unknown error');
}
```

### Backend
```javascript
try {
  // Do something
  res.status(201).json({ success: true, data });
} catch (error) {
  res.status(500).json({ success: false, message: error.message });
}
```

### Interceptors
```javascript
// Globally handle 401 (unauthorized)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token invalid/expired
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Styling Approach

### CSS Organization

1. **global.css** - Base styles, utility classes
2. **auth.css** - Login/Register pages
3. **dashboard.css** - Student view
4. **mess-dashboard.css** - Mess staff view

### Design Patterns Used

- **Grid layouts** for responsive design
- **Flexbox** for component spacing
- **CSS variables** for colors (can add later)
- **Card pattern** for visual hierarchy
- **Color coding** for meal types

### Responsive Breakpoints

```css
@media (max-width: 768px) {
  /* Mobile styles */
  Grid switches from 2-3 columns to 1 column
  Sidebar becomes full-width
  Flex direction changes to column
}
```

---

## Database Indexing

```javascript
// In Booking model:
bookingSchema.index({ studentId: 1, mealId: 1 }, { unique: true });

// Prevents duplicate bookings
// Speeds up queries like:
Booking.findOne({ studentId: X, mealId: Y })
```

---

## Adding New Features

### Example: Add Meal Rating

**Step 1: Update Model**
```javascript
// In Meal.js
ratings: [{
  studentId: mongoose.Schema.Types.ObjectId,
  rating: Number,
  comment: String
}]
```

**Step 2: Add Controller Method**
```javascript
exports.rateMeal = async (req, res) => {
  // Add rating to meal
}
```

**Step 3: Add Route**
```javascript
router.post('/:id/rate', auth, authRole('student'), rateMeal);
```

**Step 4: Frontend API**
```javascript
export const mealAPI = {
  rateMeal: (id, data) => api.post(`/meals/${id}/rate`, data)
}
```

**Step 5: Update Component**
```javascript
const handleRate = async (mealId, rating) => {
  await mealAPI.rateMeal(mealId, { rating });
}
```

---

## Deployment Considerations

### Before Production

1. **Change JWT_SECRET** - Use strong, random string
2. **Update MONGODB_URI** - Use MongoDB Atlas (cloud)
3. **Enable HTTPS** - For secure communication
4. **Set NODE_ENV** - To "production"
5. **Add rate limiting** - Prevent API abuse
6. **Add logging** - For debugging production issues
7. **Setup error tracking** - Sentry or similar

### Hosting Options

- **Backend:** Heroku, Railway, Render
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Database:** MongoDB Atlas (cloud)

---

## Performance Tips

1. **Pagination** - Already in bookings API
2. **Indexes** - Already on key fields
3. **Lazy loading** - Add for meal images
4. **Caching** - Add Redis for frequently accessed data
5. **CDN** - Use for static assets in production

---

This architecture is scalable, secure, and follows industry best practices. Happy building! 🚀
