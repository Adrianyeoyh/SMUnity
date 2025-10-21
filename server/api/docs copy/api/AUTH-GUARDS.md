# Auth & Role Guards (Pattern)

Every mutating route checks:
- **Logged-in** via `requireSession`.
- **Role** via `assertRole(user, [...])`.
- **Ownership** when applicable (e.g., org can act only on its projects).

Roles:
- **student**: may browse, apply to projects, create own timesheets.
- **organisation**: may create/manage their listings, review applications for their projects, verify timesheets for their projects, manage org members.
- **admin**: superuser across all organisations and projects.

HTTP helper responses standardize errors:
- `badReq` → 400
- `forbidden` → 403
- `notFound` → 404
