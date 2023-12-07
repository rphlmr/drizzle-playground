import "dotenv/config";
import { db } from "./pg/postgres-js";
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
import { comment, file, tag, tagsPivot, user } from "./pg/schema";
import { count } from "./utils";
import { SelectResultFields } from "drizzle-orm/query-builders/select.types";

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

async function main() {
	const tagIdFilter = "330b7583-ce67-4ce0-aacc-8e34030f75f0";
	const commentQuery = db
		.select({
			id: distinctOn(comment.id).mapWith(String).as("comment_id"),
			fileId: sql`${comment.fileId}`.mapWith(String).as("file_id"),
			text: comment.text,
			commenter: {
				id: sql`${user.id}`.mapWith(String).as("commenter_id"),
				name: user.name,
			},
		})
		.from(comment)
		.innerJoin(user, eq(comment.commenterId, user.id))
		.orderBy(comment.id)
		.as("comment_query");

	const commentsQuery = db
		.select({
			fileId: commentQuery.fileId,
			comments: jsonAggBuildObject({
				id: commentQuery.id,
				text: commentQuery.text,
				commenter: jsonBuildObject({
					id: commentQuery.commenter.id,
					name: commentQuery.commenter.name,
				}),
			}).as("comments"),
		})
		.from(commentQuery)
		.groupBy(commentQuery.fileId)
		.as("comments_query");

	const tagQuery = db
		.select({
			id: distinctOn(tagsPivot.tagId).mapWith(String).as("tag_id"),
			fileId: sql`${tagsPivot.fileId}`
				.mapWith(String)
				.as("tagged_file_id"),
			name: tag.name,
		})
		.from(tagsPivot)
		.innerJoin(tag, eq(tag.id, tagsPivot.tagId))
		.orderBy(tagsPivot.tagId)
		.as("tag_query");

	const tagsQuery = db
		.select({
			fileId: tagQuery.fileId,
			tags: jsonAggBuildObject({
				id: tagQuery.id,
				name: tagQuery.name,
			}).as("tags"),
		})
		.from(tagQuery)
		.groupBy(tagQuery.fileId)
		.as("tags_query");

	const result = await db
		.select({
			...getTableColumns(file),
			comments: commentsQuery.comments,
			tags: tagsQuery.tags,
		})
		.from(file)
		.where(inJsonArray(tagsQuery.tags, "id", tagIdFilter))
		.leftJoin(commentsQuery, eq(commentsQuery.fileId, file.id))
		.leftJoin(tagsQuery, eq(tagsQuery.fileId, file.id));

	console.log(JSON.stringify(result, null, 2));
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch(console.error);
