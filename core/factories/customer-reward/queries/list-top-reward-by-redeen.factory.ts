import { ListTopRewardsByRedeem } from "@/core/application/interfaces/customers-rewards";
import { ListTopRewardsByRedeemUseCase } from "@/core/application/use-cases/customers-rewards";
import { CustomerRewardQueryRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle";
import {
  DbRewardToDomainMapper,
  RewardEntityToDtoMapper,
  DbCustomerRewardsToDomainMapper,
} from "@/core/infrastructure/mappers";
import { db } from "@/core/infrastructure/database/drizzle/db";
import {
  rewards,
  customerRewards
} from '@/core/infrastructure/database/drizzle/schema';

export function makeListTopRewardByRedeem(): ListTopRewardsByRedeem {
  const dbRewardToDomainMapper = new DbRewardToDomainMapper();
  const dbCustomerRewardsToDomainMapper = new DbCustomerRewardsToDomainMapper();
  const customerRewardRepo = new CustomerRewardQueryRepositoryDrizzle({
    dbClient: db,
    rewardTable: rewards,
    customerRewardTable: customerRewards,
    rewardToDomainMapper: dbRewardToDomainMapper,
    customerRewardToDomainMapper: dbCustomerRewardsToDomainMapper,
  });
  const rewardMapToDto = new RewardEntityToDtoMapper();
  return new ListTopRewardsByRedeemUseCase(customerRewardRepo, rewardMapToDto);
}