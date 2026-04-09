import { createDb } from "@/db";
import { Drawing, User } from "@/db/schema";
import { eq, sum } from "drizzle-orm";
import { getStorageUsed, isAuthorized } from "@/actions/helpers";
import * as userInputs from "./users.inputs";
import type { UserSelect } from "@/lib/types";
import type { ActionHandler } from "node_modules/astro/dist/actions/runtime/types";
import { env } from "cloudflare:workers";

export const getMe: ActionHandler<
  typeof userInputs.getMe,
  UserSelect | null
> = async (_, c) => {
  const user = c.locals.user;
  if (!user) return null;

  const db = createDb(env);
  const [currentUser] = await db
    .select()
    .from(User)
    .where(eq(User.id, user.id));

  if (!currentUser) return null;

  const storageUsed = await getStorageUsed(user.id);

  return { ...currentUser, storageUsed };
};

export const remove: ActionHandler<typeof userInputs.remove, null> = async (
  _,
  c,
) => {
  const db = createDb(env);
  const userId = isAuthorized(c).id;
  const bucket = env.R2_BUCKET;

  const userDrawings = await db
    .select()
    .from(Drawing)
    .where(eq(Drawing.userId, userId));

  await Promise.all(
    userDrawings.map(async ({ id }) => {
      await bucket.delete(id);
      await bucket.delete(`${id}-thumbnail`);
    }),
  );

  await db.delete(User).where(eq(User.id, userId));
  return null;
};
