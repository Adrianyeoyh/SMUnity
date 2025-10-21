# API: Applications

## Overview
Students apply to projects; view and withdraw applications.

---

## Endpoints

### GET /api/projects/applications
**Description:** List my applications (optional `status` filter).  
**Auth:** Student

**Query Parameters**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `status` | enum | No | pending / accepted / rejected / waitlisted / withdrawn / cancelled |

**Example**
```bash
curl "http://localhost:4001/api/projects/applications?status=pending" -i --cookie "session=<cookie>"
```

---

### POST /api/projects/applications
**Description:** Submit a new application.  
**Auth:** Student

**Request Body**
```json
{ "projectId": 101, "sessionId": 1001, "motivation": "I love volunteering!" }
```

**Response**
```json
{ "id": 7001 }
```

---

### POST /api/projects/applications/:id/withdraw
**Description:** Change my application status to `withdrawn`.  
**Auth:** Student
