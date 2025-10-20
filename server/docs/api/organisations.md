# API: Organisations

## Overview
Handles organisation profiles and project listings for CSP leaders and admins.

---

## Endpoints

### GET /api/organisations/:id
**Description:** Fetch public details of an organisation.  
**Auth:** Public

**Response**
```json
{
  "id": 1,
  "name": "SMU Rotaract",
  "description": "A student-led community service organisation.",
  "website": "https://smurotaract.sg",
  "email": "smu-rotaract@csp.sg"
}
```

---

### POST /api/organisations
**Description:** Create a new organisation (admin-only).  
**Auth:** Admin

**Request Body**
```json
{
  "userId": "uuid",
  "name": "Project Kidleidoscope",
  "slug": "project-kidleidoscope",
  "email": "project-kidleidoscope@csp.sg"
}
```

**Response**
```json
{ "ok": true, "id": 3 }
```

---

### GET /api/organisations/:id/projects
**Description:** Retrieve all projects under an organisation (org dashboard).  
**Auth:** Organisation / Admin

**Response**
```json
[
  { "id": 2, "title": "Elderly Home Visitation", "status": "approved", "createdAt": "2025-10-19T15:00:00Z" }
]
```