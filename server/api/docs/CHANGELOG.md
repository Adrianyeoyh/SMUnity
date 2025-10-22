# CHANGELOG

- 2025-10-20T17:53:15.149555: Initial drop of role-guarded routes and docs
  - /api/taxonomies/categories, /api/taxonomies/tags
  - /api/timesheets (GET, POST), /api/timesheets/:id/verify (PATCH)
  - /api/projects/applications/manage (GET, POST /decide)
  - /api/organisations/members (GET/:orgId, POST, DELETE)
  - Exported `apiRouter` from `server/api/index.ts`
