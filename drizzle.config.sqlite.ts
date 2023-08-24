import "dotenv/config";

import type { Config } from "drizzle-kit";

export default {
	schema: "./src/sqlite/schema.ts",
	out: "./src/sqlite/drizzle",
	driver: "better-sqlite",
	dbCredentials: {
		url: "./src/sqlite/sqlite.db",
	},
	verbose: true,
} satisfies Config;
