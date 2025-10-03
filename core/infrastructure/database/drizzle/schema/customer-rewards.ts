import { sqliteTable, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { customers } from './customers';
import { rewards } from './rewards';

export const customerRewards = sqliteTable(
  'customer_rewards',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    customerId: integer('customer_id')
      .notNull()
      .references(() => customers.id),
    rewardId: integer('reward_id')
      .notNull()
      .references(() => rewards.id),
    redeemedAt: integer('redeemed_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    uniqueIndex('unique_customer_reward').on(
      table.customerId,
      table.rewardId
    )
  ]
);
