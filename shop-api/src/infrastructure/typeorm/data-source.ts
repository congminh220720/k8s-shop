import "reflect-metadata";
import pg from "pg";
import { DataSource } from "typeorm";
import { Init1761700000000 } from "./migrations/1761700000000-init";
import { OrderItemSchema, OrderSchema, ProductSchema } from "./schemas";

const MIGRATION_LOCK_ID = 726354;

function createDataSource() {
  return new DataSource({
    type: "postgres",
    // Explicit import so Next.js output tracing bundles pg into standalone.
    driver: pg,
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    extra: { max: Number(process.env.DB_POOL_MAX ?? 10) },
    entities: [ProductSchema, OrderSchema, OrderItemSchema],
    migrations: [Init1761700000000],
    synchronize: false,
  });
}

// Survive Next.js dev hot-reload without leaking pools.
const g = globalThis as unknown as { __shopDs?: Promise<DataSource> };

export function getDataSource(): Promise<DataSource> {
  g.__shopDs ??= createDataSource()
    .initialize()
    .catch((err) => {
      g.__shopDs = undefined;
      throw err;
    });
  return g.__shopDs;
}

/** Runs pending migrations; a Postgres advisory lock prevents concurrent runs across replicas. */
export async function runMigrations(): Promise<void> {
  const ds = await getDataSource();
  const lock = ds.createQueryRunner();
  await lock.connect();
  try {
    await lock.query("SELECT pg_advisory_lock($1)", [MIGRATION_LOCK_ID]);
    const ran = await ds.runMigrations({ transaction: "all" });
    if (ran.length) console.log(`Applied migrations: ${ran.map((m) => m.name).join(", ")}`);
  } finally {
    await lock.query("SELECT pg_advisory_unlock($1)", [MIGRATION_LOCK_ID]).catch(() => {});
    await lock.release();
  }
}
