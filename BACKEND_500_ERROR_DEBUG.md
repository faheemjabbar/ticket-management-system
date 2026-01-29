# 🔍 Backend 500 Error - Debugging Guide

## The Problem

Your backend is returning **500 Internal Server Error** for both:
- `POST /auth/login`
- `POST /auth/register`

This means the frontend is working correctly, but there's an error in your backend code.

---

## Step 1: Check Browser Console

Open your browser console (F12) and look for these logs:

### For Register:
```
📝 Register attempt: { name: "...", email: "...", role: "...", password: "***" }
❌ Register error: { message: "...", response: {...}, status: 500 }
```

### For Login:
```
🔐 Login attempt: { email: "...", password: "***" }
❌ Login error: { message: "...", response: {...}, status: 500 }
```

**Take a screenshot of the error details and share them.**

---

## Step 2: Check Backend Logs

Look at your backend server console/logs. You should see error messages like:

```
Error: Cannot read property 'x' of undefined
  at /path/to/your/backend/auth.js:123
```

**This will tell you exactly what's wrong.**

---

## Common Backend Issues

### Issue 1: Database Connection Error

**Symptoms:**
```
Error: connect ECONNREFUSED
MongoError: failed to connect to server
```

**Fix:** Make sure your database is running and connection string is correct.

---

### Issue 2: Missing Environment Variables

**Symptoms:**
```
Error: JWT_SECRET is not defined
Error: DATABASE_URL is not defined
```

**Fix:** Check your backend `.env` file has all required variables:
```env
JWT_SECRET=your_secret_key_here
DATABASE_URL=mongodb://localhost:27017/yourdb
PORT=5050
```

---

### Issue 3: Password Hashing Error

**Symptoms:**
```
Error: data and salt arguments required
Error: bcrypt error
```

**Fix:** Make sure bcrypt is installed and used correctly:
```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

---

### Issue 4: Database Schema Mismatch

**Symptoms:**
```
ValidationError: User validation failed
Error: Field 'x' is required
```

**Fix:** Make sure your User model matches the data being sent:
```javascript
// Frontend sends:
{ name, email, password, role }

// Backend expects:
const userSchema = {
  name: String,
  email: String,
  password: String,
  role: String
}
```

---

### Issue 5: Duplicate Email Error

**Symptoms:**
```
Error: E11000 duplicate key error
Error: Email already exists
```

**Fix:** This is expected behavior. Try registering with a different email.

---

### Issue 6: JWT Token Generation Error

**Symptoms:**
```
Error: secretOrPrivateKey must have a value
Error: jwt malformed
```

**Fix:** Make sure JWT_SECRET is set and jwt.sign is used correctly:
```javascript
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

---

## Step 3: Test Backend Directly with Postman/curl

### Test Register:
```bash
curl -X POST http://192.168.1.19:5050/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "developer"
  }' \
  -v
```

### Test Login:
```bash
curl -X POST http://192.168.1.19:5050/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -v
```

**What do you see?** Share the response.

---

## Step 4: Check Backend Request Body Parsing

Make sure your backend is parsing JSON request bodies:

### Express.js:
```javascript
const express = require('express');
const app = express();

// IMPORTANT: Add this BEFORE your routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Now your routes
app.post('/auth/login', (req, res) => {
  console.log('Request body:', req.body);  // Should show { email, password }
  // ...
});
```

### Fastify:
```javascript
// Fastify parses JSON by default, but make sure content-type is set
fastify.post('/auth/login', async (request, reply) => {
  console.log('Request body:', request.body);
  // ...
});
```

---

## Step 5: Check Backend Response Format

Make sure your backend returns the correct format:

### Register Response (Success):
```javascript
// Should return:
res.status(201).json({
  message: "User registered successfully"
});

// OR with user data:
res.status(201).json({
  message: "User registered successfully",
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: true
  }
});
```

### Login Response (Success):
```javascript
// MUST return:
res.status(200).json({
  access_token: token,  // NOT "token"
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: true
  }
});
```

### Error Response:
```javascript
// Should return:
res.status(400).json({
  message: "Invalid credentials"
});

// OR
res.status(500).json({
  message: "Internal server error",
  error: error.message  // For debugging
});
```

---

## Step 6: Enable Detailed Error Logging

Add this to your backend to see detailed errors:

### Express.js:
```javascript
// Error handling middleware (add at the END of your routes)
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  console.error('Stack:', err.stack);
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});
```

---

## Step 7: Check What Frontend is Sending

Now try to register/login again and check the browser console. You should see:

```
📝 Register attempt: {
  name: "Test User",
  email: "test@example.com",
  role: "developer",
  password: "***"
}

❌ Register error: {
  message: "Request failed with status code 500",
  response: {
    message: "Actual error message from backend",
    error: "Detailed error info"
  },
  status: 500,
  statusText: "Internal Server Error"
}
```

**Share this error message with me!**

---

## Quick Checklist

- [ ] Backend server is running
- [ ] Database is running and connected
- [ ] Environment variables are set (JWT_SECRET, DATABASE_URL, etc.)
- [ ] `express.json()` middleware is added (for Express)
- [ ] CORS is configured
- [ ] Backend logs show the actual error
- [ ] Request body is being received correctly
- [ ] Response format matches expected format

---

## Example Working Backend (Express.js)

Here's a minimal working example:

```javascript
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Mock database (replace with real database)
const users = [];

// Register endpoint
app.post('/auth/register', async (req, res) => {
  try {
    console.log('Register request:', req.body);
    
    const { name, email, password, role } = req.body;
    
    // Validate
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true
    };
    
    users.push(user);
    
    console.log('User registered:', user.email);
    
    res.status(201).json({
      message: 'User registered successfully'
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    console.log('Login request:', req.body);
    
    const { email, password } = req.body;
    
    // Validate
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    console.log('User logged in:', user.email);
    
    // Return response (IMPORTANT: use access_token, not token)
    res.status(200).json({
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Verify token endpoint
app.get('/api/auth/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
    
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Start server
app.listen(5050, () => {
  console.log('Server running on http://localhost:5050');
});
```

---

## What to Share

To help you debug, please share:

1. **Browser console logs** (the error details)
2. **Backend server logs** (what error is shown)
3. **Backend framework** (Express, NestJS, Flask, etc.)
4. **Backend code** for `/auth/login` and `/auth/register` routes

Then I can help you fix the specific issue!
