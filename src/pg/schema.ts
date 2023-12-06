import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
	AnyPgColumn,
	bigserial,
	customType,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
});

export const club = pgTable("club", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
});

const pubTypes = ["post", "event"] as const;

export const pub = pgTable("pub", {
	id: uuid("id").primaryKey().defaultRandom(),
	clubId: uuid("club_id")
		.references(() => club.id)
		.notNull(),
	type: text("type", { enum: pubTypes }).notNull(),
});

export const pubComment = pgTable("pub_comment", {
	id: uuid("id").primaryKey().defaultRandom(),
	pubId: uuid("pub_id")
		.references(() => pub.id)
		.notNull(),
	text: text("text").notNull(),
});

export const pubPost = pgTable("pub_post", {
	id: uuid("id")
		.references(() => pub.id, { onDelete: "cascade" })
		.primaryKey(),
	title: text("title").notNull(),
	content: text("content").notNull(),
});

export const pubEvent = pgTable("pub_event", {
	id: uuid("id")
		.references(() => pub.id, { onDelete: "cascade" })
		.primaryKey(),
	title: text("title").notNull(),
});

export const jsonb = <TData>(name: string) =>
	customType<{ data: TData; driverData: TData }>({
		dataType() {
			return "jsonb";
		},
		toDriver(val: TData): TData {
			return val;
		},
		fromDriver(value): TData {
			if (typeof value === "string") {
				try {
					return JSON.parse(value) as TData;
				} catch {}
			}
			return value as TData;
		},
	})(name);

const eventTypes = ["pub_upvote", "com_upvote"] as const;
export type EventType = (typeof eventTypes)[number];

const eventType = {
	pub_upvote: "pub_upvote",
	com_upvote: "com_upvote",
} satisfies Record<EventType, EventType>;

function makeNotificationTableName(type?: EventType) {
	const name = "notification";
	return type ? `${name}_${type}` : name;
}

export type EventData =
	| { type: "com_upvote"; commentId: string; text: string }
	| { type: "pub_upvote"; pubId: string; title: string };

export const event = pgTable("event", {
	id: bigserial("id", { mode: "number" }).primaryKey(),
	fromUserId: uuid("from_user_id")
		.references(() => user.id)
		.notNull(),
	clubId: uuid("club_id")
		.references(() => club.id)
		.notNull(),
	data: jsonb("data").$type<EventData>().notNull(),
	createdAt: timestamp("created_at", {
		mode: "string",
		precision: 3,
	}).defaultNow(),
});

export const notification = pgTable(
	"notification",
	{
		eventId: bigserial("eventId", { mode: "number" })
			.references(() => event.id)
			.notNull(),
		toUserId: uuid("to_user_id")
			.references(() => user.id)
			.notNull(),
		clubId: uuid("club_id")
			.references(() => club.id)
			.notNull(),
		readAt: timestamp("read_at", {
			mode: "string",
			precision: 3,
		}),
	},
	(table) => ({
		cpk: primaryKey({ columns: [table.eventId, table.toUserId] }),
	}),
);

// export const notificationPubUpvote = pgTable("notification_pub_upvote", {
// 	id: uuid("id")
// 		.references(() => notification.id, { onDelete: "cascade" })
// 		.primaryKey(),
// 	pubId: uuid("pub_id")
// 		.references(() => pub.id, { onDelete: "cascade" })
// 		.notNull(),
// });

// export const notificationComUpvote = pgTable("notification_com_upvote", {
// 	id: uuid("id")
// 		.references(() => notification.id, { onDelete: "cascade" })
// 		.primaryKey(),
// 	commentId: uuid("comment_id")
// 		.references(() => pubComment.id, {
// 			onDelete: "cascade",
// 		})
// 		.notNull(),
// });
