import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { DbRewardToDomainMapper } from "@/core/infrastructure/mappers";
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/commands";

export function makeRewardRepositoryDrizzle(): RewardRepository {
  const dbRewardToDomainMapper = new DbRewardToDomainMapper();
  return new RewardRepositoryDrizzle({
    dbClient: db,
    rewardTable: rewards,
    rewardToDomainMapper: dbRewardToDomainMapper
  });
}