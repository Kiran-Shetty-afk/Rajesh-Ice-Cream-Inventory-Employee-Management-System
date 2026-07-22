# Project standards

Universal rules for this repo. Stack, workflow, testing, UI, and deploy details live in sibling files under `brain/rules/`.

## Scope and quality

- Prefer the smallest correct change; do not refactor unrelated code.
- In code you touch: complete behavior, real data shapes, and sensible error handling.
- Read surrounding code before editing; match naming, types, and patterns already in the repo.

## Project layout

- Never delete the `brain/` folder.
- Use `temp/` for scratch scripts and downloads; it is gitignored.
- Update `brain/` and `brain/CHANGELOG.md` after meaningful changes.

## Brain KB maintenance

- Before non-trivial tasks, read relevant files under `brain/kb/`.
- If a change adds or alters a product feature, update or create a file under `brain/kb/features/` and link it from `brain/kb/07-features.md`.
- If the change affects architecture, data model, auth, API, UI routes, packaging, or testing, update the matching numbered KB file.
- Code and KB move together; undocumented feature changes are incomplete work.

## Packages and docs

- Use the package manager already present in the repo.
- For unfamiliar APIs, read project source first; use external docs only when needed.

## Safety on changed code

- Watch for null/undefined access, missing error handling, unsafe user-facing output, and leaked secrets.
- Do not run broad audits unless requested.
