import { z } from "zod/v4";

export const zDragData = z.object({
  id: z.string(),
  type: z.enum(["drawing", "folder", "root"]),
  parentFolderId: z.string().nullable(),
});
export type DragData = z.infer<typeof zDragData>;
