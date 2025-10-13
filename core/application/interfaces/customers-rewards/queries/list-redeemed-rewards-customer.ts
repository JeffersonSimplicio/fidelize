import { Reward } from "@/core/domain/rewards/reward.entity";

export interface IListRedeemedRewardsForCustomer {
  execute(customerId: number): Promise<Reward[]>;
}