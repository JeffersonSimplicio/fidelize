import { DisableReward } from "@/core/application/interfaces/rewards";
import { DisableRewardUseCase } from "@/core/application/use-cases/rewards";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { DbRewardToDomainMapper } from "@/core/infrastructure/mappers";
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/commands";

export function makeDisableReward(): DisableReward {
  const mapperToDomain = new DbRewardToDomainMapper();
  const rewardRepo = new RewardRepositoryDrizzle(db, rewards, mapperToDomain);
  return new DisableRewardUseCase(rewardRepo);
}