CREATE TABLE IF NOT EXISTS "notification" (
	"id" bigserial NOT NULL,
	"to_user_id" uuid NOT NULL,
	"read_at" timestamp(3),
	CONSTRAINT notification_id_to_user_id PRIMARY KEY("id","to_user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification" ADD CONSTRAINT "notification_id_event_id_fk" FOREIGN KEY ("id") REFERENCES "event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification" ADD CONSTRAINT "notification_to_user_id_user_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
