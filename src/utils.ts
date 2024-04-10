import { AnyColumn, sql } from "drizzle-orm";

export function count<Column extends AnyColumn>(column: Column) {
	return sql<number>`cast(count(${column}) as integer)`;
}
