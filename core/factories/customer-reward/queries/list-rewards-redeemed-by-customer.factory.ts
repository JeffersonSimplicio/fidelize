import { ListRewardsRedeemedByCustomer } from "@/core/application/interfaces/customers-rewards/queries";
import {
  ListRewardsRedeemedByCustomerUseCase
} from "@/core/application/use-cases/customers-rewards/queries";
import {
  makeCustomerRepositoryDrizzle,
  makeCustomerRewardQueryRepositoryDrizzle
} from "@/core/factories/repositories";
import {
  RewardEntityToDtoMapper,
} from "@/core/infrastructure/mappers";

export function makeListRewardsRedeemedByCustomer(): ListRewardsRedeemedByCustomer {
  const customerRepo = makeCustomerRepositoryDrizzle();

  const customerRewardRepo = makeCustomerRewardQueryRepositoryDrizzle();

  const rewardMapToDto = new RewardEntityToDtoMapper();
  return new ListRewardsRedeemedByCustomerUseCase(
    customerRepo,
    customerRewardRepo,
    rewardMapToDto
  );
}