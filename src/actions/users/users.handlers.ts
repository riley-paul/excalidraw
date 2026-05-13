import { createDb } from "@/db";
import { Drawing, User } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getStorageUsed, isAuthorized } from "@/actions/helpers";
import * as userInputs from "./users.inputs";
import type { UserSelect } from "@/lib/types";
import type { ActionHandler } from "node_modules/astro/dist/actions/runtime/types";

export const getMe: ActionHandler<
  typeof userInputs.getMe,
  UserSelect | null
> = async (_, c) => {
  const user = c.locals.user;
  if (!user) return null;

  const db = createDb(c.locals.env);
  const [currentUser] = await db
    .select()
    .from(User)
    .where(eq(User.id, user.id));

  if (!currentUser) return null;

  const storageUsed = await getStorageUsed(c);

  return { ...currentUser, storageUsed };
};

export const remove: ActionHandler<typeof userInputs.remove, null> = async (
  _,
  c,
) => {
  const db = createDb(c.locals.env);
  const userId = isAuthorized(c).id;
  const bucket = c.locals.env.R2_BUCKET;

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
