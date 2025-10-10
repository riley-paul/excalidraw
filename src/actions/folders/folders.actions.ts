import { defineAction } from "astro:actions";
import * as folderInputs from "./folders.inputs";
import * as folderHandlers from "./folders.handlers";

export const list = defineAction({
  input: folderInputs.list,
  handler: folderHandlers.list,
});

export const create = defineAction({
  input: folderInputs.create,
  handler: folderHandlers.create,
});

export const update = defineAction({
  input: folderInputs.update,
  handler: folderHandlers.update,
});

export const remove = defineAction({
  input: folderInputs.remove,
  handler: folderHandlers.remove,
});
