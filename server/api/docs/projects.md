# API: Projects

## Overview
Public CSP listings and details; organisers/admin can create/update/delete.

---

## Endpoints

### GET /api/projects
**Description:** List projects with optional filters.  
**Auth:** Public

**Query Parameters**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `q` | string | No | Search by title |
| `categoryId` | number | No | Filter by category id |
| `tagId` | number[] | No | Filter by tag ids (repeat param) |
| `status` | enum | No | Default `approved` |

**Response**
```json
[
  {
    "id": 101,
    "title": "Beach Cleanup Drive",
    "summary": "Help keep ECP clean.",
    "organisation": { "id": "ORG-USER-ID", "slug": "smu-rotaract" },
    "location": "East Coast Park",
    "latitude": 1.30,
    "longitude": 103.91,
    "slotsTotal": 20,
    "slotsFilled": 5,
    "status": "approved",
    "createdAt": "2025-10-20T02:45:00.000Z"
  }
]
```

**Example**
```bash
curl "http://localhost:4001/api/projects?q=cleanup&tagId=1&tagId=3"
```

---

### GET /api/projects/:id
**Description:** Get full details of a project.  
**Auth:** Public

**Example**
```bash
curl http://localhost:4001/api/projects/101
```

---

### GET /api/projects/:id/sessions
**Description:** Get session times for a project.  
**Auth:** Public

**Response**
```json
[
  {
    "id": 1001,
    "startsAt": "2025-11-02T06:00:00.000Z",
    "endsAt": "2025-11-02T08:00:00.000Z",
    "capacity": 20,
    "locationNote": "Meet at Carpark F2"
  }
]
```

---

### GET /api/projects/sessions/upcoming
**Description:** Upcoming sessions the student is **accepted** into.  
**Auth:** Student

**Example**
```bash
curl http://localhost:4001/api/projects/sessions/upcoming -i --cookie "session=<cookie>"
```

---

### POST /api/projects
**Description:** Create a project (organisation / admin).  
**Auth:** Organisation / Admin

**Request Body**
```json
{
  "orgId": "ORG-USER-ID",
  "title": "Beach Cleanup Drive",
  "description": "Help our shores stay clean",
  "categoryId": 1,
  "location": "East Coast Park",
  "slotsTotal": 20
}
```

**Response**
```json
{ "id": 999 }
```

---

### PATCH /api/projects/:id
**Description:** Update a project. Non-admins cannot change status.  
**Auth:** Organisation (owner) / Admin

**Request Body (partial)**
```json
{ "title": "Updated Title", "slotsTotal": 30 }
```

---

### DELETE /api/projects/:id
**Description:** Delete a project.  
**Auth:** Organisation (owner) / Admin
