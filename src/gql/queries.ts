import { createDb } from "@/db";
import { builder } from "./gql-builder";

const DrawingsSortFieldEnum = builder.enumType("DrawingsSortField", {
  values: ["name", "updatedAt", "createdAt", "fileSize"],
});
const SortDirectionEnum = builder.enumType("SortDirection", {
  values: ["asc", "desc"],
});

const DrawingsQueryArgs = builder.inputType("DrawingsQueryArgs", {
  fields: (t) => ({
    search: t.string({ required: false }),
    sortField: t.field({ type: DrawingsSortFieldEnum, required: false }),
    sortDirection: t.field({ type: SortDirectionEnum, required: false }),
  }),
});

builder.queryFields((t) => ({
  me: t.drizzleField({
    type: "User",
    resolve: async (query, _root, _args, ctx) => {
      const db = createDb(ctx.env);
      const user = await db.query.User.findFirst(
        query({ where: { id: { eq: ctx.userId } } }),
      );
      if (!user) throw new Error("User not found");
      return user;
    },
  }),

  drawing: t.drizzleField({
    type: "Drawing",
    nullable: true,
    args: { drawingId: t.arg.id() },
    resolve: async (query, _root, args, ctx) => {
      const db = createDb(ctx.env);
      const drawing = await db.query.Drawing.findFirst(
        query({ where: { id: { eq: args.drawingId } } }),
      );
      return drawing;
    },
  }),

  drawings: t.drizzleField({
    type: ["Drawing"],
    args: { query: t.arg({ type: DrawingsQueryArgs, required: false }) },
    resolve: async (query, _root, args, ctx) => {
      const db = createDb(ctx.env);

      const sortField = args.query?.sortField ?? "updatedAt";
      const sortDirection = args.query?.sortDirection ?? "desc";

      const searchFilter = args.query?.search
        ? { name: { like: `%${args.query.search}%` } }
        : {};

      const drawings = await db.query.Drawing.findMany(
        query({
          where: { AND: [{ userId: { eq: ctx.userId } }, searchFilter] },
          orderBy: { [sortField]: sortDirection },
        }),
      );
      return drawings;
    },
  }),
}));
