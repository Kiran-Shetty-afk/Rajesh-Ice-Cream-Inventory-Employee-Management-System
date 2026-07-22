---
id: 007
title: Nested ternary used for notification colors
severity: P2
area: ui
source: kenmark-issues-scan
status: open
created: 2026-07-22
files:
  - components/NotificationBell.tsx
related:
---

## Summary

The `NotificationBell` component uses a nested ternary to determine the color class of the notification text based on `notif.type`. This hurts readability and should be refactored into a clear `if/else` statement or a lookup map.

## Evidence

- [NotificationBell.tsx](file:///d:/Projects/thakur-ice-cream-manager/components/NotificationBell.tsx#L74) — `notif.type === 'LOW_STOCK' ? 'text-amber-400' : notif.type === 'EXPIRY' ? 'text-strawberry' : 'text-vanilla'`

## Suggested fix

Refactor the nested ternary into a helper function or an object map (e.g., `const colorMap = { LOW_STOCK: 'text-amber-400', EXPIRY: 'text-strawberry', SYSTEM: 'text-vanilla' }`) to improve code clarity.

## Acceptance criteria

- [ ] Replace the nested ternary in `NotificationBell.tsx` with a clearer pattern.
- [ ] Ensure the correct colors are still applied.
