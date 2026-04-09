import { createDb } from "@/db";
import { Drawing } from "@/db/schema";
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
