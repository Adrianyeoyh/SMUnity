# API: Organisation Requests

## Overview
External organisers request to join SMUnity; admins review and approve.

---

## Endpoints

### POST /api/organisations/requests
**Description:** Submit an organisation request (no account required).  
**Auth:** Public

**Request Body**
```json
{
  "requesterEmail": "contact@ngo.sg",
  "requesterName": "Jane Doe",
  "orgName": "Helping Hands",
  "orgDescription": "Community outreach",
  "website": "https://helpinghands.sg"
}
```

**Response**
```json
{ "id": 1 }
```

---

### GET /api/organisations/requests
**Description:** List all requests (admin).  
**Auth:** Admin

---

### POST /api/organisations/requests/:id/decide
**Description:** Approve or reject a request. When approved, an organiser invite token is generated (7-day expiry).  
**Auth:** Admin

**Request Body**
```json
{ "approve": true }
```

**Response**
```json
{ "ok": true }
```
