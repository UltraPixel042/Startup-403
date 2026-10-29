CREATE EXTENSION IF NOT EXISTS "pgcrypto";
--> statement-breakpoint
CREATE TABLE "cafes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "area" text DEFAULT 'Bang Mod' NOT NULL,
  "map_url" text,
  "contact_url" text,
  "data_status" text DEFAULT 'sample' NOT NULL,
  "verified_at" timestamp with time zone,
  "source_label" text DEFAULT 'Prototype seed data' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "cafes_data_status_check" CHECK ("cafes"."data_status" in ('sample', 'verified', 'pending_review'))
);
--> statement-breakpoint
CREATE TABLE "cafe_attributes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "cafe_id" uuid NOT NULL,
  "capacity" integer NOT NULL,
  "recommended_party_min" integer DEFAULT 1 NOT NULL,
  "recommended_party_max" integer NOT NULL,
  "has_power_outlets" boolean DEFAULT false NOT NULL,
  "wifi_quality" text DEFAULT 'unknown' NOT NULL,
  "food_available" boolean DEFAULT false NOT NULL,
  "opening_hours" text NOT NULL,
  "atmosphere" text NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "cafe_attributes_cafe_id_cafes_id_fk" FOREIGN KEY ("cafe_id") REFERENCES "public"."cafes"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "cafe_attributes_capacity_check" CHECK ("cafe_attributes"."capacity" > 0),
  CONSTRAINT "cafe_attributes_party_size_check" CHECK ("cafe_attributes"."recommended_party_min" > 0 and "cafe_attributes"."recommended_party_max" >= "cafe_attributes"."recommended_party_min"),
  CONSTRAINT "cafe_attributes_wifi_quality_check" CHECK ("cafe_attributes"."wifi_quality" in ('none', 'basic', 'good', 'unknown'))
);
--> statement-breakpoint
CREATE TABLE "field_notes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "cafe_id" uuid NOT NULL,
  "seed_key" text,
  "context" text NOT NULL,
  "suitable_party_min" integer DEFAULT 1 NOT NULL,
  "suitable_party_max" integer NOT NULL,
  "note" text NOT NULL,
  "observed_at" timestamp with time zone NOT NULL,
  "source_label" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "field_notes_cafe_id_cafes_id_fk" FOREIGN KEY ("cafe_id") REFERENCES "public"."cafes"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "field_notes_party_size_check" CHECK ("field_notes"."suitable_party_min" > 0 and "field_notes"."suitable_party_max" >= "field_notes"."suitable_party_min")
);
--> statement-breakpoint
CREATE TABLE "saved_cafes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "anonymous_session_id" text NOT NULL,
  "cafe_id" uuid NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "saved_cafes_cafe_id_cafes_id_fk" FOREIGN KEY ("cafe_id") REFERENCES "public"."cafes"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "saved_cafes_session_cafe_unique" UNIQUE("anonymous_session_id", "cafe_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "anonymous_session_id" text,
  "cafe_id" uuid,
  "event_type" text NOT NULL,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "events_cafe_id_cafes_id_fk" FOREIGN KEY ("cafe_id") REFERENCES "public"."cafes"("id") ON DELETE set null ON UPDATE no action,
  CONSTRAINT "events_type_check" CHECK ("events"."event_type" in ('profile_view', 'save', 'share', 'map_click', 'contact_click'))
);
--> statement-breakpoint
CREATE TABLE "profile_change_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "cafe_id" uuid NOT NULL,
  "submitter_name" text,
  "submitter_email" text,
  "proposed_changes" jsonb NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "reviewed_at" timestamp with time zone,
  CONSTRAINT "profile_change_requests_cafe_id_cafes_id_fk" FOREIGN KEY ("cafe_id") REFERENCES "public"."cafes"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "profile_change_requests_status_check" CHECK ("profile_change_requests"."status" in ('pending', 'approved', 'rejected'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "cafes_slug_unique" ON "cafes" USING btree ("slug");
--> statement-breakpoint
CREATE UNIQUE INDEX "cafe_attributes_cafe_id_unique" ON "cafe_attributes" USING btree ("cafe_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "field_notes_seed_key_unique" ON "field_notes" USING btree ("seed_key");
--> statement-breakpoint
CREATE INDEX "field_notes_cafe_id_index" ON "field_notes" USING btree ("cafe_id");
--> statement-breakpoint
CREATE INDEX "saved_cafes_session_index" ON "saved_cafes" USING btree ("anonymous_session_id");
--> statement-breakpoint
CREATE INDEX "events_cafe_id_index" ON "events" USING btree ("cafe_id");
--> statement-breakpoint
CREATE INDEX "events_occurred_at_index" ON "events" USING btree ("occurred_at");
--> statement-breakpoint
CREATE INDEX "profile_change_requests_cafe_id_index" ON "profile_change_requests" USING btree ("cafe_id");
--> statement-breakpoint
CREATE INDEX "profile_change_requests_status_index" ON "profile_change_requests" USING btree ("status");
