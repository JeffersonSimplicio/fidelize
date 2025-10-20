import { ListCustomerRewards } from "@/core/application/interfaces/customers-rewards";
import {
  CustomerRewardEntityToDtoMapper,
} from "@/core/infrastructure/mappers";
import { ListCustomerRewardsUseCase } from "@/core/application/use-cases/customers-rewards";
import { makeCustomerRewardQueryRepositoryDrizzle } from "@/core/factories/infrastructure/customer-reward-query-repository-drizzle.factory";

export function makeListCustomerRewards(): ListCustomerRewards {
  const customerRewardRepo = makeCustomerRewardQueryRepositoryDrizzle();

  const customerRewardEntityToDtoMapper = new CustomerRewardEntityToDtoMapper()

  return new ListCustomerRewardsUseCase(
    customerRewardRepo,
    customerRewardEntityToDtoMapper
  );
}