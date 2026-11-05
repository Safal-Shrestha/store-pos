## Database Design

The database is organized around shared business entities and domain-specific transaction and inventory tables.

### Shared Business Entities

| Table | Purpose |
|---|---|
| `Users` | Application users and access management |
| `Customers` | Customer information |
| `Suppliers` | Supplier information |
| `Categories` | Product categorization |
| `Products` | General product and gas product definitions |
| `Product_Units` | Units associated with products |
| `Unit_Conversions` | Conversion relationships between units |

### Sales and Purchases

| Table | Purpose |
|---|---|
| `Sales` | Shared sales transaction records |
| `Item_Sales` | General store sale line items |
| `Gas_Sales` | LPG gas sale records |
| `Gas_Allocations` | Cylinder allocation and queue fulfillment |
| `Sale_Payments` | Payments associated with sales |
| `Purchases` | Shared purchase transaction records |
| `Item_Purchase` | General store purchase line items |
| `Gas_Purchase` | LPG gas purchase records |
| `Purchase_Payments` | Payments associated with purchases |

### Inventory

| Table | Purpose |
|---|---|
| `Item_Inventory` | Retail product stock |
| `Gas_Inventory` | Gas cylinder inventory |
| `Inventory_Movements` | Retail stock movement history |
| `Stock_Adjustments` | Retail stock corrections |
| `Owner_Consumption` | Products consumed by the business owners |

### Cash and Audit

| Table | Purpose |
|---|---|
| `Cash_Accounts` | Cash account management |
| `Cash_Transactions` | Cash inflows and outflows |
| `Expenses` | Business expense records |
| `Audit_Log` | Record of important system actions |

### Planned Extensions

The following are considered future extensions rather than part of the current core schema:

- `Receivable` - tracking outstanding customer balances.
- `Payable` - tracking outstanding supplier balances.
- Additional reporting and analytics modules.
