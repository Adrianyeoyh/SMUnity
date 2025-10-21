# API: Favourites

## Overview
Save/unsave favourite projects for quick access.

---

## Endpoints

### GET /api/projects/favourites
**Description:** List my saved (favourited) projects.  
**Auth:** Logged-in user

**Example**
```bash
curl http://localhost:4001/api/projects/favourites -i --cookie "session=<cookie>"
```

---

### POST /api/projects/favourites
**Description:** Toggle save/unsave a project.  
**Auth:** Logged-in user

**Request Body**
```json
{ "projectId": 101 }
```

**Response**
```json
{ "added": true }
```
or
```json
{ "removed": true }
```

---

### DELETE /api/projects/favourites?projectId=ID
**Description:** Remove a project from favourites (idempotent).  
**Auth:** Logged-in user
