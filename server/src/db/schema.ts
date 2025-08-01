
import { serial, text, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const buttonClicksTable = pgTable('button_clicks', {
  id: serial('id').primaryKey(),
  clicked_at: timestamp('clicked_at').defaultNow().notNull(),
  user_session: text('user_session') // Nullable by default, matches Zod schema
});

// TypeScript type for the table schema
export type ButtonClick = typeof buttonClicksTable.$inferSelect; // For SELECT operations
export type NewButtonClick = typeof buttonClicksTable.$inferInsert; // For INSERT operations

// Important: Export all tables for proper query building
export const tables = { buttonClicks: buttonClicksTable };
