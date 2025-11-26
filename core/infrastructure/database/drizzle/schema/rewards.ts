import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const rewards = sqliteTable('rewards', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  pointsRequired: integer('points_required').notNull(),
  description: text('description').notNull(),
  isActive: integer('is_active').default(1).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
