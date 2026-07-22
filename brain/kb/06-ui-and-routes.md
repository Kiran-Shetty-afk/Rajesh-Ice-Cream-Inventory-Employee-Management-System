# UI and Routes

Last updated: 2026-07-12
Status: verified

## Confirmed facts

- Root layout uses a left sidebar and main content area.
- Routes found: `/`, `/inventory`, `/shops`, `/transfers`, `/employees`, `/reports`, `/analytics`, `/settings`.
- Operational CRUD logic is fully implemented via interactive Modals and React state inside Next.js Client Components (e.g., `ProductForm`, `ShopForm`, `EmployeeForm`, `TransferForm`).
- `components/PageHeader.tsx` and `components/StatCard.tsx` are shared UI primitives.
- Global table classes are defined in `app/globals.css`.

## Important files inspected

- `app/layout.tsx` — app shell.
- `components/Sidebar.tsx` — navigation.
- `app/*/page.tsx` — current route pages with forms integrated.
- `components/*Form.tsx` - All CRUD client component forms.
- `app/globals.css` — base styles and table utilities.

## Assumptions

- Forms are built with native HTML `<dialog>` tags and managed by React `useRef` for performance.
- We don't use React Hook Form or large third-party libraries for these simple CRUD forms.

## Unknowns / documentation gaps

- No mobile/responsive verification has been done (app is desktop-first Electron app).

## Maintenance notes

- Update this file when adding routes, major components, dialogs, forms, or layout changes.
