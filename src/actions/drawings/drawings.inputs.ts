import { z } from "zod";

export const get = z.object({
  id: z.string().uuid(),
  withContent: z.boolean().default(false),
});

export const list = z.any();

export const create = z.object({
  name: z.string().min(1).max(100),
  parentFolderId: z.string().uuid().nullish(),
});

export const update = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  parentFolderId: z.string().uuid().nullish(),
});

export const remove = z.object({ id: z.string().uuid() });

export const save = z.object({
  id: z.string().uuid(),
  content: z.instanceof(File),
  thumbnail: z.instanceof(File),
});
