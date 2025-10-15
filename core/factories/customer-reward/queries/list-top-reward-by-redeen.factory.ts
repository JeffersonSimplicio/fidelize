import { ListTopRewardsByRedeem } from "@/core/application/interfaces/customers-rewards";
import { ListTopRewardsByRedeemUseCase } from "@/core/application/use-cases/customers-rewards";
import { CustomerRewardQueryRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle";
import {
  DbRewardToDomainMapper,
  RewardEntityToDtoMapper
} from "@/core/infrastructure/mappers";
import { db } from "@/core/infrastructure/database/drizzle/db";
import {
  rewards,
  customerRewards
} from '@/core/infrastructure/database/drizzle/schema';

export function makeListTopRewardByRedeem(): ListTopRewardsByRedeem {
  const dbRewardToDomainMapper = new DbRewardToDomainMapper();
  const customerRewardRepo = new CustomerRewardQueryRepositoryDrizzle({
    dbClient: db,
    rewardTable: rewards,
    customerRewardTable: customerRewards,
    rewardToDomainMapper: dbRewardToDomainMapper
  });
  const rewardMapToDto = new RewardEntityToDtoMapper();
  return new ListTopRewardsByRedeemUseCase(customerRewardRepo, rewardMapToDto);
}