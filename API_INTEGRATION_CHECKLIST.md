# ✅ API Integration Checklist

## Tell Me Your Backend API Details

Please provide the following information about your backend APIs:

---

## 1. Login API

**Endpoint URL:** (e.g., `/api/auth/login` or `/auth/login` or `/login`)
```
POST _____________________
```

**Request Body Format:**
```json
{
  "email": "?",
  "password": "?"
  // Any other fields?
}
```

**Response Format:**
```json
{
  // What does your backend return?
  // Example:
  // "token": "...",
  // "user": { ... }
  // OR
  // "access_token": "...",
  // "data": { ... }
}
```

---

## 2. Register API

**Endpoint URL:** (e.g., `/api/auth/register` or `/auth/register` or `/signup`)
```
POST _____________________
```

**Request Body Format:**
```json
{
  "name": "?",
  "email": "?",
  "password": "?",
  "role": "?"
  // Any other fields?
}
```

**Response Format:**
```json
{
  // What does your backend return?
  // Example:
  // "message": "Success"
  // OR
  // "token": "...",
  // "user": { ... }
}
```

---

## 3. Role Values

What role values does your backend accept?

- [ ] "admin"
- [ ] "developer" 
- [ ] "qa"
- [ ] "customer"
- [ ] Other: ___________

---

## 4. Token Format

How does your backend send the JWT token?

- [ ] In response body as `token`
- [ ] In response body as `access_token`
- [ ] In response body as `jwt`
- [ ] Other: ___________

---

## 5. User Object Format

What fields does your user object contain?

```json
{
  "id": "?",           // Required
  "name": "?",         // Required
  "email": "?",        // Required
  "role": "?",         // Required
  // Any other fields?
}
```

---

## 6. Error Response Format

How does your backend return errors?

```json
{
  // Example:
  // "message": "Invalid credentials"
  // OR
  // "error": "Invalid credentials"
  // OR
  // "errors": { "email": ["Invalid email"] }
}
```

---

## 7. Protected Routes (Optional)

Do you have an endpoint to verify the current user?

**Endpoint URL:**
```
GET _____________________
```

**Headers Required:**
```
Authorization: Bearer {token}
```

**Response Format:**
```json
{
  // What does it return?
}
```

---

## Quick Setup Instructions

Once you provide the above information, I will:

1. ✅ Update `context/AuthContext.tsx` with correct endpoints
2. ✅ Update request/response mapping
3. ✅ Update error handling
4. ✅ Test the integration
5. ✅ Provide you with test credentials

---

## Example: If Your API Looks Like This

### Login: `POST /auth/login`
```json
Request: { "email": "...", "password": "..." }
Response: { "access_token": "...", "user": { "id": 1, "name": "...", "email": "...", "role": "admin" } }
```

### Register: `POST /auth/register`
```json
Request: { "name": "...", "email": "...", "password": "...", "role": "admin" }
Response: { "message": "User created successfully" }
```

**Then I will update:**

```typescript
// In context/AuthContext.tsx

// Login function (line ~75)
const res = await axiosInstance.post('/auth/login', {  // Changed endpoint
  email,
  password,
});
const { access_token: token, user } = res.data;  // Changed token field name

// Register function (line ~105)
await axiosInstance.post('/auth/register', {  // Changed endpoint
  name,
  email,
  password,
  role,
});
```

---

## What to Share

Please share:

1. **Your backend API documentation** (if available)
2. **Example request/response** from Postman or similar tool
3. **Backend code snippet** showing the endpoints (if possible)

Or simply answer the questions above and I'll configure everything for you!
