import { DisableReward } from "@/core/application/interfaces/rewards";
import { DisableRewardUseCase } from "@/core/application/use-cases/rewards";
import { makeRewardRepositoryDrizzle } from "@/core/factories/repositories";

export function makeDisableReward(): DisableReward {
  const rewardRepo = makeRewardRepositoryDrizzle();
  return new DisableRewardUseCase(rewardRepo);
}