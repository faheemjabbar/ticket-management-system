# 🔧 CORS Error Fix Guide

## The Problem

Your backend at `http://192.168.1.19:5050` is blocking requests from your frontend at `http://localhost:3000` because CORS (Cross-Origin Resource Sharing) is not configured.

---

## Solution: Configure CORS on Backend

### Option 1: Express.js (Node.js)

Install the CORS package:
```bash
npm install cors
```

Add CORS middleware to your backend:
```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:3000',  // Your frontend URL
  credentials: true,                 // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Your routes here...
app.post('/auth/login', ...);
app.post('/auth/register', ...);

app.listen(5050, () => {
  console.log('Server running on port 5050');
});
```

### Option 2: Express.js - Allow Multiple Origins

If you want to allow multiple origins (development + production):
```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.1.19:3000',
  'https://yourproductiondomain.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Option 3: Fastify (Node.js)

```bash
npm install @fastify/cors
```

```javascript
const fastify = require('fastify')();
const cors = require('@fastify/cors');

fastify.register(cors, {
  origin: 'http://localhost:3000',
  credentials: true
});

// Your routes...
fastify.post('/auth/login', ...);
```

### Option 4: NestJS

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
  
  await app.listen(5050);
}
bootstrap();
```

### Option 5: Python Flask

```bash
pip install flask-cors
```

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS
CORS(app, origins=['http://localhost:3000'], supports_credentials=True)

@app.route('/auth/login', methods=['POST'])
def login():
    # Your login logic
    pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050)
```

### Option 6: Python Django

```python
# settings.py
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this at the top
    'django.middleware.common.CommonMiddleware',
    # ...
]

# CORS settings
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

### Option 7: Go (Gin Framework)

```go
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

func main() {
    router := gin.Default()
    
    // CORS configuration
    router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        AllowCredentials: true,
    }))
    
    // Your routes
    router.POST("/auth/login", loginHandler)
    router.POST("/auth/register", registerHandler)
    
    router.Run(":5050")
}
```

### Option 8: Manual CORS Headers (Any Framework)

If you can't use a CORS library, add headers manually:

```javascript
// Express.js example
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
```

---

## Quick Test After Fixing CORS

### 1. Restart Your Backend Server
After adding CORS configuration, restart your backend.

### 2. Test with curl
```bash
curl -X OPTIONS http://192.168.1.19:5050/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

You should see these headers in the response:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 3. Test Login Again
Go to `http://localhost:3000/login` and try logging in again.

---

## Common CORS Mistakes

### ❌ Wrong: Using Wildcard with Credentials
```javascript
// This will NOT work
app.use(cors({
  origin: '*',           // Wildcard
  credentials: true      // Can't use both!
}));
```

### ✅ Correct: Specific Origin with Credentials
```javascript
app.use(cors({
  origin: 'http://localhost:3000',  // Specific origin
  credentials: true                  // Now it works!
}));
```

### ❌ Wrong: Missing Preflight Handler
```javascript
// Missing OPTIONS handler
app.post('/auth/login', ...);
```

### ✅ Correct: Handle OPTIONS Requests
```javascript
// CORS middleware handles OPTIONS automatically
app.use(cors({ ... }));
app.post('/auth/login', ...);
```

---

## Development vs Production

### Development (Multiple Local URLs)
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.1.19:3000'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

### Production (Specific Domain)
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://yourapp.com',
  credentials: true
}));
```

---

## Alternative: Use Proxy (Temporary Solution)

If you can't modify the backend right now, you can use Next.js proxy:

### Create `next.config.ts`:
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.19:5050/:path*',
      },
    ];
  },
};

export default nextConfig;
```

### Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=/api
```

This way, all API calls go through Next.js server, avoiding CORS.

**Note:** This is a workaround. The proper solution is to fix CORS on the backend.

---

## Verify CORS is Fixed

After configuring CORS, you should see:

### In Browser Network Tab:
1. **Preflight Request (OPTIONS)**
   - Status: 200 OK
   - Headers include `Access-Control-Allow-Origin`

2. **Actual Request (POST)**
   - Status: 200 OK (or appropriate status)
   - No CORS errors

### In Browser Console:
- ✅ No CORS errors
- ✅ Login request succeeds
- ✅ Response data received

---

## Need Help?

Tell me:
1. What backend framework are you using? (Express, Flask, Django, etc.)
2. Can you modify the backend code?
3. Do you have access to backend server configuration?

I'll provide specific instructions for your setup!
