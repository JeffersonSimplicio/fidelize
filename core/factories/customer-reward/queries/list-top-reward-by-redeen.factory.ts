import { ListTopRewardsByRedeem } from "@/core/application/interfaces/customers-rewards";
import { ListTopRewardsByRedeemUseCase } from "@/core/application/use-cases/customers-rewards";
import { makeCustomerRewardQueryRepositoryDrizzle } from "@/core/factories/repositories";
import { RewardEntityToDtoMapper } from "@/core/infrastructure/mappers";

export function makeListTopRewardByRedeem(): ListTopRewardsByRedeem {
  const customerRewardQueryRepo = makeCustomerRewardQueryRepositoryDrizzle();
  const rewardEntityToDtoMapper = new RewardEntityToDtoMapper();
  return new ListTopRewardsByRedeemUseCase({
    customerRewardQueryRepo: customerRewardQueryRepo,
    rewardToDtoMapper: rewardEntityToDtoMapper,
  });
}