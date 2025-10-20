# API: Users

## Overview
Handles retrieval of the current logged-in user's information, including their profile details and basic student dashboard stats.

---

## Endpoints

### GET /api/users/me
**Description:** Returns information about the currently logged-in user.  
**Auth:** Student / Organisation / Admin

**Response**
```json
{
  "id": "uuid",
  "email": "adrian.yeo.2024@smu.edu.sg",
  "accountType": "student",
  "profile": {
    "displayName": "Adrian Yeo",
    "phone": null,
    "school": "LKCSB",
    "entryYear": 2024,
    "studentId": null
  },
  "dashboard": {
    "totalHours": 30,
    "activeApplications": 2,
    "completedProjects": 1
  }
}
```

**Example**
```bash
curl http://localhost:4001/api/users/me   -H "Authorization: Bearer <token>"
```