import { z } from "astro/zod";

export const zDragData = z.object({
  id: z.string(),
  type: z.enum(["drawing", "folder", "root"]),
  parentFolderId: z.string().nullable(),
});
export type DragData = z.infer<typeof zDragData>;
