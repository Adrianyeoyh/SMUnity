# API: Favourites

## Overview
Handles saving and removing favourite projects for logged-in users.

---

## Endpoints

### GET /api/projects/favourites
**Description:** Retrieve all saved projects of the logged-in user.  
**Auth:** Logged-in users (Student / Organisation)

**Response**
```json
[
  {
    "id": 1,
    "title": "Project Kidleidoscope",
    "location": "SMU, Bras Basah",
    "savedAt": "2025-10-19T15:00:00Z"
  }
]
```

---

### POST /api/projects/favourites
**Description:** Toggle a project’s favourite status (add/remove).  
**Auth:** Logged-in users (Student / Organisation)

**Request Body**
```json
{ "projectId": 1 }
```

**Response (Added)**
```json
{ "added": true }
```

**Response (Removed)**
```json
{ "removed": true }
```