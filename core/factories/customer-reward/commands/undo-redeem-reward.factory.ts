import { UndoRedeemReward } from "@/core/application/interfaces/customers-rewards";
import { UndoRedeemRewardUseCase } from "@/core/application/use-cases";
import {
  makeCustomerRewardRepositoryDrizzle,
  makeRewardRepositoryDrizzle
} from "@/core/factories/repositories";

export function makeUndoRedeemReward(): UndoRedeemReward {
  const rewardRepo = makeRewardRepositoryDrizzle();

  const customerRewardRepo = makeCustomerRewardRepositoryDrizzle();

  return new UndoRedeemRewardUseCase(
    rewardRepo,
    customerRewardRepo
  );
}