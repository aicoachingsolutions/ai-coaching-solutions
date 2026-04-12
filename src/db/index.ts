import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DbInstance = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  db: DbInstance | undefined;
};

export function getDb(): DbInstance {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!globalForDb.db) {
    const sql = neon(url);
    globalForDb.db = drizzle(sql, { schema });
  }
  return globalForDb.db;
}
