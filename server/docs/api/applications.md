# API: Applications

## Overview
Handles application submission and retrieval for students applying to projects.

---

## Endpoints

### GET /api/projects/applications
**Description:** Returns all applications made by the logged-in student.  
**Auth:** Student

**Response**
```json
[
  {
    "id": 1,
    "status": "pending",
    "project": { "id": 5, "title": "Beach Cleanup Drive" },
    "submittedAt": "2025-10-19T15:00:00Z"
  }
]
```

---

### POST /api/projects/applications
**Description:** Submit a new project application.  
**Auth:** Student

**Request Body**
```json
{ "projectId": 5, "motivation": "I love volunteering outdoors." }
```

**Response**
```json
{ "ok": true, "id": 12 }
```

**Example**
```bash
curl -X POST http://localhost:4001/api/projects/applications   -H "Content-Type: application/json"   -H "Authorization: Bearer <token>"   -d '{"projectId":5,"motivation":"I love volunteering outdoors."}'
```