# SMUnity API — Purposeful, Guarded, Lean

This API follows three rules:

1) **Role checks**  
   - Students: browse public listings, apply to projects, manage favourites, create their own timesheets.  
   - Organisations: create/manage their listings, review applications **for their projects**, manage organisation members, verify timesheets **for their projects**.  
   - Admins: create organisations and have full visibility/controls.

2) **Typed, lean responses**  
   Each endpoint returns the **minimal shape** the UI needs — not entire rows. All shapes are explicitly defined in code.

3) **Clear errors**  
   JSON error shape: `{"error": "<message>"}` with correct HTTP status.

### Auth
- Cookie session (BetterAuth).  
- **Public** endpoints are explicitly marked and do not require auth.

### Error model
- **400** Bad input (missing/invalid fields)  
- **401** Not authenticated  
- **403** Authenticated but not allowed  
- **404** Not found / not owned  
- **500** Unexpected (see server logs)

### Quick map
- **Public:** `GET /projects`, `GET /projects/:id`, `GET /projects/:id/sessions`, `GET /taxonomies/*`, `GET /organisations`, `GET /organisations/:id`, `POST /organisations/requests`
- **Student:** applications, favourites, timesheets (own), dashboard
- **Organisation:** create/update/delete projects, manage applications, org members, verify timesheets
- **Admin:** `/admin/dashboard`, create organisations, list/decide org requests, invites (`/auth/invite`)
