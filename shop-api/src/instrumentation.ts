export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.DB_RUN_MIGRATIONS === "true") {
    const { runMigrations } = await import("./infrastructure/typeorm/data-source");
    await runMigrations();
  }
}
