import { db } from "@/core/infrastructure/database/drizzle/db";
import {
  rewards,
  customers,
  customerRewards,
} from '@/core/infrastructure/database/drizzle/schema';
import {
  DbCustomerToDomainMapper,
  DbRewardToDomainMapper,
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
  const customerMapToDomain = new DbCustomerToDomainMapper();
  const customerRepo = new CustomerRepositoryDrizzle(
    db,
    customers,
    customerMapToDomain
  );

  const rewardMapToDomain = new DbRewardToDomainMapper();
  const customerRewardRepo = new CustomerRewardQueryRepositoryDrizzle(
    db,
    rewards,
    customerRewards,
    rewardMapToDomain
  );

  const rewardMapToDto = new RewardEntityToDtoMapper();
  return new ListRewardsRedeemedByCustomerUseCase(
    customerRepo,
    customerRewardRepo,
    rewardMapToDto
  );
}