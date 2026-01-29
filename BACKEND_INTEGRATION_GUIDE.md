# 🔌 Backend API Integration Guide

## Current Setup

Your frontend is **already configured** to work with real backend APIs! Here's what you need to do:

---

## Step 1: Update Environment Variables

Your `.env.local` file already has the backend URL:

```env
NEXT_PUBLIC_API_URL=http://192.168.1.19:5050
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

✅ **Mock mode is already disabled** - the app will use real APIs.

---

## Step 2: Verify Backend API Endpoints

The frontend expects these endpoints:

### Login API
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin" // or "developer" or "qa"
  }
}
```

### Register API
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "qa" // or "admin" or "developer"
}
```

**Expected Response:**
```json
{
  "message": "User registered successfully"
}
```

### Get Current User (Optional)
```
GET /api/auth/me
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

---

## Step 3: If Your API Endpoints Are Different

If your backend uses different endpoint paths, update `context/AuthContext.tsx`:

### Example: Different Login Endpoint

If your login endpoint is `/auth/login` instead of `/api/auth/login`:

```typescript
// In context/AuthContext.tsx, line ~75
const res = await axiosInstance.post('/auth/login', {  // Changed from /api/auth/login
  email,
  password,
});
```

### Example: Different Register Endpoint

If your register endpoint is `/auth/register`:

```typescript
// In context/AuthContext.tsx, line ~105
await axiosInstance.post('/auth/register', {  // Changed from /api/auth/register
  name,
  email,
  password,
  role,
});
```

---

## Step 4: If Your Response Format Is Different

### Example: Token in Different Field

If your backend returns token as `access_token` instead of `token`:

```typescript
// In context/AuthContext.tsx, line ~82
const { access_token: token, user } = response;  // Changed from { token, user }
```

### Example: User Data in Different Structure

If your backend returns user data differently:

```typescript
// Backend returns: { data: { token, userInfo: {...} } }

// Update line ~82 in AuthContext.tsx:
const { token, userInfo: user } = response.data;
```

---

## Step 5: Test the Integration

### 1. Start Your Backend Server
Make sure your backend is running at `http://192.168.1.19:5050`

### 2. Test Registration
```bash
# Open browser
http://localhost:3000/register

# Fill form and submit
# Check browser console for any errors
# Check Network tab in DevTools
```

### 3. Test Login
```bash
# Open browser
http://localhost:3000/login

# Use credentials you just registered
# Should redirect to /dashboard on success
```

### 4. Check Browser Console
Open DevTools (F12) and look for:
- ✅ Successful API calls in Network tab
- ❌ Any error messages in Console tab

---

## Common Issues & Solutions

### Issue 1: CORS Error
```
Access to XMLHttpRequest at 'http://192.168.1.19:5050/api/auth/login' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:** Add CORS headers in your backend:

```javascript
// Express.js example
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue 2: 404 Not Found
```
POST http://192.168.1.19:5050/api/auth/login 404 (Not Found)
```

**Solution:** Check your backend route paths. Update frontend endpoints to match.

### Issue 3: Token Not Sent in Requests
```
401 Unauthorized on protected routes
```

**Solution:** The axios interceptor automatically adds the token. Check:
1. Token is saved in localStorage after login
2. Backend expects `Authorization: Bearer {token}` header

### Issue 4: Role Field Mismatch
```
Backend expects "customer" but frontend sends "qa"
```

**Solution:** Update role mapping in register page or backend validation.

---

## What Happens After Login?

1. **Token Storage:** JWT token saved to `localStorage.getItem('token')`
2. **User Storage:** User object saved to `localStorage.getItem('user')`
3. **Auto-Attach Token:** All subsequent API calls automatically include `Authorization: Bearer {token}` header
4. **Redirect:** User redirected to `/dashboard`
5. **Protected Routes:** Middleware checks authentication on protected pages

---

## Testing Checklist

- [ ] Backend server is running
- [ ] CORS is configured on backend
- [ ] Register endpoint works (test with Postman first)
- [ ] Login endpoint works (test with Postman first)
- [ ] Response format matches expected structure
- [ ] Token is returned in response
- [ ] User object contains id, name, email, role
- [ ] Frontend can register new user
- [ ] Frontend can login with registered user
- [ ] User is redirected to dashboard after login
- [ ] Token is stored in localStorage
- [ ] Protected routes work after login
- [ ] Logout clears token and redirects to login

---

## Need Help?

### Check These Files:
1. `context/AuthContext.tsx` - Login/register logic
2. `lib/axios.ts` - API configuration and interceptors
3. `.env.local` - Backend URL configuration
4. Browser DevTools Network tab - See actual API calls

### Debug Mode:
Add console logs to see what's happening:

```typescript
// In context/AuthContext.tsx, login function
console.log('Login request:', { email, password });
console.log('Login response:', response);
console.log('Token:', token);
console.log('User:', user);
```

---

## Next Steps After Auth Works

Once login/register work, you can integrate:
1. Ticket CRUD APIs
2. User management APIs
3. Project management APIs
4. Comments and attachments APIs

Let me know your backend API structure and I'll help you integrate!
