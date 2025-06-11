import { User } from "./schema";

import env from "@/envs-runtime";
import { createDb } from ".";

export default async function seed() {
  const db = createDb(env);
  await db.delete(User);

  await db
    .insert(User)
    .values({
      email: "rileypaul96@gmail.com",
      githubId: 71047303,
      githubUsername: "rjp301",
      name: "Riley Paul",
      avatarUrl: "https://avatars.githubusercontent.com/u/71047303?v=4",
    })
    .returning();

  console.log(`✅ Seeded user`);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
