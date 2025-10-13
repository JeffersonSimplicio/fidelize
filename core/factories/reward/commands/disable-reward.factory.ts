import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/write/reward.repository";
import { DbRewardToDomainMapper } from "@/core/infrastructure/mappers";
import { DisableRewardUseCase } from "@/core/application/use-cases/rewards";
import { DisableReward } from "@/core/application/interfaces/rewards";

export function makeDisableReward(): DisableReward {
  const mapperToDomain = new DbRewardToDomainMapper();
  const rewardRepo = new RewardRepositoryDrizzle(db, rewards, mapperToDomain);
  return new DisableRewardUseCase(rewardRepo);
}