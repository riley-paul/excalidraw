import { defineAction } from "astro:actions";
import folderInputs from "./folders.inputs";
import folderHanlders from "./folders.handlers";

export const create = defineAction({
  input: folderInputs.create,
  handler: folderHanlders.create,
});
