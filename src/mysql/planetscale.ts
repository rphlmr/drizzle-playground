import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";

import * as schema from "./schema";

const client = connect({
	host: process.env.PS_HOST!,
	username: process.env.PS_USERNAME!,
	password: process.env.PS_PASSWORD!,
});
export const db = drizzle(client, { schema });
