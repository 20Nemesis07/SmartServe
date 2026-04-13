# Quick Start Guide

## One-Click Setup

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Setup Environment Variables

**Backend (.env):**
```bash
cd backend
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/food-waste-management
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
EOF
cd ..
```

**Frontend (.env):**
```bash
cd frontend
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Food Waste Management
EOF
cd ..
```

### Step 3: Start MongoDB

#### On Windows:
```bash
mongod
```

#### On Mac/Linux:
```bash
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### Step 4: Run Backend Server

```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

### Step 5: Run Frontend (In new terminal)

```bash
cd frontend
npm start
# App will open at http://localhost:3000
```

## Testing the Application

### 1. Register Account
- Navigate to http://localhost:3000
- Click "Register here"
- Choose role (Student/Mess Staff)
- Fill in details and register

### 2. Student Testing
- Login as a student
- View available meals for today
- Click "Book Meal" to pre-book
- Check your bookings in sidebar
- Click "Cancel Booking" to cancel

### 3. Mess Staff Testing
- Login as mess staff
- Click "+ Add New Meal" to create meals
- Fill in meal details
- View all bookings on dashboard
- Update prepared and consumed quantities

## Troubleshooting

### MongoDB Not Connecting
```bash
# Check if MongoDB is running
mongodb
# or
mongosh

# Start MongoDB
mongod
```

### Port Already in Use
```bash
# Kill process on port 5000 (Backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (Frontend)
lsof -ti:3000 | xargs kill -9
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS Error | Check FRONTEND_URL in backend .env |
| 404 on meal creation | Ensure you're logged in as mess_staff |
| Can't book meal | Check meal date is in future |
| JWT Error | Regenerate token, re-login |

## Next Steps

1. ✅ Complete setup and test basic features
2. 🎯 Customize UI with your college branding
3. 📱 Add more features (NGO integration, Analytics)
4. 🚀 Deploy to production
5. 📊 Monitor and optimize

## Need Help?

Check the main README.md for:
- API Endpoints documentation
- Project structure explanation
- Feature descriptions
- Future enhancements

Happy coding! 🎉
