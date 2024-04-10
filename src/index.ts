import "dotenv/config";
import { db } from "./pg/pglite";
import { users } from "./pg/schema";
import { faker } from "@faker-js/faker";

async function main() {
	// Write your code here
	await db.insert(users).values({
		name: faker.person.fullName(),
	});

	console.log(await db.select().from(users));
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch(console.error);
