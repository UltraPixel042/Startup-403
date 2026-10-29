import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Public data model for the discovery-first BrewBook prototype.
 *
 * The database deliberately stores a data-status and source for every cafe so
 * that prototype records cannot be mistaken for field-verified production data.
 */
export const cafes = pgTable(
  "cafes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    area: text("area").notNull().default("Bang Mod"),
    mapUrl: text("map_url"),
    contactUrl: text("contact_url"),
    dataStatus: text("data_status").notNull().default("sample"),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    sourceLabel: text("source_label").notNull().default("Prototype seed data"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("cafes_slug_unique").on(table.slug),
    check("cafes_data_status_check", sql`${table.dataStatus} in ('sample', 'verified', 'pending_review')`),
  ],
);

export const cafeAttributes = pgTable(
  "cafe_attributes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cafeId: uuid("cafe_id")
      .notNull()
      .references(() => cafes.id, { onDelete: "cascade" }),
    capacity: integer("capacity").notNull(),
    recommendedPartyMin: integer("recommended_party_min").notNull().default(1),
    recommendedPartyMax: integer("recommended_party_max").notNull(),
    hasPowerOutlets: boolean("has_power_outlets").notNull().default(false),
    wifiQuality: text("wifi_quality").notNull().default("unknown"),
    foodAvailable: boolean("food_available").notNull().default(false),
    openingHours: text("opening_hours").notNull(),
    atmosphere: text("atmosphere").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("cafe_attributes_cafe_id_unique").on(table.cafeId),
    check("cafe_attributes_capacity_check", sql`${table.capacity} > 0`),
    check(
      "cafe_attributes_party_size_check",
      sql`${table.recommendedPartyMin} > 0 and ${table.recommendedPartyMax} >= ${table.recommendedPartyMin}`,
    ),
    check("cafe_attributes_wifi_quality_check", sql`${table.wifiQuality} in ('none', 'basic', 'good', 'unknown')`),
  ],
);

export const fieldNotes = pgTable(
  "field_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cafeId: uuid("cafe_id")
      .notNull()
      .references(() => cafes.id, { onDelete: "cascade" }),
    // Only seed data has a seed key. User-created notes leave this null.
    seedKey: text("seed_key"),
    context: text("context").notNull(),
    suitablePartyMin: integer("suitable_party_min").notNull().default(1),
    suitablePartyMax: integer("suitable_party_max").notNull(),
    note: text("note").notNull(),
    observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
    sourceLabel: text("source_label").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("field_notes_seed_key_unique").on(table.seedKey),
    index("field_notes_cafe_id_index").on(table.cafeId),
    check(
      "field_notes_party_size_check",
      sql`${table.suitablePartyMin} > 0 and ${table.suitablePartyMax} >= ${table.suitablePartyMin}`,
    ),
  ],
);

export const savedCafes = pgTable(
  "saved_cafes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    anonymousSessionId: text("anonymous_session_id").notNull(),
    cafeId: uuid("cafe_id")
      .notNull()
      .references(() => cafes.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("saved_cafes_session_cafe_unique").on(table.anonymousSessionId, table.cafeId),
    index("saved_cafes_session_index").on(table.anonymousSessionId),
  ],
);

/**
 * A live seat occupancy record. Layout table IDs intentionally stay as text:
 * the corresponding positions live in the restaurant's versioned floor-plan
 * configuration, so a future layout service can own them independently.
 */
export const seatCheckins = pgTable(
  "seat_checkins",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    anonymousSessionId: text("anonymous_session_id").notNull(),
    cafeId: uuid("cafe_id")
      .notNull()
      .references(() => cafes.id, { onDelete: "cascade" }),
    layoutTableId: text("layout_table_id").notNull(),
    partySize: integer("party_size").notNull().default(1),
    status: text("status").notNull().default("checked_in"),
    checkedInAt: timestamp("checked_in_at", { withTimezone: true }).notNull().defaultNow(),
    checkedOutAt: timestamp("checked_out_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("seat_checkins_cafe_status_index").on(table.cafeId, table.status),
    index("seat_checkins_session_status_index").on(table.anonymousSessionId, table.status),
    uniqueIndex("seat_checkins_active_table_unique")
      .on(table.cafeId, table.layoutTableId)
      .where(sql`${table.status} = 'checked_in'`),
    check("seat_checkins_status_check", sql`${table.status} in ('checked_in', 'checked_out')`),
    check("seat_checkins_party_size_check", sql`${table.partySize} > 0`),
  ],
);

export const events = pgTable(
  "events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    anonymousSessionId: text("anonymous_session_id"),
    cafeId: uuid("cafe_id").references(() => cafes.id, { onDelete: "set null" }),
    eventType: text("event_type").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("events_cafe_id_index").on(table.cafeId),
    index("events_occurred_at_index").on(table.occurredAt),
    check(
      "events_type_check",
      sql`${table.eventType} in ('profile_view', 'save', 'share', 'map_click', 'contact_click', 'seat_check_in', 'seat_check_out')`,
    ),
  ],
);

export const profileChangeRequests = pgTable(
  "profile_change_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cafeId: uuid("cafe_id")
      .notNull()
      .references(() => cafes.id, { onDelete: "cascade" }),
    submitterName: text("submitter_name"),
    submitterEmail: text("submitter_email"),
    proposedChanges: jsonb("proposed_changes").notNull(),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  },
  (table) => [
    index("profile_change_requests_cafe_id_index").on(table.cafeId),
    index("profile_change_requests_status_index").on(table.status),
    check("profile_change_requests_status_check", sql`${table.status} in ('pending', 'approved', 'rejected')`),
  ],
);
