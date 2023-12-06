ALTER TABLE "event" DROP CONSTRAINT "event_from_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT "event_club_id_club_id_fk";
--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN IF EXISTS "from_user_id";--> statement-breakpoint
ALTER TABLE "event" DROP COLUMN IF EXISTS "club_id";