## System Architecture

The application follows a modular architecture with a unified frontend and a backend organized around business domains.

```text
                       Store POS
                           |
                 Unified React Frontend
                           |
                    Express REST API
                           |
             +-------------+-------------+
             |                           |
       General Store                 Gas Business
             |                           |
       Item Sales                    Gas Sales
       Item Purchases                Gas Purchases
       Item Inventory                Gas Inventory
       Unit Conversions               Allocations
             |                           |
             +-------------+-------------+
                           |
                  Shared Infrastructure
                           |
       +-------------------+-------------------+
       |                   |                   |
    Payments          Cash Management       Audit Logs
                           |
                      PostgreSQL
```

The architecture aims to keep domain-specific business logic independent while allowing shared transaction, payment, and reporting capabilities.
