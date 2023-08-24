import { relations, sql } from "drizzle-orm";
import {
	sqliteTable,
	text,
	integer,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const countries = sqliteTable(
	"countries",
	{
		id: integer("id").primaryKey(),
		name: text("name"),
	},
	(countries) => ({
		nameIdx: uniqueIndex("nameIdx").on(countries.name),
	}),
);

export const cities = sqliteTable("cities", {
	id: integer("id").primaryKey(),
	name: text("name"),
	countryId: integer("country_id").references(() => countries.id),
});

export const users = sqliteTable("users", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
}));

export const posts = sqliteTable("posts", {
	id: integer("id").primaryKey(),
	content: text("content").notNull(),
	authorId: integer("author_id").notNull(),
	timestamp: integer("timestamp").default(sql`CURRENT_TIMESTAMP`),
});

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
