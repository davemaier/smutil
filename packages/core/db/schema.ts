import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

const createAt = {
  createdAt: timestamp("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
};

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  name: text("name"),
  teamId: text("teamId").references(() => teams.id),
  ...createAt,
});

export const teams = pgTable("teams", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name"),
  ...createAt,
});

export const domains = pgTable("domains", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name"),
  userId: text("userId").references(() => users.id),
  createdByUserId: text("createdByUserId").references(() => users.id),
  teamId: text("teamId").references(() => teams.id),
  plan: text("plan"),
  paymentStatus: text("paymentStatus"),
  ...createAt,
});

export const hooks = pgTable("hooks", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name"),
  domainId: text("domainId").references(() => domains.id),
  ...createAt,
});

export const hookDomains = pgTable("hookDomains", {
  id: text("id").primaryKey().$defaultFn(createId),
  hookId: text("hookId").references(() => hooks.id),
  domainId: text("domainId").references(() => domains.id),
  totalRequests: integer("totalRequests"),
  ...createAt,
});
