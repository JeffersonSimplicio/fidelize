import { Reward } from "@/core/domain/rewards/reward.entity";

export interface IListAvailableRewardsForCustomer {
  execute(customerId: number): Promise<Reward[]>;
}