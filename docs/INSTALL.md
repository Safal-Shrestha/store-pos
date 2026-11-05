## Getting Started

### Prerequisites

- Node.js (LTS)
- PostgreSQL
- npm
- Git

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd store-pos
```

Install backend dependencies:

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example`:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/store_pos
```

Create the PostgreSQL database and apply the database migrations.

Start the backend:

```bash
npm run dev
```

Install and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

> Setup commands may change as the project evolves.
