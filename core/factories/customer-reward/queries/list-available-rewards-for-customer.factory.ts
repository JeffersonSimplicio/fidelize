import { ListAvailableRewardsForCustomerUseCase } from "@/core/application/use-cases/customers-rewards";
import { RewardEntityToDtoMapper } from "@/core/infrastructure/mappers";
import {
  makeCustomerRewardQueryRepositoryDrizzle,
  makeCustomerRepositoryDrizzle
} from "@/core/factories/repositories";

export function makeListAvailableRewardsForCustomer() {
  const customerRepo = makeCustomerRepositoryDrizzle();
  const customerRewardQueryRepo = makeCustomerRewardQueryRepositoryDrizzle();

  const mapperToDto = new RewardEntityToDtoMapper();
  return new ListAvailableRewardsForCustomerUseCase(
    customerRepo,
    customerRewardQueryRepo,
    mapperToDto
  );
}