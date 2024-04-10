import "dotenv/config";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { client } from "./pg/pglite";

async function runMigrate() {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not set");
	}

	const db = drizzle(client, { logger: true });

	console.log("⏳ Running migrations...");

	const start = Date.now();

	await migrate(db, { migrationsFolder: `${__dirname}/pg/drizzle` });

	const end = Date.now();

	console.log(`✅ Migration end & took ${end - start}ms`);

	process.exit(0);
}

runMigrate().catch((err) => {
	console.error("❌ Migration failed");
	console.error(err);
	process.exit(1);
});
