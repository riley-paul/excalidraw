import { defineAction } from "astro:actions";
import folderInputs from "./folders.inputs";
import folderHanlders from "./folders.handlers";

export const list = defineAction({
  input: folderInputs.list,
  handler: folderHanlders.list,
});

export const create = defineAction({
  input: folderInputs.create,
  handler: folderHanlders.create,
});
