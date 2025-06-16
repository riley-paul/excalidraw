import { z } from "zod";

const drawingInputs = {
  get: z.object({ id: z.string().uuid() }),
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
  remove: z.object({ id: z.string().uuid() }),
  save: z.object({
    id: z.string().uuid(),
    content: z.instanceof(File),
    thumbnail: z.instanceof(File),
  }),
};
export default drawingInputs;
