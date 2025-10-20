import { db } from "@/core/infrastructure/database/drizzle/db";
import {
  rewards,
  customerRewards
} from '@/core/infrastructure/database/drizzle/schema';
import { ListCustomerRewards } from "@/core/application/interfaces/customers-rewards";
import { CustomerRewardQueryRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle";
import {
  DbRewardToDomainMapper,
  DbCustomerRewardsToDomainMapper,
  CustomerRewardEntityToDtoMapper,
} from "@/core/infrastructure/mappers";
import { ListCustomerRewardsUseCase } from "@/core/application/use-cases/customers-rewards";

export function makeListCustomerRewards(): ListCustomerRewards {
  const dbRewardToDomainMapper = new DbRewardToDomainMapper();
  const dbCustomerRewardsToDomainMapper = new DbCustomerRewardsToDomainMapper();
  const customerRewardRepo = new CustomerRewardQueryRepositoryDrizzle({
    dbClient: db,
    rewardTable: rewards,
    customerRewardTable: customerRewards,
    rewardToDomainMapper: dbRewardToDomainMapper,
    customerRewardToDomainMapper: dbCustomerRewardsToDomainMapper,
  });

  const customerRewardEntityToDtoMapper = new CustomerRewardEntityToDtoMapper()

  return new ListCustomerRewardsUseCase(
    customerRewardRepo,
    customerRewardEntityToDtoMapper
  );
}