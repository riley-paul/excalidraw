import { type ActionHandler } from "astro:actions";
import { createDb } from "@/db";
import { User } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAuthorized } from "@/actions/helpers";
import type userInputs from "./users.inputs";
import type { UserSelect } from "@/lib/types";

const getMe: ActionHandler<typeof userInputs.getMe, UserSelect | null> = async (
  _,
  c
) => {
  const user = c.locals.user;
  if (!user) return null;

  const db = createDb(c.locals.runtime.env);
  const [currentUser] = await db
    .select()
    .from(User)
    .where(eq(User.id, user.id));
  
  if (!currentUser) return null;
  return currentUser;
};

const remove: ActionHandler<typeof userInputs.remove, null> = async (_, c) => {
  const db = createDb(c.locals.runtime.env);
  const userId = isAuthorized(c).id;
  await db.delete(User).where(eq(User.id, userId));
  return null;
};

const userHandlers = {
  getMe,
  remove,
};
export default userHandlers;
