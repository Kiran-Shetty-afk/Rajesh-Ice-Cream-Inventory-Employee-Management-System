# Issues Index

## ID Ledger

| Field | Value |
|------|-------|
| Last Assigned ID | 006 |
| Next ID | 007 |

## Ledger Rules

- Issue IDs are global and immutable.
- IDs are never reused.
- Completed issues reserve their IDs forever.
- New issue IDs must be calculated from `INDEX.md`, active files, and completed files.
- Do not calculate next ID from `brain/issues/` alone.

## Overview

| Category | Count |
|----------|-------|
| Active issues | 0 |
| Completed | 6 |
| **Total** | **6** |

## Completed Issues

| ID | Title | Completed |
|----|-------|-----------|
| 001 | Raw error details returned to client in server actions | 2026-07-22 |
| 002 | Missing test coverage for all core areas | 2026-07-22 |
| 003 | Missing return type annotations on exported functions | 2026-07-22 |
| 004 | ECharts library is statically imported, inflating initial client bundle size | 2026-07-22 |
| 005 | Missing return type annotations on notification server actions | 2026-07-22 |
| 006 | Redundant try/catch error handling boilerplate in Server Actions | 2026-07-22 |

## Active Issues by Priority

### P0 — Critical

| ID | Title |
|----|-------|
| _none_ | |

### P1 — High

| ID | Title |
|----|-------|
| _none_ | |

### P2 — Medium

| ID | Title |
|----|-------|
| _none_ | |

## Issue Structure

Each issue file contains:

```yaml
---
id: XXX
title: ...
severity: P0|P1|P2
area: frontend|backend|api|database|auth|security|ui|testing|performance|dx|infra|docs|workflow|unknown
source: how-the-issue-was-found
status: open|completed
created: YYYY-MM-DD
files:
  - relevant-files
related:
  - related-issue-ids
---

## Summary

## Evidence

## Suggested fix

## Acceptance criteria
```

## Areas

| Area | Description |
|------|-------------|
| frontend | Web/mobile UI, components, pages, client routing |
| backend | Server logic, services, domain layer |
| api | HTTP/API routes, handlers, webhooks |
| database | Schema, migrations, ORM, persistence |
| auth | Sessions, permissions, identity |
| security | Hardening, crypto, input validation |
| ui | Visual design, layout, accessibility, UX polish |
| testing | Test gaps, flaky tests, missing coverage |
| performance | Latency, bundle size, caching |
| dx | Tooling, refactors, dead code, developer ergonomics |
| infra | Packaging, deploy, config, observability |
| docs | README, KB, API docs, onboarding |
| workflow | Scripts, automation, issue/process tooling |
| unknown | Area unclear until triaged |

## Workstreams

| Workstream | Issues |
|-----------|--------|
| _none yet_ | |
