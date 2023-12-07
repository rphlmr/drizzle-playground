ALTER TABLE "tags_pivot" DROP CONSTRAINT "tags_pivot_file_id_tag_id";--> statement-breakpoint
ALTER TABLE "tags_pivot" ADD COLUMN "id" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "tags_pivot" ADD CONSTRAINT "tags_pivot_file_id_tag_id_pk" PRIMARY KEY("file_id","tag_id");