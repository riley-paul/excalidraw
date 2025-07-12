import env from "@/envs-runtime";
import { createDb } from "..";
import { Drawing } from "../schema";
import { eq } from "drizzle-orm";

async function copyDrawingUpdatedAtToSavedAt() {
  const db = createDb(env);
  const drawings = await db.select().from(Drawing);
  const promises = drawings.map((drawing) =>
    db
      .update(Drawing)
      .set({ savedAt: drawing.updatedAt })
      .where(eq(Drawing.id, drawing.id)),
  );
  await Promise.all(promises);
  console.log(`Updated 'savedAt' field for ${drawings.length} drawings.`);
}

copyDrawingUpdatedAtToSavedAt();
