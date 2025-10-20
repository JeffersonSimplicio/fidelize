import { db } from "@/core/infrastructure/database/drizzle/db";
import {
  rewards,
  customers,
  customerRewards,
} from '@/core/infrastructure/database/drizzle/schema';
import {
  DbCustomerToDomainMapper,
  DbRewardToDomainMapper,
  DbCustomerRewardsToDomainMapper,
  RewardEntityToDtoMapper,
} from "@/core/infrastructure/mappers";
import {
  CustomerRepositoryDrizzle,
  CustomerRewardQueryRepositoryDrizzle
} from "@/core/infrastructure/repositories/drizzle/";
import {
  ListRewardsRedeemedByCustomerUseCase
} from "@/core/application/use-cases/customers-rewards/queries";
import { ListRewardsRedeemedByCustomer } from "@/core/application/interfaces/customers-rewards/queries";

export function makeListRewardsRedeemedByCustomer(): ListRewardsRedeemedByCustomer {
  const dbCustomerToDomainMapper = new DbCustomerToDomainMapper();
  const customerRepo = new CustomerRepositoryDrizzle({
    dbClient: db,
    customerTable: customers,
    customerToDomainMapper: dbCustomerToDomainMapper
  });

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
  return new ListRewardsRedeemedByCustomerUseCase(
    customerRepo,
    customerRewardRepo,
    rewardMapToDto
  );
}