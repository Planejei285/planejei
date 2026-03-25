import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subscription plans for users
 */
export const subscriptions = mysqlTable('subscriptions', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  plan: mysqlEnum('plan', ['free', 'basic', 'premium']).default('free').notNull(),
  status: mysqlEnum('status', ['active', 'canceled', 'expired']).default('active').notNull(),
  stripeCustomerId: varchar('stripeCustomerId', { length: 255 }),
  stripeSubscriptionId: varchar('stripeSubscriptionId', { length: 255 }),
  currentPeriodStart: timestamp('currentPeriodStart'),
  currentPeriodEnd: timestamp('currentPeriodEnd'),
  canceledAt: timestamp('canceledAt'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Planner data for users
 */
export const plannerData = mysqlTable('plannerData', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  dataType: varchar('dataType', { length: 50 }).notNull(),
  date: varchar('date', { length: 10 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export type PlannerData = typeof plannerData.$inferSelect;
export type InsertPlannerData = typeof plannerData.$inferInsert;