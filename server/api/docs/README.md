# SMUnity API Patch — Role‑guarded, Typed, Lean (generated 2025-10-20T17:53:15.149555)

This patch adds **four** focused API areas + docs:
- **Taxonomies** (public): categories/tags lists
- **Timesheets** (student log; org/admin verify)
- **Applications Management** (org/admin bulk/filtered decisions)
- **Organisation Members** (org/admin add/list/remove)

Each route enforces **role guards**, uses **Zod** validation, and returns **lean payloads** only.

See the individual docs in this folder for full details.
