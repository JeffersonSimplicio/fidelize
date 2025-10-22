import { ListAvailableRewardsForCustomerUseCase } from "@/core/application/use-cases/customers-rewards";
import { RewardEntityToDtoMapper } from "@/core/infrastructure/mappers";
import {
  makeCustomerRewardQueryRepositoryDrizzle,
  makeCustomerRepositoryDrizzle
} from "@/core/factories/repositories";

export function makeListAvailableRewardsForCustomer() {
  const customerRepo = makeCustomerRepositoryDrizzle();
  const customerRewardQueryRepo = makeCustomerRewardQueryRepositoryDrizzle();

  const rewardEntityToDtoMapper = new RewardEntityToDtoMapper();
  return new ListAvailableRewardsForCustomerUseCase({
    customerRepo: customerRepo,
    customerRewardQueryRepo: customerRewardQueryRepo,
    rewardToDtoMapper: rewardEntityToDtoMapper
  });
}