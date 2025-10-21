# API: Admin Dashboard

## Overview
Aggregate metrics for admins.

---

## Endpoints

### GET /api/admin/dashboard
**Description:** Returns totals for users, organisations, projects, and pending organisation requests.  
**Auth:** Admin

**Response**
```json
{
  "totals": {
    "users": 132,
    "students": 120,
    "organisations": 10,
    "projects": 35
  },
  "pendingOrgRequests": 2
}
```

**Example**
```bash
curl http://localhost:4001/api/admin/dashboard -i --cookie "session=<admin_session_cookie>"
```
