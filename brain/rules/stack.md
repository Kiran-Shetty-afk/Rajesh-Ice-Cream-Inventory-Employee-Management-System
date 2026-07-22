# Stack conventions

## Confirmed stack

- Electron desktop shell.
- Next.js App Router UI.
- TypeScript.
- Tailwind CSS.
- Prisma ORM.
- SQLite local database.

## Next.js

- Follow App Router patterns under `app/`.
- Prefer server components for read-only database pages unless interactivity requires client components.
- Add server actions or route handlers deliberately for mutations.

## Styling

- Use Tailwind utility classes and existing component patterns.
- Reuse `components/PageHeader.tsx`, `components/StatCard.tsx`, and the table utility classes in `app/globals.css`.

## Data layer

- Prisma schema lives at `prisma/schema.prisma`.
- Database access is centralized through `lib/prisma.ts`.
- Schema changes should be paired with Prisma migrations and KB updates.

## Dependencies

- Prefer libraries already in `package.json`.
- Add new packages only when they solve a real implementation need.
