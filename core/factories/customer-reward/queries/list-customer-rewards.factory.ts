import { ListCustomerRewards } from "@/core/application/interfaces/customers-rewards";
import { ListCustomerRewardsUseCase } from "@/core/application/use-cases/customers-rewards";
import { makeCustomerRewardQueryRepositoryDrizzle } from "@/core/factories/repositories";
import {
  CustomerRewardEntityToDtoMapper,
} from "@/core/infrastructure/mappers";

export function makeListCustomerRewards(): ListCustomerRewards {
  const customerRewardQueryRepo = makeCustomerRewardQueryRepositoryDrizzle();

  const customerRewardEntityToDtoMapper = new CustomerRewardEntityToDtoMapper()

  return new ListCustomerRewardsUseCase({
    customerRewardQueryRepo: customerRewardQueryRepo,
    customerRewardToDtoMapper: customerRewardEntityToDtoMapper
  });
}