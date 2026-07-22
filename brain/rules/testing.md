# Testing policy

## Current state

- No dedicated test framework config was found during initialization.
- `package.json` has `npm run lint`, but with latest Next.js this may need verification because `next lint` has changed across Next versions.

## When to test

- Add or update tests when behavior is non-trivial or the user asks.
- For business rules, prefer focused unit tests around helpers such as salary, bonus, loans, and transfer validation.
- For stock transfers, test transaction behavior once mutation code exists.

## Commands

- Run `npm run build` for production readiness when feasible.
- Run `npm run lint` only after confirming the command works in this Next.js version.
- Report any command that cannot run or fails.
