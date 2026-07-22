# Rajesh Icecream Inventory & Employee Management System

Offline desktop app foundation for factory inventory, shop inventory, employee salaries, loans, backups, reports, and analytics.

## Stack

- Electron desktop shell
- Next.js App Router UI
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite local database
- Electron Builder packaging setup

## First Run

```bash
cp .env.example .env
npm install
npx prisma generate
npm run db:prepare
npm run dev
```

The app opens in an Electron window and uses the local SQLite database at `prisma/dev.db`.

## Useful Commands

```bash
npm run dev             # Next.js + Electron development app
npm run dev:web         # Browser-only development app
npm run db:prepare      # Create/update and seed the local SQLite database
npm run prisma:push     # Create/update the local SQLite schema only
npm run backup          # Manual SQLite backup
npm run prisma:studio   # Browse and edit local database records
npm run build           # Build Next.js and Electron TypeScript
```

## Current Modules

- Dashboard summary cards
- Factory product inventory
- Raw material inventory
- Shop-wise stock view
- Factory to shop transfer history foundation
- Employee salary, bonus, loan, and balance calculations
- Report catalog for PDF, print, and Excel workflows
- Analytics summary page
- Backup and security settings page
- Global Command Palette (`Ctrl+K`) for fast cross-entity search
- Unified Operations Calendar for tracking sales, wastage, transfers, and loans
- Print-optimized receipt layouts for purchase and transfer invoices
- Robust Dark/Light mode theming system

## Planning

The active implementation roadmap and project knowledge base live in [brain/INDEX.md](brain/INDEX.md).

## Business Rules Included

- Employees with more than 6 completed working months receive an 8% bonus on total salary.
- Employee current balance is total salary plus bonus minus total loans.
- Factory stock value is quantity multiplied by unit price.
- Low stock products are flagged when factory quantity is at or below the product threshold.
- Manual backup keeps the latest 30 SQLite backup files.

## Next Build Steps

1. Add create/edit/delete forms for products, shops, transfers, employees, and loans.
2. Add transactional stock transfer actions that deduct factory stock and add shop stock together.
3. Add PDF and Excel exporters for every report.
4. Add optional admin login and local password hashing.
5. Finish packaged production launch for Windows Setup.exe.
