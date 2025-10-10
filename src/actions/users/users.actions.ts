import { defineAction } from "astro:actions";
import * as userHandlers from "./users.handlers";
import * as userInputs from "./users.inputs";

export const getMe = defineAction({
  input: userInputs.getMe,
  handler: userHandlers.getMe,
});

export const remove = defineAction({
  input: userInputs.remove,
  handler: userHandlers.remove,
});
