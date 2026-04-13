# DEBUGGING THE "NOT AUTHORIZED" ERROR

## Step 1: Open Browser DevTools
1. Go to http://localhost:3000
2. Press F12 (Open Developer Tools)
3. Go to Console tab
4. Keep it open!

## Step 2: Register & Check Token
1. Click "Register here"
2. Fill form with:
   - Name: Test User
   - Email: debug@test.com
   - Password: pass123456
   - Phone: 9876543210
   - Role: Student
   - Reg No: 2023001
   - Department: CSE
3. Click "Sign Up"

## Step 3: Check Console for Errors
After registration, look at the Console tab:
- Do you see any RED errors?
- Copy the exact error text

## Step 4: Check localStorage
1. Go to DevTools → Application
2. Click LocalStorage → http://localhost:3000
3. Look for "token" key
4. Does it have a long string starting with "eyJ..."?
   - YES = Token saved ✅
   - NO = Token NOT saved ❌

## Step 5: Try Booking & Capture Error
1. Close DevTools Console first (click X)
2. Reopen Console
3. Click "Book Meal" on any meal
4. Look at Console - what error appears?
5. Copy the EXACT error message

## Step 6: Check Network Tab
1. Go to Network tab
2. Try booking again
3. Look for a request named: "POST /api/bookings" or similar
4. Click on it
5. Look at Response tab - what error does it show?

Share:
- The exact error message from Console
- The Network response
- Whether token is in localStorage
