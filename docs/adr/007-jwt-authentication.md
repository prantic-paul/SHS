# ADR-007: Use JWT (JSON Web Tokens) for Authentication

## Status
Accepted

## Date
2025-12-19

## Context

We need to implement authentication for Smart Health Synchronizer that can:
- Authenticate doctors and patients separately
- Secure API endpoints
- Work with separate frontend and backend
- Support mobile apps in future
- Be stateless and scalable
- Provide token refresh mechanism

### Requirements
- Stateless authentication
- Works with REST API
- Secure token transmission
- Token expiration
- Refresh token support
- Easy to implement with Django and React

### Options Considered

**Option 1: JWT (JSON Web Tokens)**
- Stateless authentication
- Self-contained tokens
- Works perfectly with REST APIs
- Industry standard for SPAs
- djangorestframework-simplejwt package

**Option 2: Session-based Authentication**
- Django's built-in system
- Stateful (requires session storage)
- Cookies required
- Not ideal for mobile apps

**Option 3: OAuth 2.0**
- Industry standard for third-party auth
- Complex to implement
- Overkill for our use case

**Option 4: Token Authentication (DRF)**
- Simple token-based auth
- No expiration by default
- Less secure than JWT

## Decision

We will use **JWT (JSON Web Tokens)** with `djangorestframework-simplejwt`.

## Rationale

### Why JWT?

1. **Stateless Authentication**
   - No server-side session storage
   - Tokens contain all necessary information
   - Scales horizontally easily
   - No database lookup for every request

2. **Perfect for REST APIs**
   - Designed for stateless APIs
   - Works across different domains (CORS)
   - Standard in modern web development
   - Easy frontend integration

3. **Security**
   - Tokens are signed (HS256 or RS256)
   - Cannot be tampered with
   - Short expiration times
   - Refresh token mechanism

4. **Flexibility**
   - Works with web, mobile, desktop
   - Can include custom claims
   - Role-based access control
   - User information in token

5. **Industry Standard**
   - Used by Google, Microsoft, Facebook
   - Well-documented
   - Many libraries available
   - Established best practices

6. **Django Integration**
   - `djangorestframework-simplejwt` package
   - Easy to set up
   - Customizable
   - Well-maintained

## Consequences

### Positive

✅ **Stateless & Scalable**
- No session storage required
- Scales horizontally
- Can use multiple servers
- No shared state between servers

✅ **Cross-Domain Support**
- Works with CORS
- Frontend and backend on different domains
- Future mobile app support
- Microservices friendly

✅ **Security**
- Tokens expire automatically
- Refresh token for getting new access tokens
- Cannot be modified without detection
- Logout possible via blacklisting

✅ **Developer Experience**
- Easy to implement in React
- Simple API integration
- Store in localStorage or memory
- Standard HTTP header (Authorization: Bearer <token>)

✅ **Performance**
- No database lookup for auth
- Fast verification (signature check)
- Tokens contain user info
- Reduces server load

✅ **Future-Proof**
- Works with mobile apps (React Native)
- Works with desktop apps
- API can be consumed by any client
- Standard protocol

### Negative

❌ **Token Size**
- Larger than session IDs
- Sent with every request
- Mitigation: Still small (few KB)

❌ **Token Invalidation**
- Can't immediately revoke tokens
- Token valid until expiration
- Mitigation: Short expiration + refresh tokens + blacklist

❌ **Storage Security**
- Must be stored securely in frontend
- XSS vulnerability if not careful
- Mitigation: Use httpOnly cookies or secure storage

❌ **Complexity**
- More complex than session auth
- Need to handle refresh tokens
- Mitigation: Good libraries available

## Implementation Details

### JWT Structure
```
Header.Payload.Signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VyX2lkIjoxLCJlbWFpbCI6ImRvY3RvckBleGFtcGxlLmNvbSIsImV4cCI6MTYzODM2MjQwMH0.
4Adcj0mW5sP9D8fE0QnP6sY8wX7vZ9kL2mN3oP4qR5s
```

### Token Types

**Access Token:**
- Short-lived (15-60 minutes)
- Used for API requests
- Contains user information
- Cannot be refreshed once expired

**Refresh Token:**
- Long-lived (24 hours - 7 days)
- Used to get new access tokens
- Stored securely
- Can be revoked

### Django Configuration
```python
# settings.py
from datetime import timedelta

INSTALLED_APPS = [
    # ...
    'rest_framework',
    'rest_framework_simplejwt',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}
```

### API Endpoints
```python
# urls.py
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

### Authentication Flow

**1. User Login:**
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "doctor@example.com",
  "password": "securepassword"
}

Response:
{
  "access": "eyJhbGciOiJIUzI1NiIs...",
  "refresh": "eyJhbGciOiJIUzI1NiIs..."
}
```

**2. Authenticated Request:**
```http
GET /api/appointments/
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**3. Token Refresh:**
```http
POST /api/auth/refresh/
Content-Type: application/json

{
  "refresh": "eyJhbGciOiJIUzI1NiIs..."
}

Response:
{
  "access": "eyJhbGciOiJIUzI1NiIs..." (new token)
}
```

### React Integration

**Login Component:**
```javascript
// services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login/`, {
    email,
    password
  });
  
  // Store tokens
  localStorage.setItem('accessToken', response.data.access);
  localStorage.setItem('refreshToken', response.data.refresh);
  
  return response.data;
};
```

**Axios Interceptor:**
```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken
        });
        
        localStorage.setItem('accessToken', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        
        return api(originalRequest);
      } catch (err) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### Protected Routes (React)
```javascript
// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Usage
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### Custom Claims
```python
# serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['email'] = user.email
        token['user_type'] = user.user_type  # 'doctor' or 'patient'
        token['name'] = user.get_full_name()
        
        return token
```

## Security Best Practices

1. **Token Storage**
   - Store in memory (most secure)
   - Or localStorage (convenient)
   - Or httpOnly cookies (secure, but complex with CORS)

2. **Token Expiration**
   - Short access token lifetime (15-60 min)
   - Longer refresh token lifetime (1-7 days)
   - Automatic refresh when expired

3. **HTTPS Only**
   - Always use HTTPS in production
   - Prevents token interception

4. **Token Blacklisting**
   - Implement token blacklist for logout
   - Use `rest_framework_simplejwt.token_blacklist`

5. **Secure Secrets**
   - Use strong SECRET_KEY
   - Rotate keys periodically
   - Keep secrets in environment variables

## Logout Implementation
```python
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"})
        except Exception:
            return Response({"error": "Invalid token"}, status=400)
```

## Why Not Other Authentication Methods?

### Session-based Auth
- **Cons**: Stateful, requires cookies, not ideal for mobile
- **When to use**: Traditional web apps with server-side rendering

### OAuth 2.0
- **Cons**: Complex, overkill for our use case
- **When to use**: Third-party authentication (Google, Facebook login)

### Token Authentication (DRF)
- **Cons**: No expiration, less secure
- **When to use**: Internal tools, simple APIs

## Review Date

This decision will be reviewed at the end of Sprint 1 after implementing authentication.

## References

- [JWT.io](https://jwt.io/)
- [djangorestframework-simplejwt](https://django-rest-framework-simplejwt.readthedocs.io/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP JWT Security](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

## Notes

- JWT is the industry standard for REST API authentication
- Perfect for our SPA (Single Page Application) architecture
- Works seamlessly with Django and React
- Supports future mobile app development
- Stateless design enables horizontal scaling
- Short access token + refresh token = good security
- Always use HTTPS in production
- Store tokens securely in frontend
