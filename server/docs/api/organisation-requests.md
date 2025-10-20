# API: Organisation Requests

## Overview
Allows external users or logged-in students to request creation of a new CSP organisation, and lets admins manage those requests.

---

## Endpoints

### POST /api/organisations/requests
**Description:** Submit a new organisation creation request.  
**Auth:** Public / Logged-in users

**Request Body**
```json
{
  "requesterEmail": "contact@ngo.sg",
  "requesterName": "John Doe",
  "orgName": "Helping Hands",
  "orgDescription": "A non-profit supporting community outreach.",
  "website": "https://helpinghands.sg"
}
```

**Response**
```json
{ "ok": true, "id": 1 }
```

---

### GET /api/organisations/requests
**Description:** Fetch all organisation requests (admin view).  
**Auth:** Admin

**Response**
```json
[
  {
    "id": 1,
    "requesterEmail": "contact@ngo.sg",
    "orgName": "Helping Hands",
    "status": "pending",
    "createdAt": "2025-10-19T12:00:00Z"
  }
]
```

---

### POST /api/organisations/requests/:id/decide
**Description:** Approve or reject an organisation request.  
**Auth:** Admin

**Request Body**
```json
{ "approve": true, "note": "Approved for SMU collaboration." }
```

**Response**
```json
{ "ok": true }
```