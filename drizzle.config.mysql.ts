import "dotenv/config";

import type { Config } from "drizzle-kit";

export default {
	schema: "./src/mysql/schema.ts",
	out: "./src/mysql/drizzle",
	driver: "mysql2",
	dbCredentials: {
		host: process.env.MY_SQL_HOST!,
		user: process.env.MY_SQL_USER!,
		password: process.env.MY_SQL_PASSWORD!,
		database: process.env.MY_SQL_DATABASE!,
	},
	verbose: true,
} satisfies Config;
