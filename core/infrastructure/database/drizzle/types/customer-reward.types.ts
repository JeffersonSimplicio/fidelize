import { customerRewards } from '@/core/infrastructure/database/drizzle/schema';

export type CustomerRewardTable = typeof customerRewards;

export type CustomerRewardSelect = typeof customerRewards.$inferSelect;
