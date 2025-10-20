import { RedeemReward } from "@/core/application/interfaces/customers-rewards";
import { RedeemRewardUseCase } from "@/core/application/use-cases";
import {
  makeCustomerRepositoryDrizzle,
  makeCustomerRewardRepositoryDrizzle,
  makeRewardRepositoryDrizzle
} from "@/core/factories/repositories";
import { CustomerRewardEntityToDtoMapper } from "@/core/infrastructure/mappers";

export function makeRedeemReward(): RedeemReward {
  const rewardRepo = makeRewardRepositoryDrizzle();

  const customerRepo = makeCustomerRepositoryDrizzle();

  const customerRewardRepo = makeCustomerRewardRepositoryDrizzle();

  const mapperCustomerRewardEntityToDto = new CustomerRewardEntityToDtoMapper();
  return new RedeemRewardUseCase(
    rewardRepo,
    customerRepo,
    customerRewardRepo,
    mapperCustomerRewardEntityToDto
  );
}