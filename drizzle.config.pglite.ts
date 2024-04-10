import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
	schema: "./src/pg/schema.ts",
	out: "./src/pg/drizzle",
	driver: "pg",
	dbCredentials: {
		host: "localhost",
		database: "postgres",
		port: 5432,
		user: "postgres",
	},
	verbose: true,
} satisfies Config;
