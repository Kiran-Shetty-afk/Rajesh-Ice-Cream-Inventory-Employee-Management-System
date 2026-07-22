---
id: 005
title: Missing return type annotations on notification server actions
severity: P2
area: backend
source: kenmark-issues-scan
status: open
created: 2026-07-22
files:
  - app/actions/notifications.ts
related:
  - 003
---

## Summary

The `getNotifications` and `markNotificationAsRead` server actions are missing explicit TypeScript return type annotations. This can lead to unpredictable behavior when inferred types are passed to Client Components, especially if the schema changes. (This is a regression / miss from Issue 003).

## Evidence

- `app/actions/notifications.ts:6` — `export async function getNotifications() {`
- `app/actions/notifications.ts:76` — `export async function markNotificationAsRead(id: string) {`

## Suggested fix

Add explicit return types to the functions. `markNotificationAsRead` should return `Promise<void>`, and `getNotifications` should return a properly inferred array of notifications or a custom `NotificationEvent[]` type to handle the dynamic alerts.

## Acceptance criteria

- [ ] `getNotifications` is explicitly typed with a `Promise<Array<...>>` return type.
- [ ] `markNotificationAsRead` is explicitly typed with `Promise<void>`.
