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
} from "drizzle-orm";
import { PgColumn, PgDialect, alias, uuid } from "drizzle-orm/pg-core";
import {
	EventData,
	event,
	notification,
	pub,
	pubComment,
	pubEvent,
	pubPost,
	user,
} from "./pg/schema";
import { count } from "./utils";

const VINCENT = "fc9e127c-89dd-43bb-a6ec-29f53c618c34";
const RAPHAEL = "f67d929d-779c-4a5b-860c-c8db17ae5d2a";
const NIKOLAS = "b5c7c4f2-fc37-45c4-8ed3-43bd3ce79455";

const club = {
	at: "bfd2905f-8eb1-422e-8fce-23335d8b62c3",
	jediTemple: "2bf3f6a6-66b2-469e-803d-ef09ad18a26f",
};

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

function eqJsonb<T extends PgColumn>(
	column: T,
	value: Partial<GetColumnData<T, "raw">>,
) {
	return sql`${column} @> ${value}`;
}

function pickJsonbField<T extends PgColumn>(
	column: T,
	field: keyof GetColumnData<T, "raw">,
	cast?: "uuid",
) {
	return sql`((${column}->>${field})${
		cast ? sql.raw(`::${cast}`) : undefined
	})`;
}

async function getNotifications({
	userId,
	clubId,
}: {
	userId: string;
	clubId?: string;
}) {
	const results = await db
		.select({
			...getTableColumns(event),
			...getTableColumns(notification),
			fromUser: {
				name: user.name,
				id: user.id,
			},
		})
		.from(event)
		.where(
			and(
				eq(notification.toUserId, userId),
				clubId ? eq(event.clubId, clubId) : undefined,
			),
		)
		.innerJoin(notification, eq(event.id, notification.eventId))
		.innerJoin(user, eq(event.fromUserId, user.id))
		.orderBy(asc(event.createdAt));

	return results;
}

async function countUnreadNotification({
	userId,
	clubId,
}: {
	userId: string;
	clubId?: string;
}) {
	const [{ unreadCount }] = await db
		.select({ unreadCount: count(notification.eventId) })
		.from(notification)
		.where(
			and(
				eq(notification.toUserId, userId),
				isNull(notification.readAt),
				clubId ? eq(notification.clubId, clubId) : undefined,
			),
		);
	return unreadCount;
}

async function emitEvent() {
	await db.transaction(async (tx) => {
		const [event1] = await tx
			.insert(event)
			.values({
				clubId: club.jediTemple,
				fromUserId: RAPHAEL,
				data: {
					type: "pub_upvote",
					pubId: "545985bd-8d8d-46a4-8322-9368bd626195",
					title: "Master jedi",
				},
			})
			.returning({ eventId: event.id, clubId: event.clubId });

		await tx.insert(notification).values({
			toUserId: VINCENT,
			eventId: event1.eventId,
			clubId: event1.clubId,
		});

		const [event2] = await tx
			.insert(event)
			.values({
				clubId: club.at,
				fromUserId: RAPHAEL,
				data: {
					type: "pub_upvote",
					pubId: "bf66d61d-aa19-4f29-a3ad-c0ad0d379fe0",
					title: "Hello AT",
				},
			})
			.returning({ eventId: event.id, clubId: event.clubId });

		await tx.insert(notification).values({
			toUserId: VINCENT,
			eventId: event2.eventId,
			clubId: event2.clubId,
		});

		const [event3] = await tx
			.insert(event)
			.values({
				clubId: club.at,
				fromUserId: RAPHAEL,
				data: {
					type: "com_upvote",
					commentId: "99faa050-af82-45ae-879f-1f98afb9ec4b",
					text: "Ok et?",
				},
			})
			.returning({ eventId: event.id, clubId: event.clubId });

		await tx.insert(notification).values([
			{
				toUserId: VINCENT,
				eventId: event3.eventId,
				clubId: event3.clubId,
			},
			{
				toUserId: NIKOLAS,
				eventId: event3.eventId,
				clubId: event3.clubId,
			},
		]);
	});
}

async function main() {
	const notifications = await getNotifications({
		userId: VINCENT,
		clubId: club.at,
	});
	console.log("notifications", notifications);
	// await emitEvent();
	const unreadCount = await countUnreadNotification({
		userId: VINCENT,
		clubId: club.at,
	});
	console.log("unreadCount", unreadCount);

	// const allEvents = await db.select().from(event);

	// notifications.forEach((notification) => {
	// 	switch (notification.type) {
	// 		case "pub_upvote": {
	// 			console.log(
	// 				`${notification.fromUser.name} a liké ta publication "${notification.title}"`,
	// 			);
	// 			break;
	// 		}
	// 		case "com_upvote": {
	// 			console.log(
	// 				`${notification.fromUser.name} a liké ton commentaire "${notification.text}"`,
	// 			);
	// 			break;
	// 		}
	// 	}
	// });
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch(console.error);
