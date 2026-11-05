import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export default {
  "database-url": process.env.DATABASE_URL,
  "migrations-table": "pgmigrations",
  "migrations-dir": "../database/migrations",
  "schema": "public"
};