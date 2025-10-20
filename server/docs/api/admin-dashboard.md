# API: Admin Dashboard

## Overview
Provides admin-level insights such as total users, organisations, projects, and pending organisation requests.

---

## Endpoints

### GET /api/admin/dashboard
**Description:** Returns a summary of platform statistics for the admin dashboard.  
**Auth:** Admin

**Response**
```json
{
  "totals": {
    "students": 120,
    "organisations": 10,
    "projects": 35
  },
  "pendingOrgRequests": 2
}
```

**Example**
```bash
curl http://localhost:4001/api/admin/dashboard   -H "Authorization: Bearer <admin_token>"
```