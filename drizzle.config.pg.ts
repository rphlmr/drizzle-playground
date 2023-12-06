import "dotenv/config";

// import type { Config } from "drizzle-kit";

export default {
	schema: "./src/pg/schema.ts",
	out: "./src/pg/drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: process.env.DATABASE_URL!,
	},
	verbose: true,
};
