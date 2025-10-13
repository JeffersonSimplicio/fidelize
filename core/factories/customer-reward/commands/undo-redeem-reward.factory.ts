import { UndoRedeemReward } from "@/core/application/interfaces/customers-rewards";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards, customerRewards } from '@/core/infrastructure/database/drizzle/schema';
import {
  DbRewardToDomainMapper,
  DbCustomerRewardsToDomainMapper,
} from "@/core/infrastructure/mappers";
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/write/reward.repository";
import { CustomerRewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/write/customer-reward.repository";
import { UndoRedeemRewardUseCase } from "@/core/application/use-cases";

export function makeUndoRedeemReward(): UndoRedeemReward {
  const mapperRewardToDomain = new DbRewardToDomainMapper();
  const rewardRepo = new RewardRepositoryDrizzle(
    db,
    rewards,
    mapperRewardToDomain,
  );

  const mapperCustomerRewardToDomain = new DbCustomerRewardsToDomainMapper();
  const customerRewardRepo = new CustomerRewardRepositoryDrizzle(
    db,
    customerRewards,
    mapperCustomerRewardToDomain
  )

  return new UndoRedeemRewardUseCase(
    rewardRepo,
    customerRewardRepo
  );
}