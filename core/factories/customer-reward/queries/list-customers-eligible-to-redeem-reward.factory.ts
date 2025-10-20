import { ListCustomersEligibleToRedeemReward } from "@/core/application/interfaces/customers-rewards";
import { ListEligibleCustomersForRewardUseCase } from "@/core/application/use-cases/customers-rewards";
import {
  makeCustomerRewardQueryRepositoryDrizzle,
  makeRewardRepositoryDrizzle
} from "@/core/factories/repositories";
import { CustomerEntityToDtoMapper } from "@/core/infrastructure/mappers";

export function makeListCustomersEligibleToRedeemReward(): ListCustomersEligibleToRedeemReward {
  const rewardRepo = makeRewardRepositoryDrizzle();
  const customerRewardRepo = makeCustomerRewardQueryRepositoryDrizzle();
  const mapperToDto = new CustomerEntityToDtoMapper();
  return new ListEligibleCustomersForRewardUseCase(
    rewardRepo,
    customerRewardRepo,
    mapperToDto
  );
}