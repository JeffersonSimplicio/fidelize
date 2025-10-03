import { customerRewards } from '@/core/infrastructure/database/drizzle/schema';

export type CustomerRewardsTable = typeof customerRewards;

export type CustomerRewardsSelect = typeof customerRewards.$inferSelect;