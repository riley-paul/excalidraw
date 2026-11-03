import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

const relations = defineRelations(schema, (r) => ({
  User: {
    drawings: r.many.Drawing({
      from: r.User.id,
      to: r.Drawing.userId,
    }),
    folders: r.many.Folder({
      from: r.User.id,
      to: r.Folder.userId,
    }),
    sessions: r.many.UserSession({
      from: r.User.id,
      to: r.UserSession.userId,
    }),
  },
  Drawing: {
    folder: r.one.Folder({
      from: r.Drawing.parentFolderId,
      to: r.Folder.id,
    }),
  },
  Folder: {
    drawings: r.many.Drawing({
      from: r.Folder.id,
      to: r.Drawing.parentFolderId,
    }),
  },
}));

export default relations;
