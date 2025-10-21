# Auth & Role Guards

Every **mutating** route checks:
- Logged-in via `requireSession`.
- Role via `assertRole(user, [...])` (or explicit checks).
- Ownership when applicable (orgs can act only on their projects).

**Roles**
- `student`: browse, apply, favourites, own timesheets.
- `organisation`: create/manage listings, review/decide applications for own projects, verify timesheets for own projects, manage org members.
- `admin`: system-wide control, create organisations, invites, review org requests.

**Response helpers & errors**
- OK: `ok<T>(c, payload)` → `200`
- Created: `created<T>(c, payload)` → `201`
- Errors: `badReq(c, msg)` → `400`, `ApiError(401|403)` or `forbidden/notFound`, and a global `onError` returning `{"error":"..."}`.
