# 🚀 Quick Startup Instructions

## ⚠️ MongoDB is Required First

Your application is built and ready, but we need MongoDB running first.

---

## 🔧 Option 1: Use MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster (it's free)
4. Get your connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`)
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://your_connection_string_here
   ```
6. Then run the startup commands below

---

## 🔧 Option 2: Install MongoDB Locally

### On Windows:

1. Download MongoDB Community Edition:
   https://www.mongodb.com/try/download/community

2. Run the installer and choose "Install MongoDB as a Windows Service"

3. MongoDB will start automatically

4. Verify it's running:
   ```bash
   mongosh
   # If you see a connection, MongoDB is running!
   ```

5. Then run the startup commands below

---

## ▶️ Start the Application

After MongoDB is ready, run these commands:

### Terminal 1 - Backend:
```bash
cd d:\sem4\DTI2\food-waste-management\backend
npm run dev
```
You should see: `Server running on port 5000`

### Terminal 2 - Frontend:
```bash
cd d:\sem4\DTI2\food-waste-management\frontend
npm start
```
Browser will open to `http://localhost:3000`

---

## ✅ Check if Everything Started

- ✅ Backend: http://localhost:5000/api/health
- ✅ Frontend: http://localhost:3000
- ✅ MongoDB: Running on localhost:27017

---

## 🎯 First Steps

1. Create an account (Register page)
2. Login as Student
3. View available meals
4. Book a meal
5. Check your bookings

---

## 🆘 Troubleshooting

**"Cannot connect to MongoDB"**
- MongoDB is not running
- Check your connection string in .env
- Try MongoDB Atlas (cloud option)

**"Port already in use"**
```bash
# Kill the process using port 5000
taskkill /F /IM node.exe

# Kill the process using port 3000
taskkill /F /IM node.exe
```

**"npm not found"**
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

---

## 📍 Project Files Location
```
d:\sem4\DTI2\food-waste-management\
```

.env files are already created at:
- `backend/.env`
- `frontend/.env`

---

Once MongoDB is setup, the app will work perfectly! 🚀
