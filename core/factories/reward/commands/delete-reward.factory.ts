import { DeleteReward } from "@/core/application/interfaces/rewards";
import { DeleteRewardUseCase } from "@/core/application/use-cases/rewards";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { DbRewardToDomainMapper } from "@/core/infrastructure/mappers";
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/commands";

export function makeDeleteReward(): DeleteReward {
  const dbRewardToDomainMapper = new DbRewardToDomainMapper();
  const rewardRepo = new RewardRepositoryDrizzle({
    dbClient: db,
    rewardTable: rewards,
    rewardToDomainMapper: dbRewardToDomainMapper
  });
  return new DeleteRewardUseCase(rewardRepo);
}