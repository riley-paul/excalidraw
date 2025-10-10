import { defineAction } from "astro:actions";
import * as drawingInputs from "./drawings.inputs";
import * as drawingHandlers from "./drawings.handlers";

export const get = defineAction({
  input: drawingInputs.get,
  handler: drawingHandlers.get,
});

export const list = defineAction({
  input: drawingInputs.list,
  handler: drawingHandlers.list,
});

export const create = defineAction({
  input: drawingInputs.create,
  handler: drawingHandlers.create,
});

export const update = defineAction({
  input: drawingInputs.update,
  handler: drawingHandlers.update,
});

export const save = defineAction({
  accept: "form",
  input: drawingInputs.save,
  handler: drawingHandlers.save,
});

export const remove = defineAction({
  input: drawingInputs.remove,
  handler: drawingHandlers.remove,
});

export const duplicate = defineAction({
  input: drawingInputs.duplicate,
  handler: drawingHandlers.duplicate,
});
