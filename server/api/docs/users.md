# API: Users

## Overview
Endpoints related to the authenticated user (unified **users** table + optional **profiles** row).

---

## Endpoints

### GET /api/users/me
**Description:** Get current logged-in user + profile + simple dashboard stats.  
**Auth:** Student / Organisation / Admin

**Response**
```json
{
  "id": "USER-UUID",
  "email": "user@smu.edu.sg",
  "name": "Adrian",
  "accountType": "student",
  "image": null,
  "profile": {
    "phone": null,
    "studentId": "S1234567A",
    "entryYear": 2024,
    "school": "LKCSB",
    "skills": ["public speaking", "excel"],
    "interests": ["elderly", "environment"],
    "csuCompletedAt": null
  },
  "dashboard": {
    "applications": 3,
    "verifiedHours": 16
  }
}
```

**Example**
```bash
curl http://localhost:4001/api/users/me -i --cookie "session=<cookie>"
```
