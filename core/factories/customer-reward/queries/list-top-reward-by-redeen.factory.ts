import { ListTopRewardsByRedeem } from "@/core/application/interfaces/customers-rewards";
import { ListTopRewardsByRedeemUseCase } from "@/core/application/use-cases/customers-rewards";
import { RewardEntityToDtoMapper } from "@/core/infrastructure/mappers";
import { makeCustomerRewardQueryRepositoryDrizzle } from "@/core/factories/infrastructure/customer-reward-query-repository-drizzle.factory";

export function makeListTopRewardByRedeem(): ListTopRewardsByRedeem {
  const customerRewardRepo = makeCustomerRewardQueryRepositoryDrizzle();
  const rewardMapToDto = new RewardEntityToDtoMapper();
  return new ListTopRewardsByRedeemUseCase(customerRewardRepo, rewardMapToDto);
}