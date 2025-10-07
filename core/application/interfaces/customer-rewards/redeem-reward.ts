import { CustomerReward } from "@/core/domain/customerRewards/customerReward.entity";

export interface IRedeemReward {
  execute(customerId: number, rewardId: number): Promise<CustomerReward>;
}
