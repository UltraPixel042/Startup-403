CREATE TABLE "seat_checkins" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "anonymous_session_id" text NOT NULL,
  "cafe_id" uuid NOT NULL,
  "layout_table_id" text NOT NULL,
  "party_size" integer DEFAULT 1 NOT NULL,
  "status" text DEFAULT 'checked_in' NOT NULL,
  "checked_in_at" timestamp with time zone DEFAULT now() NOT NULL,
  "checked_out_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "seat_checkins_status_check" CHECK ("seat_checkins"."status" in ('checked_in', 'checked_out')),
  CONSTRAINT "seat_checkins_party_size_check" CHECK ("seat_checkins"."party_size" > 0)
);
--> statement-breakpoint
ALTER TABLE "seat_checkins" ADD CONSTRAINT "seat_checkins_cafe_id_cafes_id_fk" FOREIGN KEY ("cafe_id") REFERENCES "public"."cafes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "seat_checkins_cafe_status_index" ON "seat_checkins" USING btree ("cafe_id", "status");
--> statement-breakpoint
CREATE INDEX "seat_checkins_session_status_index" ON "seat_checkins" USING btree ("anonymous_session_id", "status");
--> statement-breakpoint
CREATE UNIQUE INDEX "seat_checkins_active_table_unique" ON "seat_checkins" USING btree ("cafe_id", "layout_table_id") WHERE "seat_checkins"."status" = 'checked_in';
--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_type_check";
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_type_check" CHECK ("events"."event_type" in ('profile_view', 'save', 'share', 'map_click', 'contact_click', 'seat_check_in', 'seat_check_out'));
