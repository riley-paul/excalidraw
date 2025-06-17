import {
  integer,
  sqliteTable,
  text,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";

const id = text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());

const userId = text()
  .notNull()
  .references(() => User.id, { onDelete: "cascade" });

const timeStamps = {
  createdAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString())
    .$onUpdateFn(() => new Date().toISOString()),
};

export const User = sqliteTable("user", {
  id,
  email: text().notNull().unique(),
  name: text().notNull(),
  avatarUrl: text(),

  googleId: text().unique(),
  githubId: integer().unique(),
  githubUsername: text().unique(),
  ...timeStamps,
});

export const UserSession = sqliteTable("userSession", {
  id,
  userId,
  expiresAt: integer({ mode: "timestamp_ms" }).notNull(),
  ...timeStamps,
});

export const Drawing = sqliteTable("drawing", {
  id,
  userId,
  name: text().notNull().default("Untitled"),
  parentFolderId: text().references(() => Folder.id, { onDelete: "set null" }),
  fileSize: integer().default(0),
  ...timeStamps,
});

export const Folder = sqliteTable("folder", {
  id,
  userId,
  name: text().notNull().default("New Folder"),
  parentFolderId: text().references((): AnySQLiteColumn => Folder.id, {
    onDelete: "set null",
  }),
  ...timeStamps,
});
