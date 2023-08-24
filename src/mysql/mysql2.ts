import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
	host: process.env.MY_SQL_HOST!,
	user: process.env.MY_SQL_USER!,
	database: process.env.MY_SQL_DATABASE!,
});
export const db = drizzle(connection);
