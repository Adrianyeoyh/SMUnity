# API: Projects

## Overview
Handles all endpoints related to listing, viewing, creating, updating, and deleting community service projects (CSPs).

---

## Endpoints

### GET /api/projects
**Description:** Fetch list of all approved projects with optional filters.  
**Auth:** Public

**Query Parameters**
| Name | Type | Required | Description |
|------|------|-----------|-------------|
| `q` | string | No | Search keyword |
| `categoryId` | number | No | Filter by category |
| `tagId` | number[] | No | Filter by tag IDs |
| `status` | string | No | Default = `approved` |

**Example**
```bash
curl "http://localhost:4001/api/projects?q=children"
```

---

### GET /api/projects/:id
**Description:** Get detailed information about a specific project.  
**Auth:** Public

**Response**
```json
{
  "id": 1,
  "title": "Project Kidleidoscope",
  "description": "Empowering children through creative learning.",
  "organisation": { "id": 2, "name": "Project Kidleidoscope" },
  "address": {
    "location": "SMU, Bras Basah",
    "city": "Singapore",
    "postalCode": "188065"
  },
  "capacity": { "slotsTotal": 40, "slotsFilled": 10 },
  "status": "approved"
}
```

---

### GET /api/projects/:id/sessions
**Description:** Returns all session times for a project.  
**Auth:** Public

**Response**
```json
[
  {
    "id": 1,
    "startsAt": "2025-10-21T14:00:00Z",
    "endsAt": "2025-10-21T16:00:00Z",
    "capacity": 20,
    "locationNote": null
  }
]
```

---

### GET /api/projects/sessions/upcoming
**Description:** Returns all upcoming sessions that the student is accepted into.  
**Auth:** Student

**Example**
```bash
curl http://localhost:4001/api/projects/sessions/upcoming   -H "Authorization: Bearer <token>"
```

---

### POST /api/projects
**Description:** Create a new project listing.  
**Auth:** Organisation / Admin

**Request Body**
```json
{
  "orgId": 2,
  "title": "Beach Cleanup Drive",
  "description": "Cleaning up East Coast Park",
  "slotsTotal": 20
}
```

**Response**
```json
{ "id": 5 }
```

---

### PATCH /api/projects/:id
**Description:** Update an existing project.  
**Auth:** Organisation (own org) / Admin

**Request Body**
```json
{ "title": "Beach Cleanup Drive (Updated)", "status": "approved" }
```

---

### DELETE /api/projects/:id
**Description:** Delete a project listing.  
**Auth:** Organisation (own org) / Admin

**Response**
```json
{ "ok": true }
```