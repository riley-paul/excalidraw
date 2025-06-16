import { z } from "zod";

const folderInputs = {
  list: z.any(),
  create: z.object({
    name: z.string().min(1).max(100),
    parentFolderId: z.string().uuid().nullish(),
  }),
  update: z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(100).optional(),
    parentFolderId: z.string().uuid().nullish(),
  }),
  remove: z.object({
    id: z.string().uuid(),
  }),
};

export default folderInputs;
