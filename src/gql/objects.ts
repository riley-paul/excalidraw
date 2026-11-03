import { builder } from "./gql-builder";

builder.drizzleObject("User", {
  name: "UserObjectType",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    email: t.exposeString("email"),
    avatarUrl: t.exposeString("avatarUrl", { nullable: true }),
  }),
});

builder.drizzleObject("Drawing", {
  name: "DrawingObjectType",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    fileSize: t.exposeInt("fileSize", { nullable: true }),
    savedAt: t.exposeString("savedAt", { nullable: true }),
  }),
});

builder.drizzleObject("Folder", {
  name: "FolderObjectType",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
  }),
});
