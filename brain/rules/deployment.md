# Deployment

## Current target

- Offline Windows desktop installer via Electron Builder.
- Package output is configured as `release/`.
- Product name is `Thakur Ice Cream Manager`.

## Known packaging needs

- Production Electron currently needs a packaged Next.js loading strategy instead of always loading `http://localhost:3000`.
- Production SQLite path should use the app user data directory, not an installed app directory.
- First launch should initialize or migrate the local database.
- Backup and restore paths should be verified after packaging.

## Secrets

- Do not commit `.env`, database files, or backup database copies.
