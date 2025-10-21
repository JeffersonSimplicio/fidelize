import { ListCustomersWhoRedeemedRewardUseCase } from "@/core/application/use-cases/customers-rewards";
import {
  makeCustomerRewardQueryRepositoryDrizzle,
  makeRewardRepositoryDrizzle
} from "@/core/factories/repositories";
import { CustomerEntityToDtoMapper } from "@/core/infrastructure/mappers";

export function makeListCustomersWhoRedeemedReward() {
  const rewardRepo = makeRewardRepositoryDrizzle();
  const customerRewardQueryRepo = makeCustomerRewardQueryRepositoryDrizzle();
  const mapperToDto = new CustomerEntityToDtoMapper();
  return new ListCustomersWhoRedeemedRewardUseCase(
    rewardRepo,
    customerRewardQueryRepo,
    mapperToDto
  );
}