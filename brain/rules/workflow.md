# Development workflow

## Git branch policy

This repo currently has no commits yet and is on `master`.

| Branch | Purpose | Direct commit/push |
| --- | --- | --- |
| `master` | Current initial branch | ask first |
| `main` | Potential production branch | no |
| `dev` | Potential staging branch | no |

## Planning

- For multi-file changes, outline the implementation path briefly before large edits.
- Keep changes scoped to the requested feature or fix.

## Local dev

- Use `npm run dev:web` for browser-only Next.js development.
- Use `npm run dev` for Next.js plus Electron development.
- Check for an existing dev server before starting another.

## KB update requirement

For every meaningful change:

1. Identify impacted KB areas.
2. Update existing KB files when the concept already exists.
3. Create or update a feature file when the feature is new.
4. Add a short entry to `brain/CHANGELOG.md`.
5. Mention code files changed, KB files changed, and checks run in the final response.
