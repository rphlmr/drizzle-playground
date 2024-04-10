import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

// Local Postgres
export const client = new PGlite("./src/pg/pglite/data.db");

export const db = drizzle(client, { logger: true });
