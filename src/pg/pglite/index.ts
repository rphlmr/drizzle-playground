import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

// Local Postgres
export const client = new PGlite("./src/pg/pglite/data.db");

export const db = drizzle(client, { logger: true });

// If you want to use PGLite in memory (without any file persistence)
// Run your migrations here or in a separate script, but make sure to run them before using the db.
// await migrate(db, { migrationsFolder: `./src/pg/drizzle` });
