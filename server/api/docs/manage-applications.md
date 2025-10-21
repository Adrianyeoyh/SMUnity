# Applications Management API (Org/Admin)

## GET /api/projects/applications/manage?projectId=123&status=pending
List applications for a project you own. Admins can view any project.

**Response 200**
```json
[{
  "id": 51,
  "status": "pending",
  "motivation": "I love helping seniors.",
  "submittedAt": "2025-10-19T12:11:21.000Z",
  "applicant": { "id": "uuid", "email": "student@smu.edu.sg" }
}]
```

## POST /api/projects/applications/manage/decide
Bulk update status for given application IDs.

**Body**
```json
{ "ids": [51, 52], "status": "accepted" }
```

**Response 200**
```json
{ "updated": 2 }
```
