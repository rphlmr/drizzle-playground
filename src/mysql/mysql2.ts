import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import * as schema from "./schema";

const connection = await mysql.createConnection({
	host: process.env.MY_SQL_HOST!,
	user: process.env.MY_SQL_USER!,
	password: process.env.MY_SQL_PASSWORD!,
	database: process.env.MY_SQL_DATABASE!,
});
export const db = drizzle(connection, { schema, mode: "default" });
