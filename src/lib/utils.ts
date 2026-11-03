import * as tables from "@/db/schema";
import { eq } from "drizzle-orm";
import { createDb } from "@/db";

export const exceedsStorageLimit = async (
  ctx: { userId: string; env: Env },
  newDrawing: { id: string; fileSize: number | null },
) => {
  const db = createDb(ctx.env);
  const drawingSizes = await db
    .select({ id: tables.Drawing.id, fileSize: tables.Drawing.fileSize })
    .from(tables.Drawing)
    .where(eq(tables.Drawing.userId, ctx.userId));

  const drawingSizeMap: Record<string, number> = {};
  drawingSizes.forEach((drawing) => {
    drawingSizeMap[drawing.id] = drawing.fileSize ?? 0;
  });
  drawingSizeMap[newDrawing.id] = newDrawing.fileSize ?? 0;

  const totalStorageUsed = Object.values(drawingSizeMap).reduce(
    (acc, size) => acc + size,
    0,
  );

  const [{ storageLimit }] = await db
    .select({ storageLimit: tables.User.storageLimit })
    .from(tables.User)
    .where(eq(tables.User.id, ctx.userId));

  return totalStorageUsed > storageLimit;
};
