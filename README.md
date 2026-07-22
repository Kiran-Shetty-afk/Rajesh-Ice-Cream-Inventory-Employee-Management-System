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

## Features & Core Logic

### 1. Dashboard & Analytics
- **Feature**: Real-time overview of the business.
- **Logic**: Aggregates total stock value, monthly sales revenue, total expenses, and active loans. Uses server actions to dynamically calculate data without hydrating massive data on the client.
- **Helpful Note**: The ECharts canvas library is dynamically lazy-loaded to ensure the dashboard remains incredibly fast and responsive.

### 2. Global Command Palette (`Ctrl+K`)
- **Feature**: Cross-entity search to instantly navigate the ERP.
- **Logic**: Pressing `Ctrl+K` opens a unified search dialog that queries products, shops, employees, and suppliers server-side, routing the user directly to the relevant entity.

### 3. Inventory Management (Products & Raw Materials)
- **Feature**: Track factory inventory levels and raw materials.
- **Logic**: Factory stock value is calculated strictly as `Quantity × Unit Price`. "Low Stock" alerts are dynamically generated whenever the factory quantity dips below the user-defined threshold.

### 4. Supply Chain & Shop Transfers
- **Feature**: Distribute stock from the central factory to individual ice cream shops.
- **Logic**: Uses transactional queries to ensure that when stock is transferred, it is atomically deducted from the factory and added to the specific shop. 
- **Helpful Note**: A print-ready invoice layout is automatically generated for every transfer, and physical receipts can be uploaded via the Document Storage API.

### 5. Unified Operations Calendar
- **Feature**: A master calendar to view daily business operations.
- **Logic**: Aggregates Sales, Transfers, Employee Loans, and Wastage into a single time-series calendar view. You can filter events by type for quick operational auditing.

### 6. Employee & Finance Management
- **Feature**: Track employee salaries, attendance, bonuses, and loans.
- **Logic**: 
  - **Bonus**: Employees with >6 months tenure automatically receive an 8% bonus on their total salary. 
  - **Balance**: An employee's current balance is strictly computed as `(Total Salary + Bonus) - Total Loans`.
  
### 7. Automated Notifications
- **Feature**: In-app bell alerts for critical events.
- **Logic**: Instead of a cron job, notifications (like Low Stock or Expiring Materials) are calculated on-the-fly during page load by comparing the current date against material expiry dates and thresholds. Standard DB notifications are used for system alerts.

### 8. System & Backup
- **Feature**: Local database management and Dark/Light theming.
- **Logic**: The application uses a local SQLite database (`dev.db`). The manual backup action creates a timestamped copy of the database and strictly enforces a retention policy of the latest 30 backups to prevent disk bloat.

## Next Build Steps

1. Add create/edit/delete forms for products, shops, transfers, employees, and loans.
2. Add transactional stock transfer actions that deduct factory stock and add shop stock together.
3. Add PDF and Excel exporters for every report.
4. Add optional admin login and local password hashing.
5. Finish packaged production launch for Windows Setup.exe.
