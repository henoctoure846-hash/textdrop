import { pgTable, text, timestamp, serial, varchar } from "drizzle-orm/pg-core";

export const pastes = pgTable("pastes", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 20 }).notNull().unique(),
  title: varchar("title", { length: 500 }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
