/* eslint-disable no-console */
import Database from "better-sqlite3";
import "dotenv/config";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import * as schema from "./sqlite/schema";

async function runMigrate() {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not set");
	}

	const sqlite = new Database("./src/sqlite/sqlite.db");
	const db = drizzle(sqlite, { schema });

	console.log("⏳ Running migrations...");

	const start = Date.now();

	migrate(db, { migrationsFolder: `${__dirname}/sqlite/drizzle` });

	const end = Date.now();

	console.log(`✅ Migration end & took ${end - start}ms`);

	process.exit(0);
}

runMigrate().catch((err) => {
	console.error("❌ Migration failed");
	console.error(err);
	process.exit(1);
});
