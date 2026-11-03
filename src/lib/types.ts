import { User } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "astro/zod";

export const zUserSelect = createSelectSchema(User);
export type UserSelect = z.infer<typeof zUserSelect>;

export type UserSessionInfo = {
  id: string;
  userId: string;
  expiresAt: Date;
};

export const zDrawingsSearch = z.string().max(100);
export type DrawingsSearch = z.infer<typeof zDrawingsSearch>;

export const zDrawingName = z.string().trim().min(1).max(100);

const zDrawingsSortField = z.enum([
  "name",
  "updatedAt",
  "createdAt",
  "fileSize",
]);
const zDrawingsSort = z.object({
  field: zDrawingsSortField,
  direction: z.enum(["asc", "desc"]),
});
export type DrawingsSortField = z.infer<typeof zDrawingsSortField>;
export type DrawingsSort = z.infer<typeof zDrawingsSort>;

export const zDrawingsQueryParams = z.object({
  search: zDrawingsSearch.optional(),
  sort: zDrawingsSort.optional(),
});
export type DrawingsQueryParams = z.infer<typeof zDrawingsQueryParams>;

export const defaultDrawingSort: DrawingsSort = {
  field: "updatedAt",
  direction: "desc",
};
