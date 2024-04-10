import { client } from "./index";
import { createServer } from "pglite-server";

async function run() {
	await client.waitReady;

	const pgServer = createServer(client);
	const PORT = 5432;

	pgServer.listen(PORT, () => {
		console.log(`Server bound to port ${PORT}`);
	});
}

void run();
