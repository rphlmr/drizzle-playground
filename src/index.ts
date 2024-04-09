import "dotenv/config";
// import { db } from "./pg/postgres-js";
import {
	InferColumnsDataTypes,
	and,
	asc,
	eq,
	getTableColumns,
	InferModelFromColumns,
	inArray,
	isNull,
	lt,
	or,
	sql,
	GetColumnData,
	SQLWrapper,
	InferSelectModel,
	AnyColumn,
	SQL,
	gt,
} from "drizzle-orm";
import {
	AnyPgSelectQueryBuilder,
	PgColumn,
	PgDialect,
	PgTable,
	SelectedFields,
	TableConfig,
	alias,
	uuid,
} from "drizzle-orm/pg-core";
import { count } from "./utils";
import { SelectResultFields } from "drizzle-orm/query-builders/select.types";
import { User } from "./pg/schema";
import { db } from "./sqlite/better-sqlite3";
import { posts } from "./sqlite/schema";

// const pubUpvote = db
// 	.select({
// 		...getTableColumns(notificationPubUpvote),
// 		post: getTableColumns(pubPost),
// 		event: getTableColumns(pubEvent),
// 	})
// 	.from(notificationPubUpvote)
// 	.leftJoin(pubPost, eq(notificationPubUpvote.pubId, pubPost.id))
// 	.leftJoin(pubEvent, eq(notificationPubUpvote.pubId, pubEvent.id))
// 	.as("pub_upvote_b");

// const pubUpvote = db
// 	.select({
// 		// ...getTableColumns(notificationPubUpvote),
// 		id: sql`${notificationPubUpvote.id}`.as("notification_pub_upvote_id"),
// 		post: getTableColumns(pubPost),
// 		event: getTableColumns(pubEvent),
// 	})
// 	.from(notificationPubUpvote)
// 	.leftJoin(pubPost, eq(notificationPubUpvote.pubId, pubPost.id))
// 	.leftJoin(pubEvent, eq(notificationPubUpvote.pubId, pubEvent.id))
// 	.as("pub_upvote");

// async function getNotifications() {
// 	const result = await db
// 		.select({
// 			notification: {
// 				id: notification.id,
// 				type: notification.type,
// 				clubId: notification.clubId,
// 				readAt: notification.readAt,
// 			},
// 			fromUser: {
// 				name: user.name,
// 			},
// 			// pub_upvote
// 			notificationPubUpvote: { pubId: notificationPubUpvote.pubId },
// 			pubPost: { title: pubPost.title },
// 			pubEvent: { title: pubEvent.title },
// 			// com_upvote
// 			notificationComUpvote: {
// 				commentId: notificationComUpvote.commentId,
// 			},
// 			pubComment: { pubId: pubComment.pubId, text: pubComment.text },
// 		})
// 		.from(notification)
// 		.where(eq(notification.toUserId, VINCENT))
// 		.innerJoin(user, eq(notification.fromUserId, user.id))
// 		.leftJoin(
// 			notificationPubUpvote,
// 			eq(notification.id, notificationPubUpvote.id),
// 		)
// 		.leftJoin(pubPost, eq(notificationPubUpvote.pubId, pubPost.id))
// 		.leftJoin(pubEvent, eq(notificationPubUpvote.pubId, pubEvent.id))
// 		.leftJoin(
// 			notificationComUpvote,
// 			eq(notification.id, notificationComUpvote.id),
// 		)
// 		.leftJoin(
// 			pubComment,
// 			eq(notificationComUpvote.commentId, pubComment.id),
// 		);
// 	console.log(result);

// 	return result.map((result) => {
// 		const { notification, fromUser } = result;
// 		const base = {
// 			...notification,
// 			fromUser,
// 		};

// 		switch (base.type) {
// 			case "pub_upvote": {
// 				const { notificationPubUpvote, pubPost, pubEvent } = result;
// 				return {
// 					...base,
// 					...notificationPubUpvote!,
// 					title: (pubPost?.title || pubEvent?.title)!,
// 					type: base.type,
// 				};
// 			}
// 			case "com_upvote": {
// 				const { notificationComUpvote, pubComment } = result;
// 				return {
// 					...base,
// 					...notificationComUpvote!,
// 					...pubComment!,
// 					type: base.type,
// 				};
// 			}
// 		}
// 	});
// }

// async function countUnreadNotification() {
// 	const result = await db
// 		.select({
// 			count: count(notification.id),
// 		})
// 		.from(notification)
// 		.where(
// 			and(
// 				eq(notification.toUserId, VINCENT),
// 				isNull(notification.readAt),
// 			),
// 		);

// 	console.log(result);

// 	return result[0].count;
// }

// async function getNotificationsA({
// 	userId,
// 	clubId,
// }: {
// 	userId: string;
// 	clubId?: string;
// }) {
// 	const result = await db
// 		.select()
// 		.from(notification)
// 		.where(
// 			and(
// 				eq(notification.toUserId, userId),
// 				clubId ? eq(event.clubId, clubId) : undefined,
// 			),
// 		)
// 		.innerJoin(event, eq(notification.eventId, event.id));
// }

// await db.query.files
//   .findMany({
//     where,
//     with: {
//       comments: {
//         where: eq(comments.commentType, CommentType.files),
//         with: {
//           commenter: true,
//         },
//       },
//       tags: {
//         where: eq(tagsPivot.tagType, TagType.files),
//         with: {
//           tag: true,
//         },
//       },
//     },
//     orderBy: [desc(filesModel.updatedAt)],
//     offset: page * size,
//     limit: size,
//   })

export function distinctOn<Column extends AnyColumn>(column: Column) {
	return sql<Column["_"]["data"]>`distinct on (${column}) ${column}`;
}

export function jsonBuildObject<T extends SelectedFields>(shape: T) {
	const chunks: SQL[] = [];

	Object.entries(shape).forEach(([key, value]) => {
		if (chunks.length > 0) {
			chunks.push(sql.raw(`,`));
		}
		chunks.push(sql.raw(`'${key}',`));
		chunks.push(sql`${value}`);
	});

	return sql<SelectResultFields<T>>`coalesce(json_build_object(${sql.join(
		chunks,
	)}), '{}')`;
}

export function jsonAggBuildObject<T extends SelectedFields>(shape: T) {
	return sql<SelectResultFields<T>[]>`coalesce(jsonb_agg(${jsonBuildObject(
		shape,
	)}), '[]')`;
}

export function eqJsonb<T extends PgColumn>(
	column: T,
	value: Partial<GetColumnData<T, "raw">>,
) {
	return sql`${column} @> ${value}`;
}

export function inJsonArray<T extends SQL.Aliased<unknown[]>>(
	jsonArray: T,
	key: keyof T["_"]["type"][number],
	value: string,
) {
	const element = sql.raw(`${String(key)}_array_element`);

	return sql`EXISTS (
		SELECT 1
		FROM jsonb_array_elements(${jsonArray}) AS ${element}
		WHERE ${element}->>${key} = ${value}
	  )`;
}

// function wait(ms: number) {
// 	return new Promise((resolve) => setTimeout(resolve, ms));
// }

// function makeUserQuery(userId: string) {
// 	return db
// 		.select()
// 		.from(User)
// 		.where(eq(User.id, userId))
// 		.as("user_club_ids_query");
// }

// const userQuery = db
// 	.select()
// 	.from(User)
// 	.where(eq(User.id, sql.placeholder("userId")))
// 	.prepare("user_club_ids_query");

// const userWithMoney = db.select().from(User).where(gt(User.balance, 0));

async function main() {
	const allPosts = await db.select().from(posts);

	console.log(allPosts);

	// await db.insert(posts).values({
	// 	authorId: 1,
	// 	content: "Hello world",
	// 	id: 1,
	// });

	await db
		.update(posts)
		.set({ content: "Hello world 2" })
		.where(eq(posts.id, 1));

	// const userId = "ea8dfc50-9ed4-4acc-838b-1f6556973d24";

	// const result = await db.transaction(
	// 	async (tx) => {
	// 		console.log("start");

	// 		const [user] = await tx.select().from(makeUserQuery(userId));

	// 		console.log("user", user);

	// 		console.log("concurrent write");
	// 		await db
	// 			.update(User)
	// 			.set({ balance: 0 })
	// 			.where(eq(User.id, userId));

	// 		// await wait(10_000);

	// 		console.log("updating");

	// 		await tx
	// 			.update(User)
	// 			.set({ balance: sql`${User.balance} + 100` })
	// 			.where(eq(User.id, userId))
	// 			.returning();

	// 		// throw new Error("rollback");
	// 	},
	// 	{
	// 		isolationLevel: "serializable",
	// 	},
	// );

	// console.log(JSON.stringify(result, null, 2));
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
