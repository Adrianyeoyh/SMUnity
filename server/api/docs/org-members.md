# Organisation Members API (Org/Admin)

## GET /api/organisations/members/:orgId
List members (email, roleLabel, acceptedAt). Org may only access its own org; admin can access any.

**Response 200**
```json
[ { "userId": "uuid", "email": "volunteer@smu.edu.sg", "roleLabel": "coordinator", "acceptedAt": "2025-10-01T09:00:00.000Z" } ]
```

## POST /api/organisations/members
Add a member to your organisation.

**Body**
```json
{ "orgId": "org-uuid", "userId": "user-uuid", "roleLabel": "coordinator" }
```

**Response 201**
```json
{ "ok": true }
```

## DELETE /api/organisations/members
Remove a member from your organisation.

**Body**
```json
{ "orgId": "org-uuid", "userId": "user-uuid" }
```

**Response 200**
```json
{ "ok": true }
```
