import { db } from "~/lib/db";

async function seed() {
  await db.list.deleteMany({});

  console.log("🌱 seeded");
}

seed();
