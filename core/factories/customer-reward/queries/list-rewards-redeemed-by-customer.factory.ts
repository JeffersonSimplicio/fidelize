import { db } from "@/core/infrastructure/database/drizzle/db";
import { customers } from '@/core/infrastructure/database/drizzle/schema';
import {
  DbCustomerToDomainMapper,
  RewardEntityToDtoMapper,
} from "@/core/infrastructure/mappers";
import {
  CustomerRepositoryDrizzle,
} from "@/core/infrastructure/repositories/drizzle/";
import {
  ListRewardsRedeemedByCustomerUseCase
} from "@/core/application/use-cases/customers-rewards/queries";
import { ListRewardsRedeemedByCustomer } from "@/core/application/interfaces/customers-rewards/queries";
import { makeCustomerRewardQueryRepositoryDrizzle } from "@/core/factories/infrastructure/customer-reward-query-repository-drizzle.factory";

export function makeListRewardsRedeemedByCustomer(): ListRewardsRedeemedByCustomer {
  const dbCustomerToDomainMapper = new DbCustomerToDomainMapper();
  const customerRepo = new CustomerRepositoryDrizzle({
    dbClient: db,
    customerTable: customers,
    customerToDomainMapper: dbCustomerToDomainMapper
  });

  const customerRewardRepo = makeCustomerRewardQueryRepositoryDrizzle();

  const rewardMapToDto = new RewardEntityToDtoMapper();
  return new ListRewardsRedeemedByCustomerUseCase(
    customerRepo,
    customerRewardRepo,
    rewardMapToDto
  );
}