import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

export function createDatabase(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to create the BrewBook database client.");
  }

  // Supabase's shared transaction pooler does not support prepared statements.
  const client = postgres(databaseUrl, { max: 10, prepare: false, ssl: "require" });
  const db = drizzle(client, { schema });

  return { client, db };
}

export type BrewBookDatabase = ReturnType<typeof createDatabase>["db"];
