import { Drawing, Folder, User } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "astro:schema";

export const zUserSelect = createSelectSchema(User);
export const zUserInsert = createInsertSchema(User);
export type UserSelect = z.infer<typeof zUserSelect>;
export type UserInsert = z.infer<typeof zUserInsert>;

export type UserSessionInfo = {
  id: string;
  userId: string;
  expiresAt: Date;
};

export const zDrawingSelect = createSelectSchema(Drawing);
export const zDrawingInsert = createInsertSchema(Drawing);
export type DrawingSelect = z.infer<typeof zDrawingSelect>;
export type DrawingSelectWithContent = DrawingSelect & {
  content: string | null;
};
export type DrawingInsert = z.infer<typeof zDrawingInsert>;

export const zFolderSelect = createSelectSchema(Folder);
export const zFolderInsert = createInsertSchema(Folder);
export type FolderSelect = z.infer<typeof zFolderSelect>;
export type FolderInsert = z.infer<typeof zFolderInsert>;

export const zDrawingsSearch = z.string().max(100);
export type DrawingsSearch = z.infer<typeof zDrawingsSearch>;

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
