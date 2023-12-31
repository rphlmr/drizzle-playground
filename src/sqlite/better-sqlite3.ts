import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

import * as schema from "./schema";

const sqlite = new Database("./src/sqlite/sqlite.db");
export const db = drizzle(sqlite, { schema });
