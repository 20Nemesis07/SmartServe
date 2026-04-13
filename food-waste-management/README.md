# Food Waste Management System

A MERN stack application designed to reduce food waste in college mess by enabling students to pre-book meals and connecting surplus food with NGOs.

## Features

### 🎓 Student Features
- Pre-book meals for breakfast, lunch, and dinner
- View meal details (nutrition, ingredients, dietary options)
- Cancel bookings up to 24 hours before meal time
- Track booking history
- Points system for sustainable eating

### 🍳 Mess Committee Features
- Real-time meal management
- View booking statistics
- Track food prepared vs consumed
- Monitor waste reduction
- Create and manage weekly menus

### 🤝 NGO Integration
- Notify registered NGOs about surplus food
- Track food donations
- Maintain donation records for tax documentation

## Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB
- JWT Authentication
- Node-Cron for scheduled tasks

**Frontend:**
- React 18
- React Router v6
- Zustand for state management
- Axios for API calls
- Recharts for analytics

## Project Structure

```
food-waste-management/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Meal.js
│   │   ├── Booking.js
│   │   ├── FoodSurplus.js
│   │   ├── NGO.js
│   │   └── Analytics.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── mealController.js
│   │   └── bookingController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── mealRoutes.js
│   │   └── bookingRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── authRole.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── StudentDashboard.js
    │   │   └── MessDashboard.js
    │   ├── styles/
    │   │   ├── global.css
    │   │   ├── auth.css
    │   │   ├── dashboard.css
    │   │   └── mess-dashboard.css
    │   ├── utils/
    │   │   └── api.js
    │   ├── context/
    │   │   └── useAuthStore.js
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── .env.example
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
npm install
```

2. **Create .env file:**
```bash
cp .env.example .env
```

3. **Update .env with your credentials:**
```
MONGODB_URI=mongodb://localhost:27017/food-waste-management
PORT=5000
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
```

4. **Start MongoDB locally:**
```bash
mongod
```

5. **Run backend server:**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
npm install
```

2. **Create .env file:**
```bash
cp .env.example .env
```

3. **Update .env:**
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start React app:**
```bash
npm start
```

App will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - Logout

### Meals
- `GET /api/meals` - Get all meals
- `GET /api/meals/:id` - Get meal details
- `POST /api/meals` - Create meal (Mess staff only)
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal
- `GET /api/meals/date/:date` - Get meals for specific date

### Bookings
- `GET /api/bookings/my-bookings` - Get student's bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/consumed` - Mark as consumed
- `GET /api/bookings` - Get all bookings (Mess staff)
- `GET /api/bookings/stats/:date` - Get booking statistics

## User Roles

1. **Student**
   - Pre-book meals
   - View meal details
   - Cancel bookings
   - Track history

2. **Mess Staff**
   - Create and manage meals
   - View bookings
   - Track waste
   - Update meal stats

3. **NGO Admin**
   - View available surplus food
   - Claim donations
   - Track donations

## Default Test Credentials (After Setup)

**Student:**
- Email: student@test.com
- Password: password123

**Mess Staff:**
- Email: mess@test.com
- Password: password123

## Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Email/SMS notifications
- [ ] Analytics dashboard with charts
- [ ] Payment gateway integration
- [ ] Gamification features (badges, leaderboards)
- [ ] Advanced meal recommendations
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email: support@foodwaste.edu or create an issue in the repository.

## Authors

- **Your Name** - Project Lead

## Acknowledgments

- College Mess Committee
- Partner NGOs
- All contributors
