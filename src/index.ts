import "dotenv/config";
import { db } from "./pg/postgres-js";
import { cities } from "./pg/schema";

async function main() {
	// Write your code here
	console.log(db.select().from(cities).toSQL());
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch(console.error);
