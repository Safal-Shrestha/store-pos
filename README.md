# Store POS

**An integrated Point of Sale and Business Management System for a General Store and LPG Gas Business.**

Store POS is a personal software engineering project designed to digitize the daily operations of a family-owned general store and LPG gas business.

The system combines retail sales, inventory management, purchases, cash management, and LPG cylinder operations into a unified application. While both business domains share a common interface and transaction infrastructure, their inventory models and operational workflows are handled separately.

The project is being developed using the **PERN stack** (PostgreSQL, Express.js, React, and Node.js), with an emphasis on practical system design, data integrity, maintainability, and real-world business requirements.

## Project Objectives

- Build a practical POS system for everyday retail operations.
- Integrate general store and LPG gas business management into one application.
- Simplify daily operations for non-technical users.
- Maintain accurate stock, sales, purchase, and cash records.
- Handle complex retail unit conversions and pricing.
- Model LPG cylinder queues, exchanges, deposits, and inventory.
- Apply software engineering principles to a real business environment.

## Business Scope

### General Store

The retail component is designed for a small family-operated shop selling loose items, packaged products, and services.

Key considerations include:

- Products sold individually, in packets, packs, cartons, or by weight.
- Products with multiple levels of packaging and unit conversion.
- Different prices depending on the selling unit.
- Inventory maintained across mixed units.
- Services such as landline telephone calls.
- Owner consumption, non-business expenses, and cash withdrawals.

### LPG Gas Business

The gas component manages cylinder sales, purchases, inventory, and customer exchanges.

Key operational considerations:

- Different gas brands and cylinder types.
- Full and partially filled cylinders, including government-directed distribution arrangements.
- Queue-based allocation when filled cylinders are unavailable.
- Customers registering their names and returning later for cylinder collection.
- Exchange of empty cylinders for filled cylinders, potentially with additional charges.
- Sale of filled cylinders without an empty-cylinder exchange, requiring a refundable cash deposit.
- Tracking deposits and refunds when empty cylinders are returned.

## Core Features

### 1. Point of Sale

- Unified POS interface for retail and gas transactions.
- Frontend-managed cart for the non-e-commerce environment.
- A single sale can contain both general store items and LPG gas products.
- Support for mixed quantities and selling units.
- Flexible payment recording.
- Sales history and transaction details.

### 2. Product and Unit Management

Products may have multiple selling units and packaging levels.

**Example: Soap**

```text
Soap
├── 1 Bar
├── 1 Pack = 4 Bars
└── 1 Carton = 12 Packs
```

The system is designed to support:

- Loose and packaged sales.
- Unit conversion between purchase, inventory, and selling units.
- Different pricing for different selling units.
- Stock tracking across mixed units.
- Weight-based products.
- Inventory adjustments when packages are opened.

For example, inventory may contain 20 unopened soap packs and 3 individual bars. Opening a pack should transfer stock from packaged units into individual units rather than losing track of the remaining quantity.

Selling a pack or carton may also have a different per-unit price than selling individual bars.

### 3. LPG Gas Operations

- Gas-specific sales and purchase records.
- Gas inventory tracking.
- Cylinder allocation and queue management.
- Empty-for-filled cylinder exchanges.
- Additional exchange charges.
- Refundable deposits for non-exchange sales.
- Tracking of customer cylinder returns.
- Support for different gas brands and fill levels.

### 4. Inventory Management

The system maintains separate inventory models for retail products and gas cylinders.

**Retail inventory**
- Product stock tracking.
- Unit conversion.
- Inventory movement history.
- Stock adjustments.
- Owner consumption.

**Gas inventory**
- Cylinder stock tracking.
- Gas purchase and sales movements.
- Cylinder allocation records.
- Full, empty, and applicable partially filled cylinder tracking.
- Owner consumption.

### 5. Purchases and Suppliers

- Supplier management.
- Retail product purchases.
- Gas purchases.
- Purchase payment records.
- Inventory updates from purchases.
- Purchase history and transaction tracking.

### 6. Cash and Business Management

- Cash accounts.
- Cash transactions.
- Sales and purchase payments.
- Business expenses.
- Owner withdrawals.
- Owner deposits.
- Owner consumption of shop products.
- Audit logging of important operations.

The system distinguishes business expenses from owner withdrawals and personal consumption to support more accurate cash reconciliation.

## Key Business Rules

### Retail Sales

- A product may be sold in multiple units.
- Different units may have different selling prices.
- Selling a larger package may be cheaper than purchasing the same quantity as individual units.
- Stock must be converted consistently between packaging levels.
- One sale may contain both retail products and gas transactions.

### LPG Cylinder Transactions

**Cylinder exchange:** A customer returns an empty cylinder and receives a filled cylinder, potentially paying an additional exchange charge.

**Cylinder deposit:** A customer receives a filled cylinder without returning an empty one and pays a refundable deposit. The deposit can be refunded when the empty cylinder is returned.

**Queue allocation:** When gas is unavailable, customer details are recorded in a queue. The customer does not immediately receive a filled cylinder. Allocation is recorded when stock becomes available and the cylinder is issued.

**Variable fill levels:** The system must account for gas distributed at different fill levels and prices when required by business or government directives.

## Development Principles

- **Separation of concerns:** Routes, controllers, services, and repositories have distinct responsibilities.
- **Modularity:** Retail and gas business logic remain independently organized.
- **Data integrity:** Use database transactions for operations that modify multiple related records.
- **Inventory accuracy:** Record stock movements rather than relying only on manually updated quantities.
- **Business-first design:** Model actual workflows before adding unnecessary abstractions.
- **Maintainability:** Prefer understandable implementations over premature complexity.
- **Incremental development:** Implement and test features in manageable stages.

## Project Structure

```text
store-pos/
├── frontend/
│   └── React application
│
├── backend/
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── middleware/
│       ├── db/
│       └── app.js
│
├── database/
│   ├── schema/
│   └── migrations/
│
├── docs/
│   └── architecture/
│
├── .gitignore
└── README.md
```

## Project Status

**Under active development.**

Current focus areas include:

- Database design and business rule modeling.
- Retail and gas inventory management.
- Unified sales and purchase workflows.
- Cash management and transaction integrity.
- Frontend usability for everyday business operations.

Features are being implemented incrementally. This README describes the intended system design and scope, not a claim that every feature is already operational.

## Future Improvements

- Role-based access control.
- Business dashboards and analytics.
- Low-stock alerts.
- Daily cash reconciliation.
- Customer receivables and supplier payables.
- Receipt printing.
- Backup and recovery.
- Audit and reporting improvements.
- Improved local network deployment and operational reliability.

## License

This project is currently intended for personal and educational use. A formal license may be added in the future.

---

**Built to solve a real business problem while learning how to design, develop, and maintain practical software systems.**
