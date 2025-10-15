import { UndoRedeemReward } from "@/core/application/interfaces/customers-rewards";
import { UndoRedeemRewardUseCase } from "@/core/application/use-cases";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { customerRewards, rewards } from '@/core/infrastructure/database/drizzle/schema';
import {
  DbCustomerRewardsToDomainMapper,
  DbRewardToDomainMapper,
} from "@/core/infrastructure/mappers";
import { CustomerRewardRepositoryDrizzle, RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/commands";

export function makeUndoRedeemReward(): UndoRedeemReward {
  const dbRewardToDomainMapper = new DbRewardToDomainMapper();
  const rewardRepo = new RewardRepositoryDrizzle({
    dbClient: db,
    rewardTable: rewards,
    rewardToDomainMapper: dbRewardToDomainMapper
  });

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