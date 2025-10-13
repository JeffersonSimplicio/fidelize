import { sqliteTable, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import {
  customers,
  rewards
} from "@/core/infrastructure/database/drizzle/schema";

export const customerRewards = sqliteTable(
  'customer_rewards',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    customerId: integer('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    rewardId: integer('reward_id')
      .notNull()
      .references(() => rewards.id, { onDelete: 'cascade' }),
    redeemedAt: integer('redeemed_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    uniqueIndex('unique_customer_reward').on(
      table.customerId,
      table.rewardId
    )
  ]
);
