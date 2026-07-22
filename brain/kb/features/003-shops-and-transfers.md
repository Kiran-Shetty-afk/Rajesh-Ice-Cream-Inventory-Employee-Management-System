# Shops and Transfers

Last updated: 2026-07-12
Status: draft

## Confirmed facts

- Routes: `/shops` and `/transfers`.
- Shops page displays shop-wise inventory.
- Transfers page displays transfer number, date, shop, item names, and total quantity.
- Data models include `Shop`, `ShopInventory`, `StockTransfer`, and `StockTransferItem`.

## Important files inspected

- `app/shops/page.tsx` — shop stock cards.
- `app/transfers/page.tsx` — transfer history table.
- `prisma/schema.prisma` — shop and transfer models.

## Assumptions

- Transfer creation should run in one database transaction.

## Unknowns / documentation gaps

- No transfer creation form exists.
- No stock availability validation exists.
- No transfer detail view or filters exist.

## Maintenance notes

- Update when shop CRUD, transfer mutation logic, or stock movement reporting changes.
