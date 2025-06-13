import { z } from "zod";

const drawingInputs = {
  get: z.object({ id: z.string().uuid() }),
  list: z.any(),
  create: z.object({
    title: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
  }),
  update: z.object({
    id: z.string().uuid(),
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    content: z.any().optional(),
  }),
  remove: z.object({ id: z.string().uuid() }),
  save: z.object({
    id: z.string().uuid(),
    content: z.instanceof(File),
    thumbnail: z.instanceof(File).optional(),
  }),
};
export default drawingInputs;
