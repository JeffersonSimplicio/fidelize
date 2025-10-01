import { rewards } from '@/core/infrastructure/database/drizzle/schema';

export type RewardTable = typeof rewards;

export type RewardSelect = typeof rewards.$inferSelect;