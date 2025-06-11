import { User } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const zUserSelect = createSelectSchema(User);
export const zUserInsert = createInsertSchema(User);
export type UserSelect = z.infer<typeof zUserSelect>;
export type UserInsert = z.infer<typeof zUserInsert>;

export type UserSessionInfo = {
  id: string;
  userId: string;
  expiresAt: Date;
};
