# Auth and Permissions

Last updated: 2026-07-12
Status: draft

## Confirmed facts

- The README describes the system as single-user owner/admin.
- Settings page describes optional admin login as a next build step.
- No auth middleware, login route, password model, or session logic was found during initialization.

## Important files inspected

- `README.md` — security goals and optional admin login.
- `app/settings/page.tsx` — security card text.
- `prisma/schema.prisma` — no user/password model currently exists.

## Assumptions

- Initial app may run without login on the owner's laptop.
- If login is added, password hashes should be stored locally.

## Unknowns / documentation gaps

- Whether login is required for v1.
- Password reset/recovery expectations.
- Session timeout expectations.

## Maintenance notes

- Update this file when adding login, password hashing, session handling, or app lock behavior.
