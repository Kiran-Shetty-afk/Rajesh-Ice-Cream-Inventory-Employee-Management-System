# API and Integrations

Last updated: 2026-07-12
Status: verified

## Confirmed facts

- The app is an offline-first Electron application built with Next.js.
- Server Actions (`app/actions/*.ts`) handle all mutations: products, shops, employees, transfers, and database backups.
- We use Zod (`lib/schemas.ts`) for strict payload validation.
- CSV Exports are handled by a dynamic API route: `/api/export?type=reportType`, streaming `.csv` generated strings.
- PDF exports use native browser `window.print()` functionality invoked via standard client events.
- Excel exports do not use `xlsx` due to bloat/security preferences; native CSV is used instead.

## Important files inspected

- `app/actions/*.ts` - Prisma mutations.
- `lib/schemas.ts` - Zod validations.
- `app/api/export/route.ts` - CSV generation endpoint.
- `electron/main.ts` — external URL handling and Next.js initialization.

## Assumptions

- No external cloud services or 3rd party APIs are required or expected.

## Unknowns / documentation gaps

- Print layouts currently rely on default browser/Tailwind styles. A dedicated `print.css` could be added in the future if advanced layout control is needed.

## Maintenance notes

- Update this file when adding server actions, route handlers, IPC, export functions, or external integrations.

## Error Handling
Server actions are strictly typed and catch exceptions internally. They return generic errors ({ error: 'An unexpected error occurred. Please try again later.' }) to avoid leaking database schemas or system internals to the client.

