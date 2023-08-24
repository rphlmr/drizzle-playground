import { relations } from "drizzle-orm";
import {
	int,
	mysqlEnum,
	mysqlTable,
	serial,
	text,
	uniqueIndex,
	varchar,
} from "drizzle-orm/mysql-core";

// declaring enum in database
export const countries = mysqlTable(
	"countries",
	{
		id: int("id").autoincrement().primaryKey(),
		name: varchar("name", { length: 256 }),
	},
	(countries) => ({
		nameIndex: uniqueIndex("name_idx").on(countries.name),
	}),
);

export const cities = mysqlTable("cities", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 256 }),
	countryId: int("country_id").references(() => countries.id),
	popularity: mysqlEnum("popularity", ["unknown", "known", "popular"]),
});

export const users = mysqlTable("users", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
}));

export const posts = mysqlTable("posts", {
	id: serial("id").primaryKey(),
	content: text("content").notNull(),
	authorId: int("author_id").notNull(),
});

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
