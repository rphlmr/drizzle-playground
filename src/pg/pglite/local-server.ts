import { createServer } from "pglite-server";

import { client } from "./index";

const pgServer = createServer(client, { keepAlive: true });
const PORT = 5432;

pgServer.listen(PORT, () => {
	console.log(`PGLite Server bound to port ${PORT}`);
});
