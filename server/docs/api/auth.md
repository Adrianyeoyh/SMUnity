# API: Authentication

## Overview
Handles all authentication-related endpoints such as login guards, organisation invites, and BetterAuth passthrough routes. 
Used by all users (students, organisations, and admins) for secure access and sign-in.

---

## Endpoints

### POST /api/auth/invite
**Description:** Create an invite token for an organisation to sign up.  
**Auth:** Admin

**Request Body**
```json
{
  "email": "org@example.com"
}
```

**Response**
```json
{
  "ok": true,
  "token": "uuid-token-string",
  "expiresAt": "2025-10-27T12:00:00Z"
}
```

**Example**
```bash
curl -X POST http://localhost:4001/api/auth/invite   -H "Content-Type: application/json"   -d '{"email": "org@example.com"}'
```

---

### GET /api/auth/guard
**Description:** Validates a user's current authentication session. Ensures SMU students use an SMU email and organisations are invited.  
**Auth:** All users (Student / Organisation / Admin)

**Response**
```json
{ "ok": true }
```

**Example**
```bash
curl http://localhost:4001/api/auth/guard
```

---

### GET /api/auth/* and POST /api/auth/*
**Description:** Pass-through endpoints for BetterAuth handlers (login, signup, logout, verification, etc.)  
**Auth:** Depends on the sub-route

**Example**
```bash
curl http://localhost:4001/api/auth/sign-in/google
```