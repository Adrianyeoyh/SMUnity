# Timesheets API

### Auth
- Students: create & list own timesheets
- Organisations/Admins: verify timesheets for projects they own (or any, if admin)

## GET /api/timesheets
List current user's timesheets. Admins may pass `?userId=UUID` to view another user.

**Response 200**
```json
[{
  "id": 12,
  "projectId": 5,
  "sessionId": 9,
  "date": "2025-10-20T00:00:00.000Z",
  "hours": 3,
  "description": "Cleanup",
  "verified": true,
  "verifiedBy": "org-user-uuid"
}]
```

## POST /api/timesheets
Create a timesheet for the logged-in **student**.

**Body**
```json
{ "projectId": 5, "sessionId": 9, "date": "2025-10-20", "hours": 3, "description": "Cleanup" }
```

**Response 201**
```json
{ "id": 13 }
```

## PATCH /api/timesheets/:id/verify
Verify/unverify a timesheet. Only the owning organisation (project owner) or admin.

**Body**
```json
{ "verified": true }
```

**Response 200**
```json
{ "ok": true }
```
