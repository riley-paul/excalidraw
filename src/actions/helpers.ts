import { createDb } from "@/db";
import { Drawing, User } from "@/db/schema";
import type { DrawingSelect } from "@/lib/types";
import { ActionError, type ActionAPIContext } from "astro:actions";
import { env } from "cloudflare:workers";
import { eq, sum } from "drizzle-orm";

export const isAuthorized = (context: ActionAPIContext) => {
  const user = context.locals.user;
  if (!user) {
    throw new ActionError({
      code: "UNAUTHORIZED",
      message: "You are not logged in.",
    });
  }
  return user;
};

export const getStorageUsed = async (userId: string) => {
  const db = createDb(env);
  const [{ storageUsed }] = await db
    .select({ storageUsed: sum(Drawing.fileSize) })
    .from(Drawing)
    .where(eq(Drawing.userId, userId));
  return Number(storageUsed);
};

export const exceedsStorageLimit = async (
  userId: string,
  newDrawing: Pick<DrawingSelect, "id" | "fileSize">,
) => {
  const db = createDb(env);
  const drawingSizes = await db
    .select({ id: Drawing.id, fileSize: Drawing.fileSize })
    .from(Drawing)
    .where(eq(Drawing.userId, userId));

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
    .select({ storageLimit: User.storageLimit })
    .from(User)
    .where(eq(User.id, userId));

  return totalStorageUsed > storageLimit;
};
