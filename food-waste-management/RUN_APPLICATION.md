# 🚀 Manual Startup Instructions

Your project is fully configured! Here's how to start it:

## Step 1: Open 3 Command Prompts/PowerShell Windows

## Step 2: In Command Prompt #1 - Start Backend Server
```bash
cd d:\sem4\DTI2\food-waste-management\backend
npm run dev
```

**Expected Output:**
```
> food-waste-management-backend@1.0.0 dev
> nodemon server.js

Server running on port 5000
MongoDB Connected: ac-mqxomag-shard-00-00.f0ptarl.mongodb.net
```

## Step 3: In Command Prompt #2 - Start Frontend Server
```bash
cd d:\sem4\DTI2\food-waste-management\frontend
npm start
```

**Expected Output:**
```
> food-waste-management-frontend@0.1.0 start
> react-scripts start

Compiled successfully!
```

A browser window will automatically open with the app!

## Step 4: Open Your Application

**URL:** http://localhost:3000

---

## ✅ Verify Everything is Running

**Backend API:** http://localhost:5000/api/health
- Should show: `{"success":true,"message":"Server is running"}`

**Frontend:** http://localhost:3000
- Should show the login page

---

## 🎯 Test the Application

### Create a Student Account:
1. Click "Register here"
2. Fill in details:
   - Name: `Your Name`
   - Email: `student@college.com`
   - Password: `password123`
   - Phone: `9876543210`
   - Role: `Student`
   - Registration No: `2023001`
   - Department: `CSE`
3. Click "Sign Up"
4. You'll be logged in automatically

### Book a Meal:
1. Select today's date or tomorrow
2. You'll see available meals
3. Click "Book Meal"
4. Check sidebar to see your bookings

### Test Mess Staff:
1. Register another account with Role: `Mess Staff`
2. After login, you'll see Mess Committee Dashboard
3. Click "+ Add New Meal"
4. Create a meal and view bookings

---

## 🆘 Troubleshooting

### Port Already in Use?

**Find and kill processes on ports:**

Open PowerShell as Admin and run:
```powershell
# Kill process on port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

Then start the servers again.

### MongoDB Connection Error?

Make sure your `.env` file has the correct connection string:
```
MONGODB_URI=mongodb+srv://shubhamjain2007delhi_db_user:Shubham%40123@cluster0.f0ptarl.mongodb.net/?appName=Cluster0
```

Note: Password has `%40` instead of `@`

### npm command not found?

Restart your terminal or reinstall Node.js from https://nodejs.org/

---

## 📊 Next Steps After Testing

1. ✅ Test student booking feature
2. ✅ Test mess staff dashboard
3. ✅ Register as different roles
4. ✅ Create and manage meals
5. ✅ Add NGO feature (coming next)
6. ✅ Deploy to production

---

**Happy Testing!** 🎉
