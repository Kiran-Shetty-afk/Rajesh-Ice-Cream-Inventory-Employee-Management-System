# ERP Supply Chain

Last updated: 2026-07-22
Status: implemented

## Scope
This module handles the core supply chain workflow of the business:
- **Supplier Management**: Track supplier details and payment due.
- **Purchases**: Logging purchases against suppliers which auto-increments factory stock and updates supplier's payment due balance.
- **Wastage / Damage**: Tracking stock lost due to damage or expiry from either the factory or a specific shop. Automatically decrements the relevant stock balance.

## Models
- `Supplier`: Defines a supplier with `paymentDue`.
- `Purchase`: A logged purchase with an `invoiceNumber` and `totalAmount`.
- `PurchaseItem`: Individual products in a purchase.
- `Wastage`: A logged event where stock was lost.

## Export Foundation
- Implemented `lib/export.ts` which provides CSV export and PDF/Printable HTML generation for tabular data across the application.

## Interactions
- **Purchases** -> Increases `Product.factoryQuantity` and `Supplier.paymentDue`.
- **Wastage** -> Decreases `Product.factoryQuantity` (if factory) or `ShopInventory.quantity` (if shop).
