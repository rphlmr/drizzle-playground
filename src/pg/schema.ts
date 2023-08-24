import { relations } from "drizzle-orm";
import {
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";

export const popularityEnum = pgEnum("popularity", [
	"unknown",
	"known",
	"popular",
]);

export const countries = pgTable(
	"countries",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: 256 }),
	},
	(countries) => {
		return {
			nameIndex: uniqueIndex("name_idx").on(countries.name),
		};
	},
);

export const cities = pgTable("cities", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 256 }),
	countryId: integer("country_id").references(() => countries.id),
	popularity: popularityEnum("popularity"),
});

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
}));

export const posts = pgTable("posts", {
	id: serial("id").primaryKey(),
	content: text("content").notNull(),
	authorId: integer("author_id").notNull(),
});

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
