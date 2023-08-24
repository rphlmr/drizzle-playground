import "dotenv/config";

if (!process.env.DATABASE_URL) {
	console.error(
		"\x1b[35m%s\x1b[0m",
		"🚨 No DB_CONNECTION_STRING env provided",
	);
	process.exit(1);
}

export const DATABASE_URL = process.env.DATABASE_URL!;
