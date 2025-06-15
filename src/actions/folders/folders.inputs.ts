import { z } from "zod";

const folderInputs = {
  list: z.any(),
  create: z.object({
    name: z.string().min(1).max(100),
    parentFolderId: z.string().uuid().optional(),
  }),
};

export default folderInputs;
