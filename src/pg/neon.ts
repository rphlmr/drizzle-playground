import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

export const client = neon(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
